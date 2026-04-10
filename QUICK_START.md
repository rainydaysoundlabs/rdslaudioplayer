# Pickup Comparison Player - Quick Start Guide

## What This Is

A simple audio player for comparing guitar pickups. No database, no login - just JSON files and URLs.

## How It Works

1. **Create a JSON file** with your track data
2. **Add the file** to `/public/tracksets/` folder
3. **Share the URL** with the `?set=` parameter

## Quick Start

### Example URLs

- **Default (Coming Soon)**: `https://your-domain.com/`
- **Red House Set**: `https://your-domain.com/?set=red-house`
- **Modern Series**: `https://your-domain.com/?set=modern-series`

### Create Your First Track Set

1. Create a file: `/public/tracksets/my-pickups.json`

```json
{
  "setName": "My Pickup Collection",
  "tracks": [
    {
      "id": "1",
      "title": "Seymour Duncan JB",
      "description": "Bridge position - High output",
      "audioUrl": "/audio/jb-bridge.mp3",
      "imageUrl": "/images/jb.jpg"
    },
    {
      "id": "2",
      "title": "Fender Vintage",
      "description": "Neck position - Classic tone",
      "audioUrl": "/audio/fender-neck.mp3",
      "imageUrl": "/images/fender.jpg"
    }
  ]
}
```

2. Upload your audio files to `/public/audio/`
3. Upload your images to `/public/images/`
4. Visit: `https://your-domain.com/?set=my-pickups`

## Audio Files

### Where to Put Them

**Option 1: Local (Simple)**
- Put MP3s in `/public/audio/`
- Use path: `"/audio/your-file.mp3"`

**Option 2: External (CDN/Cloud)**
- Upload to any CDN or cloud storage
- Use full URL: `"https://cdn.example.com/audio/file.mp3"`

**Option 3: Google Drive**
1. Upload to Google Drive
2. Share → "Anyone with link"
3. Copy file ID from share URL
4. Format: `"https://drive.google.com/uc?export=download&id=FILE_ID"`

### Requirements
- **Format**: MP3
- **Quality**: 128-320 kbps
- **Size**: 2-5MB recommended
- **Recording**: Same riff/phrase for all pickups

## Images

### Where to Put Them

**Local**: Place in `/public/images/` and use `"/images/pickup.jpg"`  
**External**: Use full URL `"https://your-site.com/images/pickup.jpg"`

### Requirements
- **Format**: JPG or PNG
- **Shape**: Square (1:1 ratio)
- **Size**: 400x400px minimum
- **File Size**: Under 500KB

## Embed in Shopify

Add this to your product page HTML:

```html
<iframe 
  src="https://your-domain.com/?set=your-pickups" 
  width="100%" 
  height="700px" 
  style="border: none; max-width: 600px; margin: 0 auto; display: block;"
></iframe>
```

## Customization

### Add Your Logo

Edit `/public/config.json`:

```json
{
  "logoUrl": "/logo.png",
  "defaultTitle": "Your Company Name",
  "defaultSubtitle": "Pickup Comparison Tool"
}
```

**Steps:**
1. Add your logo to `/public/logo.png`
2. Update `logoUrl` in config.json
3. Optionally change title and subtitle

**Logo specs**: PNG/JPG, 200x200px max, transparent background recommended

## JSON Template

Copy and customize this:

```json
{
  "setName": "Your Set Name Here",
  "tracks": [
    {
      "id": "1",
      "title": "Pickup Model",
      "description": "Position - Tone description",
      "audioUrl": "/audio/track1.mp3",
      "imageUrl": "/images/pickup1.jpg"
    },
    {
      "id": "2",
      "title": "Another Pickup",
      "description": "Position - Tone description",
      "audioUrl": "/audio/track2.mp3",
      "imageUrl": "/images/pickup2.jpg"
    }
  ]
}
```

## Tips for Best Comparisons

✅ **Use the same riff** for every pickup  
✅ **Keep recording setup identical**  
✅ **Normalize audio levels**  
✅ **Include position info** (bridge/neck/middle)  
✅ **Describe the tone** (warm, bright, aggressive, etc.)

## Troubleshooting

**"Track Set Not Found"**
- Check filename matches URL: `?set=filename` → `filename.json`
- Ensure file is in `/public/tracksets/` folder
- Validate JSON syntax at jsonlint.com

**Audio Won't Play**
- Verify URL works in browser (should download/play)
- Ensure it's a direct MP3 link, not a landing page
- Check CORS settings if using external hosting

**Images Not Showing**
- Test image URL in browser
- Ensure images are publicly accessible
- Use square images for best results

## File Structure

```
/public/
  /tracksets/
    red-house.json
    modern-series.json
    your-set.json
  /audio/
    track1.mp3
    track2.mp3
  /images/
    pickup1.jpg
    pickup2.jpg
```

## Example Sets Included

1. **red-house** - 5 vintage-style pickups
2. **modern-series** - 3 high-output modern pickups

Copy these as templates for your own sets!

## That's It!

No database setup, no admin login - just create a JSON file and share the URL. Perfect for comparing multiple pickup sets across different pages or stores.
