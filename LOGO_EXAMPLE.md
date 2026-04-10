# Example: Adding Your Logo

## Method 1: Replace Placeholder

1. **Locate**: `/public/logo.png`
2. **Replace**: Drag your logo file here, overwriting the placeholder
3. **Done**: Refresh the page to see your logo

## Method 2: Different Filename

1. **Upload**: Your logo to `/public/` (e.g., `my-brand.png`)
2. **Update**: `/public/config.json`
   ```json
   {
     "logoUrl": "/my-brand.png",
     "defaultTitle": "Your Brand",
     "defaultSubtitle": "Your Tagline"
   }
   ```

## Example Logos

### For Guitar Brands
- Product photo of your pickup
- Company logo with transparency
- Stylized guitar icon
- Waveform graphic

### Size Guidelines
- **Small logos**: 100x100px minimum
- **Large logos**: 200x200px maximum  
- **Wide logos**: 300x150px works well

## Quick Test

After adding your logo:
1. Visit the base URL (no `?set=` parameter)
2. You should see your logo on the "Coming Soon" page
3. If you see the default red icon, check:
   - File path in `config.json`
   - File exists in `/public/`
   - File extension matches

## Logo Not Required

If you prefer the default icon:
- Don't add a logo file
- Set `"logoUrl": null` in config.json
- The animated red player icon will display

---

**Note**: The logo only appears on the default/coming soon page, not on the track player page.
