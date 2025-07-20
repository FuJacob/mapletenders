# Mapletenders Design System Guide

## Overview

This guide provides a comprehensive reference for the Mapletenders color system and semantic usage patterns defined in `src/index.css`. This design system ensures consistency across the application while maintaining the Canadian procurement intelligence brand identity.

## Brand Philosophy

Mapletenders is Canada's premier procurement intelligence platform with core values of:
- **Accessibility**: Clean, readable design for all users
- **Intelligent Efficiency**: Streamlined workflows and clear visual hierarchy
- **Transparency**: Honest, professional aesthetic
- **Canadian Focus**: Heritage colors and cultural sensitivity

## Color System Architecture

### Design Principles
- ✅ **Semantic naming**: Colors have meaning (`text-error` not `text-red-600`)
- ✅ **No gradients**: Clean, flat design aesthetic
- ✅ **Canadian heritage**: Red and maple gold accents
- ✅ **Dark mode support**: Automatic theme switching
- ✅ **Accessibility first**: High contrast ratios and WCAG compliance

---

## 🎨 Color Categories

### 1. Brand Colors

#### Primary (`--color-primary`)
- **Light**: `#f75567` (Mapletenders red)
- **Dark**: `#f87171` (Brighter for dark backgrounds)
- **Usage**: Primary actions, buttons, links, brand elements
- **Tailwind**: `bg-primary`, `text-primary`, `border-primary`

```css
/* Examples */
.btn-primary { background-color: var(--color-primary); }
.link-primary { color: var(--color-primary); }
```

#### Secondary (`--color-secondary`)
- **Light**: `#f3f4f6` (Soft neutral)
- **Dark**: `#27272a` (Dark neutral)
- **Usage**: Secondary backgrounds, subtle highlights
- **Tailwind**: `bg-secondary`, `text-secondary`

#### Accent (`--color-accent`)
- **Light**: `#dc2626` (Canadian red)
- **Dark**: `#ef4444` (Brighter red)
- **Usage**: Important highlights, Canadian-themed elements
- **Tailwind**: `bg-accent`, `text-accent`

#### Maple (`--color-maple`)
- **Light**: `#f59e0b` (Maple gold)
- **Dark**: `#fbbf24` (Brighter gold)
- **Usage**: Premium features, success highlights, Canadian branding
- **Tailwind**: `bg-maple`, `text-maple`

### 2. Background Colors

#### Background (`--color-bg`)
- **Light**: `#fafafa` (Warm page background)
- **Dark**: `#0f0f0f` (Deep dark)
- **Usage**: Main page background
- **Tailwind**: `bg-background`

#### Surface (`--color-surface`)
- **Light**: `#ffffff` (Pure white)
- **Dark**: `#1a1a1a` (Dark surface)
- **Usage**: Cards, panels, modals, elevated content
- **Tailwind**: `bg-surface`

#### Surface Muted (`--color-surface-muted`)
- **Light**: `#f9fafb` (Subtle gray)
- **Dark**: `#1f1f1f` (Subtle dark)
- **Usage**: Secondary surfaces, disabled states, subtle backgrounds
- **Tailwind**: `bg-surface-muted`

#### Surface Warm (`--color-surface-warm`)
- **Light**: `#fef7ed` (Warm highlight)
- **Dark**: `#1c1917` (Warm dark)
- **Usage**: Success states, warm highlights, premium content
- **Tailwind**: `bg-surface-warm`

### 3. Text Colors

#### Text (`--color-text`)
- **Light**: `#1f2937` (Dark gray)
- **Dark**: `#fafafa` (Light gray)
- **Usage**: Primary text, headings, main content
- **Tailwind**: `text-text`

#### Text Muted (`--color-text-muted`)
- **Light**: `#6b7280` (Medium gray)
- **Dark**: `#a1a1aa` (Medium light gray)
- **Usage**: Secondary text, descriptions, metadata
- **Tailwind**: `text-text-muted`

#### Text Light (`--color-text-light`)
- **Light**: `#9ca3af` (Light gray)
- **Dark**: `#71717a` (Dark light gray)
- **Usage**: Placeholders, disabled text, subtle content
- **Tailwind**: `text-text-light`

