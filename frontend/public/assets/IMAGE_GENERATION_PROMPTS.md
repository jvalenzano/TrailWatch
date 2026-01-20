# TrailWatch Golden Dataset - Image Generation Prompts

Use these prompts with any image generation tool (FLUX, Midjourney, DALL-E, etc.)

**Recommended Settings:**
- Resolution: 1280x720 (16:9 landscape) for realistic phone photo aspect ratio
- Style keywords included for "citizen science" / "smartphone photo" authenticity

---

## 1. tree_obstruction_ancient.jpg

**Prompt:**
```
A large mossy fallen log blocking a forest hiking trail, Pacific Northwest old-growth rainforest, ferns and moss everywhere, overcast lighting, smartphone photo quality, slight motion blur, citizen science documentation style
```

**Save as:** `photos/tree_obstruction_ancient.jpg`

---

## 2. erosion_washout.jpg

**Prompt:**
```
A hiking trail section washed away by mudslide, exposed tree roots, muddy ground, erosion damage, rainy Pacific Northwest forest, amateur phone photo quality, documentation style
```

**Save as:** `photos/erosion_washout.jpg`

---

## 3. bridge_collapse_critical.jpg

**Prompt:**
```
A small wooden footbridge over a creek broken and collapsed, wood planks snapped in half, dangerous trail hazard, forest setting, citizen photo style, phone camera quality
```

**Save as:** `photos/bridge_collapse_critical.jpg`

---

## 4. duplicate_source_A.jpg

**Prompt:**
```
A fallen white birch tree blocking a gravel hiking path, eye level perspective, autumn forest setting, amateur smartphone photo, citizen science documentation
```

**Note:** Use seed 42 if your tool supports it (for reproducibility with image B)

**Save as:** `photos/duplicate_source_A.jpg`

---

## 5. duplicate_source_B.jpg

**Prompt:**
```
A fallen white birch tree blocking a gravel hiking path, lower angle view, closer perspective, autumn forest setting, amateur smartphone photo, citizen science documentation
```

**Note:** Use seed 43 if your tool supports it (similar but not identical to image A)

**Save as:** `photos/duplicate_source_B.jpg`

---

## Output Directory

All files should be saved to:
```
frontend/public/assets/photos/
```

## Existing Files (Do Not Regenerate)

- `photos/tree_obstruction_standard.jpg` - Already exists (475KB)
- `social/social_tweet_storm.png` - Already exists
- `social/social_blog_header.png` - Already exists

## Verification

After adding images, run:
```bash
ls -la frontend/public/assets/photos/
```

Expected: 6 image files total (1 existing + 5 new)
