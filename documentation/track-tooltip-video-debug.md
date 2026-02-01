# Track & Field Tooltip Videos Debug Guide

## Problem Description

Track & field video tooltips were not displaying in production (Vercel) but worked in localhost.

## Root Causes Identified

### 1. NotSupportedError: "The element has no supported sources"

**Issue**: Setting `video.src` directly doesn't work well for `.mov` files across all browsers.

**Fix**: Use `<source>` tags with explicit MIME types:
```javascript
// ❌ Wrong - causes NotSupportedError
video.src = '/assets/videos/track/100m.mov';

// ✅ Correct - works across browsers
const video = document.createElement('video');
const source = document.createElement('source');
source.src = 'https://www.isiahudofia.com/assets/videos/track/100m.mov';
source.type = 'video/quicktime'; // for .mov files
video.appendChild(source);
```

### 2. Relative vs Absolute URLs

**Issue**: JavaScript `video.src` with relative paths (`/assets/...`) doesn't resolve correctly.

**Fix**: Always use absolute URLs:
```javascript
// ❌ Wrong - browser can't resolve
video.src = '/assets/videos/track/100m.mov';

// ✅ Correct - absolute URL
const absoluteUrl = window.location.origin + videoData.path;
// Results in: https://www.isiahudofia.com/assets/videos/track/100m.mov
```

### 3. Cloning Video Elements

**Issue**: `cloneNode(true)` on video elements caused `AbortError: "The play() request was interrupted by a call to pause()"`

**Fix**: Create fresh video elements instead of cloning:
```javascript
// ❌ Wrong - cloning causes issues
const clone = preCreatedVideo.cloneNode(true);

// ✅ Correct - create fresh element
const video = document.createElement('video');
```

### 4. DOM Timing

**Issue**: Calling `play()` before video is fully inserted into DOM causes failures.

**Fix**: Use `setTimeout` delay:
```javascript
videoContainer.appendChild(video);

// Small delay ensures DOM is ready
setTimeout(() => {
  video.play();
}, 50);
```

## Final Working Solution

```javascript
// Create video element with <source> tag (like carousel)
const videoContainer = trackTooltip.querySelector('#track-video-container');
if (videoContainer && videoData.path) {
  // Convert relative path to absolute URL
  const absoluteUrl = window.location.origin + videoData.path;
  const ext = videoData.path.split('.').pop().toLowerCase();
  const mimeType = ext === 'mov' ? 'video/quicktime' : 'video/mp4';

  // Create video element with source tag (like carousel)
  const video = document.createElement('video');
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.autoplay = true;
  video.preload = 'auto';
  video.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
  video.className = 'track-tooltip-video';

  // Create and append source element
  const source = document.createElement('source');
  source.src = absoluteUrl;
  source.type = mimeType;
  video.appendChild(source);

  videoContainer.appendChild(video);

  // Force play after a brief delay
  setTimeout(() => {
    video.play();
  }, 50);
}
```

## Key Takeaways

1. **Always use `<source>` tags** for video elements in JavaScript
2. **Use absolute URLs** - never rely on relative paths in JS
3. **Don't clone video elements** - create fresh ones
4. **Add small delay before play()** to ensure DOM is ready
5. **Match working patterns** - the carousel videos already work, copy that approach

## Debugging Tips

1. Check browser console for `NotSupportedError` - indicates MIME type issue
2. Check for `AbortError` - indicates timing/cloning issue
3. Verify video URLs return HTTP 200: `curl -I "https://yourdomain.com/assets/videos/track/100m.mov"`
4. Test in both localhost and production - issues can be environment-specific

## Files Modified

- `more.html` - Track tooltip video creation logic (lines ~2747-2784)
- Pre-created video elements added (lines 133-147)
- Video data mapping with `videoId` references (lines ~2492-2528)

## Commit History

1. `6f7f91df` - Initial pre-created video elements approach
2. `8e949d12` - Added debug logging, tried clone approach
3. `1bef23ef` - Tried fresh video elements with relative paths
4. `d9799196` - Fixed to use absolute URLs
5. `4a6c853e` - **FINAL FIX** - Added `<source>` tags with proper MIME types

## Working Reference

The video gallery carousel (lines ~609-727) was used as the working reference. It successfully:
- Uses `<source>` tags with explicit MIME types
- Handles both `.mp4` and `.mov` files
- Works in both localhost and production

Always match the carousel's approach for new video implementations.
