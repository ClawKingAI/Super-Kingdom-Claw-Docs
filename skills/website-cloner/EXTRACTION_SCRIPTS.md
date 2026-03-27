# Extraction Scripts Reference

JavaScript snippets to run via `browser(action=evaluate)` during website cloning.

## Global Extraction

Extract fonts, colors, favicons, and global patterns from the entire page.

```javascript
(function() {
  const allElements = document.querySelectorAll('*');
  
  // Extract fonts
  const fonts = new Set();
  allElements.forEach(el => {
    const ff = getComputedStyle(el).fontFamily;
    if (ff) fonts.add(ff.split(',')[0].replace(/["']/g, '').trim());
  });
  
  // Extract colors
  const colors = new Set();
  allElements.forEach(el => {
    const bg = getComputedStyle(el).backgroundColor;
    const fg = getComputedStyle(el).color;
    const bc = getComputedStyle(el).borderColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') colors.add(bg);
    if (fg && fg !== 'rgba(0, 0, 0, 0)') colors.add(fg);
    if (bc && bc !== 'rgba(0, 0, 0, 0)' && bc !== 'transparent') colors.add(bc);
  });
  
  // Find favicons
  const favicons = [...document.querySelectorAll('link[rel*="icon"]')].map(l => ({
    href: l.href,
    sizes: l.sizes?.toString(),
    type: l.type
  }));
  
  // Find Google Fonts
  const googleFonts = [...document.querySelectorAll('link[href*="fonts.googleapis.com"]')]
    .map(l => {
      const url = new URL(l.href);
      return url.searchParams.get('family')?.split(':')[0];
    })
    .filter(Boolean);
  
  // Check for smooth scroll libraries
  const hasLenis = document.querySelector('.lenis') !== null || 
                   document.querySelector('[data-lenis]') !== null;
  const hasLocomotive = document.querySelector('.locomotive-scroll') !== null ||
                        document.querySelector('[data-scroll-container]') !== null;
  
  // Check for scroll snap
  const hasScrollSnap = getComputedStyle(document.documentElement).scrollSnapType !== 'none' ||
                        [...allElements].some(el => getComputedStyle(el).scrollSnapType !== 'none');
  
  // Extract CSS custom properties
  const cssVars = {};
  const rootStyles = getComputedStyle(document.documentElement);
  for (let i = 0; i < rootStyles.length; i++) {
    const prop = rootStyles[i];
    if (prop.startsWith('--')) {
      cssVars[prop] = rootStyles.getPropertyValue(prop).trim();
    }
  }
  
  return {
    fonts: [...fonts],
    colors: [...colors],
    favicons,
    googleFonts: [...new Set(googleFonts)],
    smoothScroll: { hasLenis, hasLocomotive },
    hasScrollSnap,
    cssVars,
    title: document.title,
    meta: {
      description: document.querySelector('meta[name="description"]')?.content,
      ogImage: document.querySelector('meta[property="og:image"]')?.content,
      themeColor: document.querySelector('meta[name="theme-color"]')?.content
    }
  };
})();
```

## Component Extraction

Extract complete CSS structure for a specific component/section.

```javascript
// Replace SELECTOR with actual CSS selector for the component
(function(selector) {
  const el = document.querySelector(selector);
  if (!el) return { error: 'Element not found: ' + selector };
  
  const props = [
    'fontSize','fontWeight','fontFamily','lineHeight','letterSpacing','color',
    'textTransform','textDecoration','backgroundColor','background',
    'backgroundImage','backgroundSize','backgroundPosition',
    'padding','paddingTop','paddingRight','paddingBottom','paddingLeft',
    'margin','marginTop','marginRight','marginBottom','marginLeft',
    'width','height','maxWidth','minWidth','maxHeight','minHeight',
    'display','flexDirection','justifyContent','alignItems','alignContent','gap',
    'gridTemplateColumns','gridTemplateRows','gridColumn','gridRow',
    'borderRadius','border','borderTop','borderBottom','borderLeft','borderRight',
    'borderColor','borderWidth','borderStyle',
    'boxShadow','overflow','overflowX','overflowY',
    'position','top','right','bottom','left','zIndex',
    'opacity','transform','transition','cursor','pointerEvents',
    'objectFit','objectPosition','backdropFilter','filter','mixBlendMode',
    'whiteSpace','textOverflow','WebkitLineClamp','listStyle'
  ];
  
  function extractStyles(element) {
    const cs = getComputedStyle(element);
    const styles = {};
    props.forEach(p => {
      const v = cs[p];
      if (v && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== '0px' && v !== 'rgba(0, 0, 0, 0)') {
        styles[p] = v;
      }
    });
    return styles;
  }
  
  function walk(element, depth) {
    if (depth > 5 || !element) return null;
    
    const children = [...element.children];
    const rect = element.getBoundingClientRect();
    
    return {
      tag: element.tagName.toLowerCase(),
      classes: element.className?.toString().split(' ').filter(Boolean).slice(0, 10),
      id: element.id || null,
      text: element.childNodes.length === 1 && element.childNodes[0].nodeType === 3 
        ? element.textContent.trim().slice(0, 300) 
        : null,
      styles: extractStyles(element),
      bounds: {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
        left: Math.round(rect.left)
      },
      images: element.tagName === 'IMG' ? {
        src: element.src,
        alt: element.alt,
        naturalWidth: element.naturalWidth,
        naturalHeight: element.naturalHeight,
        loading: element.loading
      } : null,
      links: element.tagName === 'A' ? {
        href: element.href,
        target: element.target
      } : null,
      childCount: children.length,
      children: children.slice(0, 30).map(c => walk(c, depth + 1)).filter(Boolean)
    };
  }
  
  return walk(el, 0);
})('SELECTOR');
```

