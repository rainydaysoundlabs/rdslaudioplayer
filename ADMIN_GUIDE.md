# Guitar Pickup Comparison Widget - Admin Guide

## Overview
This widget allows you to showcase and compare guitar pickup sample recordings on your Shopify store. Customers can listen to different pickups while maintaining the same playhead position for accurate A/B comparison.

## Accessing the Admin Panel
Navigate to: `https://your-domain.com/admin`

## Adding a New Track

1. Click the **"Add Track"** button in the top right
2. Fill in the form:
   - **Track Title**: Name of the pickup (e.g., "Seymour Duncan SH-4 JB")
   - **Description**: Brief description (e.g., "Bridge humbucker - High output with tight low end")
   - **Audio URL**: Direct link to your MP3 file hosted on Shopify CDN or Google Drive
   - **Image URL**: Direct link to a square image of the pickup (recommended: 400x400px minimum)
3. Click **"Create Track"**

## Editing a Track

1. Find the track in the table
2. Click the pencil icon (✏️) in the Actions column
3. Update any fields you want to change
4. Click **"Update Track"**

## Deleting a Track

1. Find the track in the table
2. Click the trash icon (🗑️) in the Actions column
3. Confirm the deletion

## Audio File Hosting

### Shopify CDN
Upload audio files to Shopify and use the direct CDN URL:
```
https://cdn.shopify.com/s/files/1/YOUR_STORE/files/pickup-sample.mp3
```

### Google Drive
1. Upload MP3 to Google Drive
2. Right-click → Share → "Anyone with the link"
3. Copy the file ID from the share link
4. Format as: `https://drive.google.com/uc?export=download&id=FILE_ID`

### Important Notes
- Audio files must be in MP3 format
- Direct file URLs work best (no landing pages)
- Recommended file size: 2-5MB for best performance

## Image Guidelines

- **Format**: JPG or PNG
- **Dimensions**: Square aspect ratio (e.g., 400x400px, 800x800px)
- **Size**: Keep under 500KB for fast loading
- **Content**: Clear product photo of the pickup

## Viewer Widget

Your customers will access the widget at: `https://your-domain.com/`

Features they'll see:
- **Current Track Display**: Large image and description at the top
- **Progress Bar**: Shows playback position and allows seeking
- **Play/Pause Button**: Red circular button to control playback
- **Track List**: Scrollable list of all pickups (up to 10+ visible)
- **Synced Playhead**: When switching tracks, the new track starts at the same time position

## Embedding in Shopify

To embed this widget in your Shopify product page:

1. Go to your Shopify admin → Online Store → Themes → Customize
2. Add a Custom HTML block where you want the widget
3. Use an iframe:

```html
<iframe 
  src="https://your-widget-url.com" 
  width="100%" 
  height="700px" 
  frameborder="0"
  style="border: none; max-width: 600px; margin: 0 auto; display: block;"
></iframe>
```

## Tips for Best Results

1. **Consistent Recording Quality**: Use the same recording setup for all samples
2. **Same Riff/Phrase**: Record the same musical phrase for each pickup to make comparison meaningful
3. **Descriptive Names**: Use clear, recognizable pickup model names
4. **Add Context**: Include position (bridge/neck) and tone characteristics in descriptions
5. **Test Before Publishing**: Use the "View Widget" button to preview how customers will see it

## Technical Support

If you encounter issues:
- Ensure audio URLs are direct links (test in browser)
- Verify images are square and publicly accessible
- Check that MP3 files are properly encoded
- Clear browser cache if changes don't appear immediately

## Color Scheme
The widget uses your brand colors:
- Background: Dark (#121212)
- Accent: Red (#d62028)
- Typography: Sans serif fonts (Manrope & IBM Plex Sans)
