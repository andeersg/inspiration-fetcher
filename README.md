# Inspiration Fetcher

Uses Puppeteer to go through a long list of urls and take screenshots of them.

Use these options to change behaviour:

* --limit [number] (How many urls to take screenshot of)
* --random (Shuffle the list, nice if you also use limit)
* --width [number] (Viewport width when taking screenshots)
* --height [number] (Viewport height when taking screenshots)

## Generate a slide show video

If you have ffmpeg installed you can use this to generate a video:

```
ffmpeg -framerate 1 -pattern_type glob -i '*.png' -c:v libx264 -r 30 -pix_fmt yuv420p sites.mp4
```