#### Text Warm (`--color-text-warm`)
- **Light**: `#92400e` (Warm brown)
- **Dark**: `#fde68a` (Warm yellow)
- **Usage**: Warm highlights, premium text, special content
- **Tailwind**: `text-text-warm`

### 4. Border Colors

#### Border (`--color-border`)
- **Light**: `#e5e7eb` (Standard gray)
- **Dark**: `#27272a` (Dark gray)
- **Usage**: Standard borders, dividers, outlines
- **Tailwind**: `border-border`

#### Border Warm (`--color-border-warm`)
- **Light**: `#fed7aa` (Warm orange)
- **Dark**: `#92400e` (Dark warm)
- **Usage**: Special borders, warm highlights, premium elements
- **Tailwind**: `border-border-warm`

### 5. Status Colors

#### Success (`--color-success`)
- **Light**: `#10b981` (Green)
- **Dark**: `#34d399` (Bright green)
- **Usage**: Success messages, completed states, positive indicators
- **Tailwind**: `bg-success`, `text-success`

#### Warning (`--color-warning`)
- **Light**: `#f59e0b` (Amber)
- **Dark**: `#fbbf24` (Bright amber)
- **Usage**: Warning messages, pending states, caution indicators
- **Tailwind**: `bg-warning`, `text-warning`

#### Error (`--color-error`)
- **Light**: `#dc2626` (Red)
- **Dark**: `#ef4444` (Bright red)
- **Usage**: Error messages, failed states, urgent indicators
- **Tailwind**: `bg-error`, `text-error`

#### Info (`--color-info`)
- **Light**: `#3b82f6` (Blue)
- **Dark**: `#60a5fa` (Bright blue)
- **Usage**: Information messages, neutral states, links
- **Tailwind**: `bg-info`, `text-info`

### 6. Interactive States

#### Primary Dark (`--color-primary-dark`)
- **Light**: `#e53e3e` (Darker red)
- **Dark**: `#dc2626` (Adjusted for dark)
- **Usage**: Hover states, pressed buttons, active elements
- **Tailwind**: `bg-primary-dark`, `hover:bg-primary-dark`

#### Primary Light (`--color-primary-light`)
- **Light**: `#feb2b2` (Light red)
- **Dark**: `#991b1b` (Dark adjusted)
- **Usage**: Light backgrounds, subtle highlights, disabled states
- **Tailwind**: `bg-primary-light`

### 7. Specialized Colors

#### Contract Match Scores
- **Excellent** (`--color-match-excellent`): 90%+ match - Green
- **Good** (`--color-match-good`): 75-89% match - Amber  
- **Fair** (`--color-match-fair`): Below 75% match - Gray

---

## 📱 Usage Patterns

### Common Component Patterns

#### Buttons
```css
/* Primary Button */
.btn-primary {
  background-color: var(--color-primary);
  color: white;
  border: 1px solid var(--color-primary);
}
.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

/* Secondary Button */
.btn-secondary {
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
.btn-secondary:hover {
  background-color: var(--color-surface-muted);
}
```

#### Cards and Panels
```css
.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.card-muted {
  background-color: var(--color-surface-muted);
}
```

#### Status Indicators
```css
/* Success State */
.status-success {
  background-color: var(--color-success);
  color: white;
}
.status-success-light {
  background-color: color-mix(in srgb, var(--color-success) 10%, transparent);
  color: var(--color-success);
}

/* Error State */
.status-error {
  background-color: var(--color-error);
  color: white;
}
.status-error-light {
  background-color: color-mix(in srgb, var(--color-error) 10%, transparent);
  color: var(--color-error);
}
```

#### Text Hierarchy
```css
.heading-primary { color: var(--color-text); }
.heading-secondary { color: var(--color-text-muted); }
.body-text { color: var(--color-text); }
.caption-text { color: var(--color-text-light); }
```

### Tailwind CSS Integration

The color system integrates seamlessly with Tailwind:

```jsx
// Primary actions
<button className="bg-primary text-white hover:bg-primary-dark">
  Submit
</button>

// Status messages
<div className="bg-error/10 text-error border border-error/20">
  Error message
</div>

// Text hierarchy
<h1 className="text-text">Main Heading</h1>
<p className="text-text-muted">Description text</p>
<span className="text-text-light">Subtle text</span>

// Surfaces
<div className="bg-surface border border-border">
  Card content
</div>
```

