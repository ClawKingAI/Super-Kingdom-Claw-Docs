---
name: typewriter-effect
description: >
  Create a typewriter text animation that types, pauses, deletes, and cycles through multiple phrases.
  Use when building landing pages, hero sections, or any UI that needs dynamic text effects.
  Outputs HTML, CSS, and JavaScript that can be embedded directly.
---

# Typewriter Effect

A powerful typewriter animation that cycles through phrases, typing them out and deleting them in a continuous loop.

## Quick Usage

### Basic HTML Structure

```html
<h1 class="headline">
  <span id="typewriter" class="typewriter-text"></span>
</h1>
```

### CSS

```css
.typewriter-text {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid #FFD700;
  animation: blink 0.7s step-end infinite;
}

@keyframes blink {
  50% { border-color: transparent; }
}
```

### JavaScript

```javascript
const phrases = [
  "Your Own AI Agent System",
  "8 Agents Working 24/7",
  "Zero AI Token Costs",
  "Find Leads Automatically",
  "Send Outreach While You Sleep"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 80;

function type() {
  const currentPhrase = phrases[phraseIndex];
  const typewriter = document.getElementById('typewriter');
  
  if (isDeleting) {
    typewriter.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    typingSpeed = 40; // Faster when deleting
  } else {
    typewriter.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    typingSpeed = 80; // Normal typing speed
  }
  
  if (!isDeleting && charIndex === currentPhrase.length) {
    // Finished typing - pause then start deleting
    isDeleting = true;
    typingSpeed = 2000; // 2 second pause at full text
  } else if (isDeleting && charIndex === 0) {
    // Finished deleting - move to next phrase
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typingSpeed = 500; // Pause before typing new phrase
  }
  
  setTimeout(type, typingSpeed);
}

// Start after page load
setTimeout(type, 1000);
```

## Configuration Options

### Speed Settings

| Setting | Value | Description |
|---------|-------|-------------|
| `typingSpeed` (typing) | 80ms | Speed when typing characters |
| `typingSpeed` (deleting) | 40ms | Speed when deleting (faster) |
| `pause at full text` | 2000ms | How long to show complete phrase |
| `pause before new phrase` | 500ms | Delay before typing next phrase |

### Cursor Styling

Change the cursor by modifying the border:

```css
/* Thick golden cursor */
border-right: 4px solid #FFD700;

/* Thin white cursor */
border-right: 2px solid #ffffff;

/* No cursor */
border-right: none;
```

### Text Styling

```css
.typewriter-text {
  font-family: 'Playfair Display', serif;
  font-size: 4rem;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

## Complete Example

Here's a full working example with glowing text:

```html
<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
  <style>
    body {
      background: #050508;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
    }
    
    .headline {
      font-family: 'Playfair Display', serif;
      font-size: 4rem;
    }
    
    .typewriter-text {
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      border-right: 3px solid #FFD700;
      animation: blink 0.7s step-end infinite;
      background: linear-gradient(135deg, #FFD700, #FFA500, #FFD700);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 0 40px rgba(255, 180, 50, 0.3);
    }
    
    @keyframes blink {
      50% { border-color: transparent; }
    }
  </style>
</head>
<body>
  <h1 class="headline">
    <span id="typewriter" class="typewriter-text"></span>
  </h1>
  
  <script>
    const phrases = [
      "Your Own AI Agent System",
      "8 Agents Working 24/7",
      "Zero AI Token Costs"
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;
    
    function type() {
      const currentPhrase = phrases[phraseIndex];
      const typewriter = document.getElementById('typewriter');
      
      if (isDeleting) {
        typewriter.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      } else {
        typewriter.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
      }
      
      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2000;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500;
      }
      
      setTimeout(type, typingSpeed);
    }
    
    setTimeout(type, 1000);
  </script>
</body>
</html>
```

## Integration with Landing Pages

When adding to an existing landing page:

1. **Add the container** where you want the typewriter:
   ```html
   <h1 class="your-heading-class">
     <span id="typewriter" class="typewriter-text"></span>
   </h1>
   ```

2. **Add CSS** to your stylesheet (or `<style>` block)

3. **Add JavaScript** before `</body>` tag

4. **Customize phrases** to match your messaging

## Best Practices

- Keep phrases **short** (3-6 words) for best visual impact
- Use **consistent capitalization** across phrases
- Aim for **similar phrase lengths** to avoid awkward spacing
- Place script **at end of body** for fastest initial render
- Consider **mobile responsiveness** — use smaller font on mobile

## Mobile Responsive Example

```css
.typewriter-text {
  font-size: 2rem; /* Mobile default */
}

@media (min-width: 768px) {
  .typewriter-text {
    font-size: 4rem; /* Tablet+ */
  }
}

@media (min-width: 1024px) {
  .typewriter-text {
    font-size: 5rem; /* Desktop */
  }
}
```
