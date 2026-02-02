# Continuous Scroll Video Carousel

A high-performance, infinite-scrolling video carousel for the video editing gallery on your portfolio site.

## Features

- **Infinite Scrolling**: Automatically loops through videos seamlessly
- **Autoplay on Hover**: Videos play automatically when hovered (desktop)
- **Multiple Aspect Ratios**: Supports landscape (16:9), vertical (9:16), and square (1:1) videos
- **Lazy Loading**: Videos load only when needed for optimal performance
- **Memory Efficient**: Unloads videos that are out of view
- **Responsive**: Adapts to all screen sizes
- **Touch Support**: Works on mobile devices
- **Performance Optimized**: Uses GPU acceleration and intersection observers

## Supported Aspect Ratios

| Ratio | Class Name | Desktop Size | Mobile Size | Best For |
|-------|-----------|--------------|-------------|----------|
| 16:9 | `aspect-landscape` | 320×180px | 280×158px | Standard videos, YouTube |
| 9:16 | `aspect-vertical` | 135×240px | 120×213px | TikTok, Reels, Stories |
| 1:1 | `aspect-square` | 180×180px | 160×160px | Instagram posts |

## How to Add Videos

### 1. Prepare your video files

- **Video format**: MP4 (H.264 codec recommended)
- **Thumbnail dimensions** (based on aspect ratio):
  - Landscape (16:9): 320×180px
  - Vertical (9:16): 135×240px
  - Square (1:1): 180×180px
- **Place videos in**: `/assets/videos/`
- **Place thumbnails in**: `/assets/videos/thumbnails/`

### 2. Add video data

Open `more.html` and find the video configuration section (around line 3994):

```javascript
const videoData = [
  {
    thumbnail: '/assets/videos/thumbnails/your-video.jpg',
    video: '/assets/videos/your-video.mp4',
    title: 'Your Video Title',
    category: '[Category]',
    aspectRatio: 'landscape', // 'landscape', 'vertical', or 'square'
    freelance: false
  },
  // Add more videos below
];
```

### 3. Video Data Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `thumbnail` | string | Yes | Path to thumbnail image |
| `video` | string | Yes | Path to video file |
| `title` | string | Yes | Display title (shown on hover) |
| `category` | string | Yes | Category label with brackets |
| `aspectRatio` | string | No | 'landscape', 'vertical', or 'square' (default: 'landscape') |
| `freelance` | boolean | No | Mark as freelance work (use `※` in category instead) |

## Examples

### Landscape Video (Standard)
```javascript
{
  thumbnail: '/assets/videos/thumbnails/project-demo.jpg',
  video: '/assets/videos/project-demo.mp4',
  title: 'Project Demo',
  category: '[Web Development]',
  aspectRatio: 'landscape',
  freelance: false
}
```

### Vertical Video (Social Media)
```javascript
{
  thumbnail: '/assets/videos/thumbnails/tiktok-video.jpg',
  video: '/assets/videos/tiktok-video.mp4',
  title: 'TikTok Trend',
  category: '[Social Media] ※',
  aspectRatio: 'vertical',
  freelance: true
}
```

### Square Video (Instagram)
```javascript
{
  thumbnail: '/assets/videos/thumbnails/instagram-reel.jpg',
  video: '/assets/videos/instagram-reel.mp4',
  title: 'Instagram Reel',
  category: '[Social Media]',
  aspectRatio: 'square',
  freelance: false
}
```

## Performance Features

### Automatic Optimization
- **Low-end devices**: Automatically slows animation speed
- **Lazy loading**: Videos load only when approaching viewport
- **Memory management**: Unloads off-screen videos to save RAM
- **GPU acceleration**: Smooth animations using CSS transforms

### User Preferences
- **Reduced motion**: Respects `prefers-reduced-motion` setting
- **Pause on hover**: Animation pauses when user interacts
- **Touch support**: Mobile-friendly touch controls

## Customization

### Animation Speed
Edit the CSS animation duration in `more.html` (line 1632):
```css
.continuous-carousel-track {
  animation: scroll-left 40s linear infinite; /* Change 40s to adjust speed */
}
```

### Video Sizes
Edit item dimensions in CSS (lines 1660-1675):
```css
.continuous-video-item.aspect-landscape {
  width: 320px;  /* Adjust landscape width */
  height: 180px; /* Adjust landscape height */
}

.continuous-video-item.aspect-vertical {
  width: 135px;  /* Adjust vertical width */
  height: 240px; /* Adjust vertical height */
}

.continuous-video-item.aspect-square {
  width: 180px;  /* Adjust square size */
  height: 180px;
}
```

### Mobile Sizes
Edit mobile dimensions in CSS (lines 1742-1755):
```css
@media (max-width: 768px) {
  .continuous-video-item.aspect-landscape {
    width: 280px;
    height: 158px;
  }
  /* ... etc */
}
```

## Best Practices

### Video Compression
- Use H.264 codec for MP4 files
- Target bitrate: 2-5 Mbps for HD content
- Use constant bitrate (CBR) for smooth streaming
- Compress audio to AAC, 128kbps or lower

### Thumbnail Quality
- Use high-quality JPGs (80-90% quality)
- Ensure thumbnails match video content
- Consider adding text overlays for context
- Use consistent styling across thumbnails

### File Size Guidelines
| Resolution | Target Size | Max Size |
|------------|-------------|----------|
| Vertical (9:16) | 1-2 MB | 3 MB |
| Square (1:1) | 1.5-2.5 MB | 4 MB |
| Landscape (16:9) | 2-3 MB | 5 MB |

### Organization
```
/assets/videos/
├── thumbnails/
│   ├── landscape-video.jpg
│   ├── vertical-video.jpg
│   └── square-video.jpg
├── landscape-video.mp4
├── vertical-video.mp4
└── square-video.mp4
```

## Browser Support

- **Chrome/Edge**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support (iOS and macOS)
- **Mobile browsers**: Full support with touch optimization

## Troubleshooting

### Videos not playing
- ✅ Check video format (MP4 with H.264 recommended)
- ✅ Verify file paths are correct
- ✅ Check browser console for errors
- ✅ Ensure video files aren't corrupted

### Incorrect aspect ratios
- ✅ Verify `aspectRatio` field matches video orientation
- ✅ Check thumbnail dimensions match aspect ratio
- ✅ Test on different screen sizes

### Choppy animation
- ✅ Reduce video file sizes
- ✅ Lower the number of simultaneous videos
- ✅ Check device performance
- ✅ Close other browser tabs

### Memory issues
- ✅ Carousel automatically manages memory
- ✅ Videos are unloaded when out of view
- ✅ Consider reducing the number of videos in the list
- ✅ Use lower resolution videos for mobile

## Tips for Different Platforms

### TikTok/Reels (Vertical)
- Use 9:16 aspect ratio
- Keep content centered (safe zone)
- Add captions/overlays
- Keep under 60 seconds

### YouTube (Landscape)
- Use 16:9 aspect ratio
- High quality thumbnails
- Consider SEO in titles
- Include preview/teaser

### Instagram (Mixed)
- Feed posts: 1:1 or 4:5
- Stories/Reels: 9:16
- IGTV: 16:9
- Maintain consistent branding

## Future Enhancements

Possible improvements:
- Click to expand video to modal
- Video progress indicators
- Category filtering
- Search functionality
- Video statistics/metrics
- Playlist support
- Custom video controls
- Autoplay settings
- Volume controls per video
- Picture-in-picture mode

## Support

For issues or questions:
1. Check this documentation first
2. Review browser console for errors
3. Test on different devices/browsers
4. Verify file paths and formats