## Asset Discovery

Find all images, videos, SVGs, and background images on the page.

```javascript
(function() {
  // Images
  const images = [...document.querySelectorAll('img')].map(img => ({
    src: img.src || img.currentSrc,
    alt: img.alt,
    width: img.naturalWidth,
    height: img.naturalHeight,
    loading: img.loading,
    parentClasses: img.parentElement?.className?.split(' ').slice(0, 5),
    isOverlay: getComputedStyle(img).position === 'absolute' || 
               getComputedStyle(img).position === 'fixed'
  })).filter(img => img.src && !img.src.startsWith('data:'));
  
  // Videos
  const videos = [...document.querySelectorAll('video')].map(v => ({
    src: v.src || v.querySelector('source')?.src,
    poster: v.poster,
    autoplay: v.autoplay,
    loop: v.loop,
    muted: v.muted,
    playsInline: v.playsInline
  })).filter(v => v.src);
  
  // SVGs (inline)
  const svgs = [...document.querySelectorAll('svg')].map((svg, i) => ({
    id: svg.id || `svg-${i}`,
    viewBox: svg.getAttribute('viewBox'),
    width: svg.getAttribute('width'),
    height: svg.getAttribute('height'),
    fill: svg.getAttribute('fill'),
    innerHTML: svg.innerHTML.slice(0, 500) // Truncated
  }));
  
  // Background images
  const bgImages = [...document.querySelectorAll('*')]
    .filter(el => {
      const bg = getComputedStyle(el).backgroundImage;
      return bg && bg !== 'none' && bg.includes('url(');
    })
    .map(el => {
      const bg = getComputedStyle(el).backgroundImage;
      const urlMatch = bg.match(/url\(['"]?([^'")]+)['"]?\)/);
      return {
        url: urlMatch ? urlMatch[1] : null,
        size: getComputedStyle(el).backgroundSize,
        position: getComputedStyle(el).backgroundPosition,
        repeat: getComputedStyle(el).backgroundRepeat,
        element: el.tagName + (el.className ? '.' + el.className.split(' ')[0] : '')
      };
    })
    .filter(bg => bg.url && !bg.url.startsWith('data:'));
  
  // Source set images
  const srcsetImages = [...document.querySelectorAll('source[srcset]')].map(s => ({
    srcset: s.srcset,
    type: s.type,
    media: s.media
  }));
  
  return {
    images,
    videos,
    svgs,
    bgImages,
    srcsetImages,
    totals: {
      images: images.length,
      videos: videos.length,
      svgs: svgs.length,
      bgImages: bgImages.length
    }
  };
})();
```

## State Extraction (Before/After)

Capture styles before and after a state change (scroll, click, hover).

### Before State
```javascript
// Run this FIRST, then trigger the state change (scroll, click, etc.)
(function(selector) {
  const el = document.querySelector(selector);
  if (!el) return { error: 'Element not found' };
  
  const cs = getComputedStyle(el);
  const styles = {};
  const props = [
    'fontSize','fontWeight','color','backgroundColor','background',
    'padding','paddingTop','paddingRight','paddingBottom','paddingLeft',
    'margin','marginTop','marginRight','marginBottom','marginLeft',
    'width','height','maxWidth','minHeight',
    'borderRadius','border','boxShadow',
    'opacity','transform','transition',
    'position','top','right','bottom','left','zIndex'
  ];
  
  props.forEach(p => styles[p] = cs[p]);
  
  return {
    timestamp: Date.now(),
    scrollY: window.scrollY,
    styles
  };
})('SELECTOR');
```

