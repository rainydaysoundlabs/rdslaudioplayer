# Guitar Pickup Comparison Player

A simple, frontend-only audio player for comparing guitar pickup recordings with synced playhead across tracks.

## Features

- ✅ **No Database Required** - All track data stored in JSON files
- ✅ **URL-Based Track Sets** - Load different sets via URL parameters
- ✅ **Synced Playhead** - Switch tracks while maintaining playback position
- ✅ **Scrollable Track List** - Handles 10+ tracks cleanly
- ✅ **Dark Theme** - Professional dark UI with red accents

## Usage

### Default View (No Parameters)
Visit the base URL to see the "Coming Soon" screen with logo:
```
https://your-domain.com/
```

### Load a Track Set
Add the `?set=` parameter to load a specific track set:
```
https://your-domain.com/?set=red-house
https://your-domain.com/?set=modern-series
```

## Adding New Track Sets

### 1. Create a JSON File

Create a new JSON file in `/public/tracksets/` folder:

**Example: `/public/tracksets/your-set-name.json`**

```json
{
  "setName": "Your Track Set Name",
  "tracks": [
    {
      "id": "1",
      "title": "Pickup Model Name",
      "description": "Brief description of the pickup",
      "audioUrl": "https://your-domain.com/audio/track1.mp3",
      "imageUrl": "https://your-domain.com/images/track1.jpg"
    },
    {
      "id": "2",
      "title": "Another Pickup",
      "description": "Description here",
      "audioUrl": "https://your-domain.com/audio/track2.mp3",
      "imageUrl": "https://your-domain.com/images/track2.jpg"
    }
  ]
}
```

### 2. Access Your Track Set

Visit: `https://your-domain.com/?set=your-set-name`

## JSON Structure

| Field | Type | Description |
|-------|------|-------------|
| `setName` | string | Name displayed at top of player |
| `tracks` | array | Array of track objects |
| `tracks[].id` | string | Unique identifier for the track |
| `tracks[].title` | string | Track/pickup name |
| `tracks[].description` | string | Brief description |
| `tracks[].audioUrl` | string | Direct URL to MP3 file |
| `tracks[].imageUrl` | string | Direct URL to square image |

## Audio File Guidelines

### File Format
- **Format**: MP3
- **Bitrate**: 128-320 kbps
- **Size**: 2-5MB recommended

### Hosting Options

**1. Same Domain (Recommended)**
```
"audioUrl": "/audio/pickup-sample.mp3"
```
Place files in `/public/audio/` folder

**2. CDN/External Hosting**
```
"audioUrl": "https://cdn.example.com/audio/track.mp3"
```

**3. Google Drive**
1. Upload to Google Drive
2. Share → "Anyone with the link"
3. Get file ID from share URL
4. Format: `https://drive.google.com/uc?export=download&id=FILE_ID`

## Image Guidelines

- **Aspect Ratio**: Square (1:1)
- **Dimensions**: 400x400px or higher
- **Format**: JPG or PNG
- **Size**: Under 500KB
- **Content**: Clear product photo of pickup

## Embedding in Shopify

Add to your Shopify product page using an iframe:

```html
<iframe 
  src="https://your-domain.com/?set=red-house" 
  width="100%" 
  height="700px" 
  frameborder="0"
  style="border: none; max-width: 600px; margin: 0 auto; display: block;"
></iframe>
```

## Example Track Sets Included

1. **Red House** - `?set=red-house`
   - 5 vintage-style pickups
   
2. **Modern Series** - `?set=modern-series`
   - 3 high-output modern pickups

## Customization

### Custom Logo

Edit `/public/config.json` to customize the default page:

```json
{
  "logoUrl": "/logo.png",
  "defaultTitle": "Your Brand Name",
  "defaultSubtitle": "Coming Soon"
}
```

**Logo Options:**
- **Local file**: Place image in `/public/` and use `"/logo.png"`
- **External URL**: Use full URL `"https://your-cdn.com/logo.png"`
- **No logo**: Set to `null` to use default SVG icon

**Logo Requirements:**
- Format: PNG, JPG, or SVG
- Recommended size: 200x200px max
- Transparent background works best

### Colors
Edit `/frontend/src/App.css`:
- Background: `#121212`
- Surface: `#1C1C1C`
- Accent: `#d62028`

### Fonts
Edit `/frontend/src/index.js`:
- Headings: `Manrope`
- Body: `IBM Plex Sans`

## File Structure

```
/public/
  /tracksets/
    red-house.json
    modern-series.json
    your-set.json
  /audio/          (optional - if hosting locally)
    track1.mp3
    track2.mp3
  /images/         (optional - if hosting locally)
    pickup1.jpg
    pickup2.jpg
```

## Tips for Best Comparison Results

1. **Same Recording Setup** - Use identical recording chain for all samples
2. **Same Musical Phrase** - Record the same riff for each pickup
3. **Consistent Levels** - Normalize audio levels across all tracks
4. **Clear Naming** - Use recognizable model names
5. **Descriptive Text** - Include position (bridge/neck) and tone characteristics

## Troubleshooting

### Track Set Not Found
- Check JSON filename matches URL parameter
- Ensure JSON file is in `/public/tracksets/` folder
- Verify JSON syntax is valid

### Audio Won't Play
- Confirm audio URL is direct link to MP3 file
- Test URL in browser - should download/play directly
- Check CORS headers if hosting externally

### Images Not Showing
- Verify image URLs are publicly accessible
- Test image URL in browser
- Ensure square aspect ratio for best results

## Development

```bash
# Install dependencies
cd /app/frontend
yarn install

# Start development server
yarn start

# Build for production
yarn build
```

## License

MIT
