# Track & Field Tooltip Videos Debug Guide

## Problem Description

Track & field video tooltips were not displaying in production (Vercel) but worked in localhost.

## Root Causes Identified

### 1. NotSupportedError: "The element has no supported sources"

**Issue**: Setting `video.src` directly doesn't work well for video files across all browsers.

**Fix**: Use `<source>` tags with explicit MIME types:
```javascript
// ❌ Wrong - causes NotSupportedError
video.src = '/assets/videos/track/100m.mov';

// ✅ Correct - works across browsers
const video = document.createElement('video');
const source = document.createElement('source');
source.src = 'https://www.isiahudofia.com/assets/videos/track/100m.mp4';
source.type = 'video/mp4';
video.appendChild(source);
```

### 2. Relative vs Absolute URLs

**Issue**: JavaScript `video.src` with relative paths (`/assets/...`) doesn't resolve correctly in production.

**Fix**: Always use absolute URLs:
```javascript
// ❌ Wrong - browser can't resolve
video.src = '/assets/videos/track/100m.mov';

// ✅ Correct - absolute URL
const absoluteUrl = window.location.origin + videoData.path;
// Results in: https://www.isiahudofia.com/assets/videos/track/100m.mp4
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

**Fix**: Wait for `loadeddata` event:
```javascript
// Wait for video to be ready before playing
video.addEventListener('loadeddata', function onLoadedData() {
  video.play();
  video.removeEventListener('loadeddata', onLoadedData);
}, { once: true });

// Fallback: try playing after delay
setTimeout(() => {
  if (video.readyState >= 1) {
    video.play();
  }
}, 500);
```

### 5. .mov Format Incompatibility (CRITICAL)

**Issue**: `.mov` files from iPhone use codecs that only work in Safari. Chrome/Firefox cannot play them.

**Symptoms**:
- `readyState: 0` (video never loads)
- `NotSupportedError` in Chrome/Firefox
- Works in Safari, fails everywhere else

**Fix**: Convert all videos to `.mp4` format with H.264/AAC:
```bash
ffmpeg -i 100m.mov -c:v libx264 -c:a aac -movflags faststart 100m.mp4
```

**Why this matters**: `.mp4` with H.264/AAC works universally across ALL modern browsers.

## Final Working Solution (Localhost)

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

  // Wait for video to be ready before playing (critical for .mov files)
  video.addEventListener('loadeddata', function onLoadedData() {
    video.play();
    video.removeEventListener('loadeddata', onLoadedData);
  }, { once: true });

  // Fallback: try playing after delay if loadeddata doesn't fire
  setTimeout(() => {
    if (video.readyState >= 1) {
      video.play();
    }
  }, 500);
}
```

## Key Takeaways

1. **Always use `<source>` tags** for video elements in JavaScript
2. **Use absolute URLs** - never rely on relative paths in JS
3. **Don't clone video elements** - create fresh ones
4. **Wait for loadeddata event** before attempting to play
5. **Convert .mov to .mp4** - .mov only works in Safari
6. **Match working patterns** - the carousel videos already work, copy that approach

## Debugging Tips

1. Check browser console for `NotSupportedError` - indicates MIME type issue
2. Check for `AbortError` - indicates timing/cloning issue
3. Check `readyState: 0` - video not loading (codec/format issue)
4. Verify video URLs return HTTP 200: `curl -I "https://yourdomain.com/assets/videos/track/100m.mp4"`
5. Test in multiple browsers - Chrome, Firefox, Safari
6. Test in both localhost and production - issues can be environment-specific

## Files Modified

- `more.html` - Track tooltip video creation logic (lines ~2747-2804)
- Pre-created video elements (lines 133-147) - all now use `.mp4`
- Video data mapping with `videoId` references (lines ~2518-2555)
- Video files: Converted `.mov` to `.mp4` for universal compatibility

## Commit History

