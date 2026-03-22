# Pocket Prayers - Stripe Subscription Plan

## Subscription Configuration

- **Price**: $5/month
- **Billing**: Monthly recurring
- **Trial**: None (MVP)
- **Currency**: USD

## Stripe Dashboard Setup

1. Create Product: "Pocket Prayers Premium"
2. Create Price: $5/month recurring
3. Note the Price ID: `price_xxxxx`
4. Configure webhook endpoint

## Checkout Flow

### 1. User Initiates Subscription

```typescript
// actions/subscription.ts
'use server'

import { stripe } from '@/lib/stripe'
import { createServerClient } from '@supabase/auth-helpers-nextjs'

export async function createCheckoutSession() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Unauthorized')
  
  // Check for existing customer
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()
  
  let customerId = subscription?.stripe_customer_id
  
  // Create customer if needed
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id }
    })
    customerId = customer.id
    
    // Update subscription record
    await supabase
      .from('subscriptions')
      .upsert({ 
        user_id: user.id, 
        stripe_customer_id: customerId 
      })
  }
  
  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{
      price: process.env.STRIPE_PRICE_ID!,
      quantity: 1
    }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/app/profile?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/app/teachings`,
    metadata: { userId: user.id }
  })
  
  return { url: session.url }
}
```

### 2. Frontend Redirects to Stripe

```typescript
// components/subscription/PricingCard.tsx
'use client'

import { createCheckoutSession } from '@/actions/subscription'

export function PricingCard() {
  const [loading, setLoading] = useState(false)
  
  async function handleSubscribe() {
    setLoading(true)
    try {
      const { url } = await createCheckoutSession()
      window.location.href = url
    } catch (error) {
      // Handle error
    }
    setLoading(false)
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pocket Prayers Premium</CardTitle>
        <CardDescription>$5/month</CardDescription>
      </CardHeader>
      <CardContent>
        <ul>
          <li>Access to all premium teachings</li>
          <li>Exclusive content library</li>
          <li>Support the community</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubscribe} disabled={loading}>
          {loading ? 'Loading...' : 'Subscribe Now'}
        </Button>
      </CardFooter>
    </Card>
  )
}
```

## Webhook Events

### Required Events

| Event | Purpose |
|-------|---------|
| `checkout.session.completed` | New subscription created |
| `customer.subscription.created` | Subscription activated |
| `customer.subscription.updated` | Plan change or status update |
| `customer.subscription.deleted` | Cancellation |
| `invoice.payment_succeeded` | Payment success (renewal) |
| `invoice.payment_failed` | Payment failure |

### Webhook Handler

```typescript
// app/api/webhooks/stripe/route.ts
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }
  
  const { data, type } = event
  
  switch (type) {
    case 'checkout.session.completed': {
      const session = data as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      const subscriptionId = session.subscription as string
      const customerId = session.customer as string
      
      // Get subscription details
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      
      await supabase.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000)
      })
      
      // Update profile role
      await supabase.from('profiles')
        .update({ role: 'subscriber' })
        .eq('id', userId)
      
      break
    }
    
    case 'customer.subscription.updated': {
      const subscription = data as Stripe.Subscription
      const customerId = subscription.customer as string
      
      await supabase.from('subscriptions')
        .update({
          status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000)
        })
        .eq('stripe_customer_id', customerId)
      
      // Update role based on status
      const { data: profile } = await supabase.from('subscriptions')
        .select('user_id')
        .eq('stripe_customer_id', customerId)
        .single()
      
      if (profile) {
        const newRole = subscription.status === 'active' ? 'subscriber' : 'user'
        await supabase.from('profiles')
          .update({ role: newRole })
          .eq('id', profile.user_id)
      }
      
      break
    }
    
    case 'customer.subscription.deleted': {
      const subscription = data as Stripe.Subscription
      const customerId = subscription.customer as string
      
      await supabase.from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_customer_id', customerId)
      
      // Downgrade to user
      const { data: profile } = await supabase.from('subscriptions')
        .select('user_id')
        .eq('stripe_customer_id', customerId)
        .single()
      
      if (profile) {
        await supabase.from('profiles')
          .update({ role: 'user' })
          .eq('id', profile.user_id)
      }
      
      break
    }
    
    case 'invoice.payment_failed': {
      const invoice = data as Stripe.Invoice
      const customerId = invoice.customer as string
      
      await supabase.from('subscriptions')
        .update({ status: 'past_due' })
        .eq('stripe_customer_id', customerId)
      
      break
    }
  }
  
  return Response.json({ received: true })
}
```

## Subscription Status Updates

| Stripe Status | Supabase Status | Profile Role | Content Access |
|---------------|-----------------|--------------|----------------|
| active | active | subscriber | Full premium |
| past_due | past_due | subscriber* | Premium (grace period) |
| canceled | canceled | user | Free only |
| incomplete | inactive | user | Free only |

*Grace period: 7 days before role downgrade

## Premium Content Access Enforcement

### Client-Side

```typescript
// hooks/usePremium.ts
export function usePremium() {
  const { profile } = useProfile()
  
  return {
    isPremium: profile?.role === 'subscriber' || profile?.role === 'admin',
    canAccessPremium: (teaching: Teaching) => {
      if (!teaching.is_premium) return true
      return profile?.role === 'subscriber' || profile?.role === 'admin'
    }
  }
}
```

### Server-Side (RLS)

The RLS policies on the `teachings` table automatically enforce premium access:

```sql
-- User can only SELECT teachings where:
-- 1. is_published = true, AND
-- 2. is_premium = false, OR
-- 3. user has active subscription (role = subscriber/admin)
```

### API-Side

```typescript
// lib/teachings.ts
export async function getTeaching(slug: string) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('teachings')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) throw error
  
  // RLS handles the check, but we verify
  if (data.is_premium && !user) {
    return { ...data, content: null, locked: true }
  }
  
  return { ...data, locked: false }
}
```

## Stripe Configuration Checklist

- [ ] Create Stripe account
- [ ] Create Product: "Pocket Prayers Premium"
- [ ] Create Price: $5/month recurring
- [ ] Add Price ID to `.env` as `STRIPE_PRICE_ID`
- [ ] Create webhook endpoint: `/api/webhooks/stripe`
- [ ] Add webhook secret to `.env` as `STRIPE_WEBHOOK_SECRET`
- [ ] Select events to listen: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`
- [ ] Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
