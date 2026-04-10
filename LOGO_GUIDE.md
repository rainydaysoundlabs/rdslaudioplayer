# Logo Configuration Guide

## Quick Setup

Replace the default logo in 3 simple steps:

### Option 1: Local Logo (Recommended)

1. **Add your logo** to `/public/logo.png`
2. **Edit** `/public/config.json`:
   ```json
   {
     "logoUrl": "/logo.png",
     "defaultTitle": "Red House Pickups",
     "defaultSubtitle": "Premium Guitar Pickups"
   }
   ```
3. **Refresh** the page

### Option 2: External Logo (CDN)

Use a logo hosted elsewhere:

```json
{
  "logoUrl": "https://your-cdn.com/logo.png",
  "defaultTitle": "Your Brand",
  "defaultSubtitle": "Coming Soon"
}
```

### Option 3: No Logo (Default Icon)

Use the built-in SVG icon:

```json
{
  "logoUrl": null,
  "defaultTitle": "Pickup Comparison",
  "defaultSubtitle": "Coming Soon"
}
```

## Logo Specifications

| Property | Recommendation |
|----------|----------------|
| **Format** | PNG (with transparency) or SVG |
| **Size** | 200x200px maximum |
| **Aspect Ratio** | Square or horizontal |
| **Background** | Transparent preferred |
| **File Size** | Under 100KB |

## Examples

### Brand Logo
```json
{
  "logoUrl": "/brand-logo.png",
  "defaultTitle": "RDSL Pickups",
  "defaultSubtitle": "Handwound Since 2020"
}
```

### Product Logo
```json
{
  "logoUrl": "/product-icon.svg",
  "defaultTitle": "Vintage Series",
  "defaultSubtitle": "Experience the Tone"
}
```

### Minimal Setup
```json
{
  "logoUrl": null,
  "defaultTitle": "Listen & Compare",
  "defaultSubtitle": "Available Soon"
}
```

## Troubleshooting

**Logo not showing?**
- Check file path is correct
- Verify file exists in `/public/` folder
- Ensure file extension matches (`.png`, `.jpg`, `.svg`)
- Check browser console for errors

**Logo too large/small?**
- Resize image to 200x200px max
- CSS will auto-scale within limits
- For precise control, edit `.custom-logo` class in `/frontend/src/App.css`

**Want to use your company colors?**
- Edit text colors in `/public/config.json` won't work (title/subtitle text only)
- For full color customization, edit `/frontend/src/App.css`
  - Search for `#d62028` (red accent)
  - Replace with your brand color

## File Location

```
/public/
  config.json       ← Edit this
  logo.png          ← Add your logo here
  /tracksets/
    ...
```

## What Gets Displayed

The default "Coming Soon" page shows:
1. **Logo** (your custom image or default SVG icon)
2. **Title** (from config.json)
3. **Subtitle** (from config.json)
4. **Hint text** (how to use the player)

## Custom Styling

Want to change logo size or position? Edit `/frontend/src/App.css`:

```css
.custom-logo {
  max-width: 300px;      /* Change width */
  max-height: 300px;     /* Change height */
  border-radius: 10px;   /* Add rounded corners */
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);  /* Add shadow */
}
```

## That's It!

Just update `config.json` and optionally add a logo file. No code changes needed.