1. `6f7f91df` - Initial pre-created video elements approach
2. `8e949d12` - Added debug logging, tried clone approach
3. `1bef23ef` - Tried fresh video elements with relative paths
4. `d9799196` - Fixed to use absolute URLs
5. `4a6c853e` - Added `<source>` tags with proper MIME types
6. `13feb2eb` - Added retry logic for AbortError
7. `017326b2` - Wait for loadeddata event before playing
8. `7cce9dd9` - **LOCALHOST FIX** - Converted .mov to .mp4 format
9. `3649ee2f` - **PRODUCTION FIX** - Clone pre-created video elements instead of dynamic creation
10. `c29f2d87` - Added retry logic and enhanced logging for AbortError
11. `28ab40da` - **FINAL FIX** - Fixed hover text case sensitivity (Long Jump → LONG JUMP, Triple Jump → TRIPLE JUMP)

## Production Status (FIXED)

**Root Cause**: Multiple issues:
1. Dynamic video creation with `document.createElement('video')` doesn't work in Vercel production
2. `.mov` format only works in Safari, not Chrome/Firefox
3. **Hover text case mismatch** - `data-shuffle-hover` attributes were title case but statsVideos keys were all caps

**Final Solution**:
1. Convert all videos to `.mp4` format (H.264/AAC)
2. Pre-create video elements in HTML
3. Clone pre-created elements on hover
4. **Fix case sensitivity**: `data-shuffle-hover="LONG JUMP"` not `"Long Jump"`

**Critical Fix (Commit 28ab40da)**:
```html
<!-- ❌ WRONG - case doesn't match statsVideos keys -->
<div data-shuffle-hover="Long Jump">LONG JUMP</div>
<div data-shuffle-hover="Triple Jump">TRIPLE JUMP</div>

<!-- ✅ CORRECT - all caps to match statsVideos keys -->
<div data-shuffle-hover="LONG JUMP">LONG JUMP</div>
<div data-shuffle-hover="TRIPLE JUMP">TRIPLE JUMP</div>
```

**Solution**: Clone pre-created video elements that already exist in the HTML.

**Why This Works**:
- Pre-created video elements are in the HTML when the page loads
- They exist in the DOM before any JavaScript runs
- Cloning them preserves the element and its sources
- This matches the carousel approach exactly

**Final Working Code (Production + Localhost)**:
```javascript
// Use pre-created video element instead of creating dynamically
const videoContainer = trackTooltip.querySelector('#track-video-container');
if (videoContainer && videoData.videoId) {
  const preCreatedVideo = document.getElementById(videoData.videoId);
  if (preCreatedVideo) {
    // Clone the pre-created video element (this works in production)
    const videoClone = preCreatedVideo.cloneNode(true);
    videoClone.muted = true;
    videoClone.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
    videoContainer.appendChild(videoClone);

    // Play the cloned video
    requestAnimationFrame(() => {
      videoClone.play();
    });
  }
}
```

**Pre-created HTML elements (required)**:
```html
<div style="display: none;">
  <video id="track-video-100m" class="track-tooltip-video" muted loop playsinline preload="auto">
    <source src="/assets/videos/track/100m.mp4" type="video/mp4">
  </video>
  <video id="track-video-200m" class="track-tooltip-video" muted loop playsinline preload="auto">
    <source src="/assets/videos/track/200m.mp4" type="video/mp4">
  </video>
  <video id="track-video-longjump" class="track-tooltip-video" muted loop playsinline preload="auto">
    <source src="/assets/videos/track/longjump.mp4" type="video/mp4">
  </video>
  <video id="track-video-triplejump" class="track-tooltip-video" muted loop playsinline preload="auto">
    <source src="/assets/videos/track/triplejump.mp4" type="video/mp4">
  </video>
</div>
```

**Commit That Fixed Production**: `3649ee2f`

## Working Reference

The video gallery carousel (lines ~609-727) was used as the working reference. It successfully:
- Uses `<source>` tags with explicit MIME types
- Pre-creates video elements in HTML (not dynamically)
- Works in both localhost AND production
- Handles multiple video files seamlessly

**KEY LESSON**: Always pre-create video elements in HTML for production compatibility. Dynamic creation with `document.createElement('video')` fails in Vercel production but cloning pre-created elements works.
