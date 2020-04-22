# Inspiration Fetcher

Uses Puppeteer to go through a long list of urls and take screenshots of them.

## Generate a slide show video

If you have ffmpeg installed you can use this to generate a video:

```
ffmpeg -framerate 1 -pattern_type glob -i '*.png' -c:v libx264 -r 30 -pix_fmt yuv420p sites.mp4
```