# Professional Features Guide

## Volume Control

### Why It Matters
When comparing pickups, you need to level-match the output. A high-output bridge humbucker (like the Seymour Duncan JB) can be significantly louder than a vintage-style PAF. Without volume control, you'd be constantly adjusting your system volume or risking hearing damage with headphones.

### How to Use
1. **Set Safe Level**: Start at 50-70% volume when wearing headphones
2. **Match Levels**: When switching between hot and vintage pickups, adjust the slider to match perceived loudness
3. **Volume Persists**: The volume setting stays consistent when switching tracks, so you can focus on tonal differences, not volume differences

### Technical Details
- Range: 0-100%
- Default: 70% (safe for headphones)
- Real-time adjustment (no lag)
- Independent from system volume
- Visual percentage indicator

---

## Keyboard Shortcuts

### Why They Matter
Professional audio engineers and musicians use keyboard shortcuts to speed up their workflow. When A/B testing pickups, you want to:
- Keep your mouse on the track list
- Hit spacebar to start/stop quickly
- Use arrow keys to navigate without looking away from your DAW or notation

This makes the player feel like a professional audio tool, not just a web widget.

### Complete Shortcut List

| Key | Action | Use Case |
|-----|--------|----------|
| **Space** | Play / Pause | Quick start/stop while hovering over tracks |
| **↑ (Up)** | Previous track | Step backward through comparison |
| **↓ (Down)** | Next track | Step forward through comparison |
| **← (Left)** | Seek -5s | Compare a specific lick or phrase |
| **→ (Right)** | Seek +5s | Jump to the solo section |
| **1** | Jump to Track 1 | Instant access to reference pickup |
| **2-9** | Jump to Track 2-9 | Direct track access |

### Pro Workflow Example

**Scenario**: Comparing neck pickups for jazz tone

1. Load your track set: `?set=jazz-neck-pickups`
2. Click on Track 1 (your reference pickup)
3. Press **Space** to start playback
4. Listen to the first 8 bars
5. Press **Space** to pause
6. Press **↓** to switch to Track 2
7. Press **Space** to resume from the same position
8. Compare the tone
9. Press **2** to go back to Track 2
10. Press **→** three times to skip to the solo section

### Tips

- **Don't click Play/Pause** - Use spacebar instead
- **Use number keys** for your "reference" pickup (usually Track 1)
- **Arrow keys** for sequential comparison
- **Left/Right arrows** to repeat a specific phrase

### Accessibility

- Shortcuts only work when the track set is loaded
- Shortcuts are disabled when typing in input fields (future feature)
- Visual hint bar shows available shortcuts
- No conflicts with browser shortcuts

---

## Combined Workflow: The Pro Experience

### Real-World Example: A/B Testing Bridge Pickups

**Goal**: Choose between 3 bridge humbuckers for a rock recording

**Setup**:
1. Create track set: `bridge-humbuckers.json`
2. Record the same riff with each pickup
3. Load: `?set=bridge-humbuckers`
4. Set volume to 60% (safe level)

**Testing**:
1. **Track 1** (Seymour Duncan JB) - High output
   - Press **1** → Press **Space**
   - Louder → Reduce volume to 50%
   
2. **Track 2** (DiMarzio PAF Pro) - Medium output  
   - Press **2** → Already at same time position
   - Quieter → Increase volume to 60%
   
3. **Track 3** (Gibson 490T) - Vintage output
   - Press **3**
   - Much quieter → Increase volume to 75%

4. **Compare specific section**:
   - Press **→** (5s forward) three times to reach solo
   - Press **1** → **Space** (JB sound)
   - Press **2** (PAF Pro sound at same position)
   - Press **3** (490T sound at same position)

**Result**: You've just done professional-level A/B testing with level matching in under 2 minutes, using only keyboard shortcuts and one slider.

---

## Feature Philosophy

These aren't "nice-to-have" features. They're **essential tools** for anyone seriously comparing pickups:

1. **Volume Control** = **Safety** + **Fair Comparison**
   - Protects your ears
   - Eliminates loudness bias (humans perceive louder as "better")

2. **Keyboard Shortcuts** = **Speed** + **Professionalism**
   - Cuts comparison time in half
   - Feels like Pro Tools or Logic, not a toy

3. **Synced Playhead** = **Accuracy**
   - Hear the exact same note/chord on each pickup
   - No guessing which part you're comparing

Together, they create a **professional pickup comparison tool** that musicians and engineers actually want to use.
