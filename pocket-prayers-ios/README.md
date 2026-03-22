# Pocket Prayers iOS App

A SwiftUI-based iOS application for the Pocket Prayers community.

## Features

### User Features
- **Welcome/Home Screen**: Beautiful landing with latest teachings and recent prayers
- **Community Prayer Wall**: Infinite scroll feed of prayers from the community
- **Post a Prayer**: Simple form to compose and share prayers
- **Teachings Library**: Premium content for subscribers ($5/month)
- **User Profile**: Manage account and subscription status
- **Authentication**: Sign in, register, password recovery

### Admin Features (TODO)
- Teachings Dashboard: CRUD operations for teachings
- Community Oversight: View community members

## Tech Stack
- SwiftUI
- Swift 5.9+
- Async/await concurrency
- Protocol-oriented architecture

## Project Structure

```
PocketPrayers/
├── PocketPrayersApp.swift    # App entry point
├── ContentView.swift          # Main UI views
├── Models.swift               # Data models
├── Services.swift             # API client
├── Managers.swift             # State management
└── Info.plist                 # App configuration
```

## Setup Instructions

1. **Open in Xcode**
   - Open `PocketPrayers.xcodeproj` in Xcode 15+
   - Requires macOS Sonoma or later

2. **Configure Backend**
   - Update `baseURL` in `Services.swift` to your API endpoint
   - Backend options: Supabase, Firebase, or custom Node.js

3. **Configure Subscription**
   - Integrate RevenueCat for subscription management
   - Or use Apple's native StoreKit

4. **Test on Simulator**
   - Select iPhone 15 Pro (or any iOS 17+ device)
   - Press Cmd+R to build and run

## Backend Requirements

You'll need a backend with these endpoints:

### Auth
- POST /auth/login
- POST /auth/register
- POST /auth/logout

### Prayers
- GET /prayers?limit=&cursor=
- POST /prayers
- POST /prayers/:id/pray

### Teachings
- GET /teachings
- POST /teachings (admin)
- PUT /teachings/:id (admin)
- DELETE /teachings/:id (admin)

### Subscription
- GET /subscription/status
- POST /subscription/create

## Next Steps

1. Set up Supabase or Firebase project
2. Configure authentication
3. Create database tables (prayers, teachings, users)
4. Integrate RevenueCat for subscriptions
5. Add push notifications (optional)
6. Submit to App Store ($99 developer fee)

## License

MIT License - Free to use and modify