---

## 🌙 Dark Mode Guidelines

### Automatic Switching
Dark mode activates automatically based on `prefers-color-scheme: dark`. All colors adjust automatically.

### Dark Mode Considerations
- **Contrast**: Dark mode colors maintain WCAG AA contrast ratios
- **Brightness**: Colors are slightly brighter in dark mode for visibility
- **Warmth**: Warm colors are adjusted to maintain visual warmth

### Testing Dark Mode
```css
/* Force dark mode for testing */
@media (prefers-color-scheme: dark) {
  /* Your styles automatically apply */
}
```

---

## ♿ Accessibility Features

### Contrast Ratios
All color combinations meet WCAG AA standards:
- **Normal text**: 4.5:1 minimum contrast
- **Large text**: 3:1 minimum contrast
- **Interactive elements**: Clear focus indicators

### Color Blindness Support
- Never rely on color alone for information
- Use icons, text, and patterns alongside color
- Test with color blindness simulators

### Focus States
```css
.focusable:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

---

## 🚀 Implementation Examples

### Component Implementation
```tsx
// React component using semantic colors
const AlertComponent = ({ type, children }) => {
  const baseClasses = "p-4 rounded-lg border";
  const typeClasses = {
    success: "bg-success/10 text-success border-success/20",
    error: "bg-error/10 text-error border-error/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    info: "bg-info/10 text-info border-info/20"
  };
  
  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      {children}
    </div>
  );
};
```

### CSS Custom Properties Usage
```css
/* Use CSS custom properties for dynamic theming */
.dynamic-theme {
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

/* Opacity modifiers */
.subtle-background {
  background-color: color-mix(in srgb, var(--color-primary) 5%, transparent);
}
```

---

## 📏 Design Tokens

### Spacing Scale
Use consistent spacing that complements the color system:
- `0.25rem` (1) - Tiny spacing
- `0.5rem` (2) - Small spacing  
- `1rem` (4) - Base spacing
- `1.5rem` (6) - Medium spacing
- `2rem` (8) - Large spacing
- `3rem` (12) - Extra large spacing

### Typography Scale
- **Headings**: Use `text-text` for primary, `text-text-muted` for secondary
- **Body**: Use `text-text` for main content
- **Captions**: Use `text-text-light` for metadata

---

## 🔧 Maintenance Guidelines

### Adding New Colors
1. Define both light and dark mode values
2. Use semantic naming (`--color-feature-state`)
3. Test contrast ratios
4. Update this documentation

### Modifying Existing Colors
1. Check all usage locations
2. Test in both light and dark modes
3. Verify accessibility compliance
4. Update component examples

### Best Practices
- ✅ Always use semantic color names
- ✅ Test in both light and dark modes
- ✅ Maintain contrast ratios
- ✅ Use opacity modifiers for variations
- ❌ Never use hardcoded hex values in components
- ❌ Don't rely on color alone for meaning
- ❌ Avoid pure black or white (use semantic alternatives)

---

## 🧪 Testing Checklist

### Visual Testing
- [ ] Light mode displays correctly
- [ ] Dark mode displays correctly  
- [ ] Color contrast meets WCAG AA
- [ ] Interactive states are clear
- [ ] Status colors are distinguishable

### Accessibility Testing
- [ ] Screen reader compatibility
- [ ] Keyboard navigation works
- [ ] Focus indicators are visible
- [ ] Color blind users can distinguish elements

### Browser Testing
- [ ] Chrome/Chromium browsers
- [ ] Firefox
- [ ] Safari (macOS/iOS)
- [ ] Edge

---

## 📚 Resources

### Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)
- [Colorblinding Simulator](https://www.color-blindness.com/coblis-color-blindness-simulator/)

### Documentation
- [WCAG Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Tailwind CSS Color Configuration](https://tailwindcss.com/docs/customizing-colors)

This design system ensures Mapletenders maintains a professional, accessible, and distinctly Canadian brand identity while providing developers with clear, semantic tools for building consistent user interfaces.