### After State
```javascript
// Run this AFTER triggering the state change
// Compare with before state to find what changed
(function(selector) {
  const el = document.querySelector(selector);
  if (!el) return { error: 'Element not found' };
  
  const cs = getComputedStyle(el);
  const styles = {};
  const props = [
    'fontSize','fontWeight','color','backgroundColor','background',
    'padding','paddingTop','paddingRight','paddingBottom','paddingLeft',
    'margin','marginTop','marginRight','marginBottom','marginLeft',
    'width','height','maxWidth','minHeight',
    'borderRadius','border','boxShadow',
    'opacity','transform','transition',
    'position','top','right','bottom','left','zIndex'
  ];
  
  props.forEach(p => styles[p] = cs[p]);
  
  return {
    timestamp: Date.now(),
    scrollY: window.scrollY,
    styles
  };
})('SELECTOR');
```

## Tab Content Extraction

Extract content for each tab state.

```javascript
// First, click the tab, then run this
(function(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return { error: 'Container not found' };
  
  // Get current active tab indicator
  const activeTab = document.querySelector('[aria-selected="true"]') || 
                    document.querySelector('.active') ||
                    document.querySelector('[data-active="true"]');
  
  // Extract all visible content in the container
  const content = {
    activeTabLabel: activeTab?.textContent?.trim(),
    items: []
  };
  
  // Adjust selector based on what's being shown (cards, list items, etc.)
  const items = container.querySelectorAll(':scope > div, :scope > a, :scope > article, :scope > li');
  
  items.forEach((item, i) => {
    const cs = getComputedStyle(item);
    content.items.push({
      index: i,
      text: item.textContent?.trim().slice(0, 200),
      image: item.querySelector('img')?.src,
      link: item.querySelector('a')?.href || item.tagName === 'A' ? item.href : null,
      styles: {
        display: cs.display,
        padding: cs.padding,
        gap: cs.gap,
        borderRadius: cs.borderRadius,
        background: cs.backgroundColor
      }
    });
  });
  
  return content;
})('SELECTOR_FOR_CONTENT_AREA');
```

## Responsive Breakpoint Detection

Find where layout changes occur.

```javascript
(function() {
  const breakpoints = [];
  const testWidths = [320, 375, 390, 414, 480, 576, 640, 768, 1024, 1280, 1440, 1920];
  
  // This needs to be run multiple times as browser is resized
  // For now, return current state
  const currentWidth = window.innerWidth;
  const body = document.body;
  const cs = getComputedStyle(body);
  
  return {
    currentWidth,
    viewport: {
      fontSize: cs.fontSize,
      fontFamily: cs.fontFamily,
      overflow: cs.overflow
    },
    scrollbarWidth: window.innerWidth - document.documentElement.clientWidth,
    testWidths
  };
})();
```

## Hover State Detection

Check if an element has hover styles defined.

```javascript
(function(selector) {
  const el = document.querySelector(selector);
  if (!el) return { error: 'Element not found' };
  
  // Get default styles
  const defaultStyles = getComputedStyle(el);
  
  // Check for hover in stylesheets
  const hasHover = [...document.styleSheets].some(sheet => {
    try {
      return [...sheet.cssRules].some(rule => 
        rule.selectorText && 
        rule.selectorText.includes(selector) && 
        rule.selectorText.includes(':hover')
      );
    } catch (e) {
      return false; // CORS blocked
    }
  });
  
  return {
    selector,
    hasDefinedHover: hasHover,
    cursor: defaultStyles.cursor,
    transition: defaultStyles.transition
  };
})('SELECTOR');
```

## Animation Detection

Find CSS animations and keyframes.

```javascript
(function() {
  const animations = new Set();
  const transitions = new Map();
  
  // Check all elements for running animations
  document.querySelectorAll('*').forEach(el => {
    const cs = getComputedStyle(el);
    
    if (cs.animationName && cs.animationName !== 'none') {
      animations.add({
        name: cs.animationName,
        duration: cs.animationDuration,
        timing: cs.animationTimingFunction,
        delay: cs.animationDelay,
        iteration: cs.animationIterationCount,
        element: el.tagName + (el.className ? '.' + el.className.split(' ')[0] : '')
      });
    }
    
    if (cs.transition && cs.transition !== 'none') {
      transitions.set(el.tagName + '.' + (el.className?.split(' ')[0] || ''), {
        properties: cs.transitionProperty,
        duration: cs.transitionDuration,
        timing: cs.transitionTimingFunction
      });
    }
  });
  
  // Extract keyframes from stylesheets
  const keyframes = [];
  [...document.styleSheets].forEach(sheet => {
    try {
      [...sheet.cssRules].forEach(rule => {
        if (rule.type === CSSRule.KEYFRAMES_RULE) {
          keyframes.push({
            name: rule.name,
            cssText: rule.cssText.slice(0, 1000)
          });
        }
      });
    } catch (e) {}
  });
  
  return {
    animations: [...animations],
    transitions: Object.fromEntries(transitions),
    keyframes
  };
})();
```
