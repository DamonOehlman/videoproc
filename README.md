# videoproc

This is a small helper module that allows you to substitute a video
element with a canvas element.  This can be useful when you want to
do pixel manipulation of the rendered images, or in situations when
a video element does not behave as you expect.


[![NPM](https://nodei.co/npm/videoproc.png)](https://nodei.co/npm/videoproc/)

[![Build Status](https://api.travis-ci.org/DamonOehlman/rtc-videoproc.svg?branch=master)](https://travis-ci.org/DamonOehlman/rtc-videoproc) [![bitHound Score](https://www.bithound.io/github/DamonOehlman/rtc-videoproc/badges/score.svg)](https://www.bithound.io/github/DamonOehlman/rtc-videoproc) 

## Example Usage

```js
var crel = require('crel');
var videoproc = require('videoproc');
var video = crel('video', { src: '../test/assets/tennis.webm', autoplay: true });
var canvas = crel('canvas');
var processor = videoproc(video, canvas, {
  filter: require('rtc-filter-grayscale')
});

document.body.appendChild(canvas);

```

## Using the Processing Pipeline

A processing pipeline has been included to assist with
manipulating the canvas on the fly. To specify the filters to be used
in the processing pipeline, this is done in the options accepted by
videoproc. Either specifying an array of filters with the `filters` option
or a single filter function with the `filter` option is fine.  If you use
both then the individual filter will be added filter list and used in
series.

```js
videoproc(srcVideo, targetCanvas, {
  filters: [
    require('rtc-filter-grayscale'),
    myCustomFilterFunction
  ]
});
```

## Writing a Filter Function

Writing a filter function is very simple, and they use the following
function signature:

```js
function filter(imageData, tick) {
}
```

The `imageData` arg is an
[ImageData](http://www.w3.org/TR/2dcontext/#imagedata), and the `tick`
argument refers to the tick that has been captured as part of the capture
loop (be aware that it could be a high resolution timer value if rAF is
being used).

If you are writing an analysis filter, then simply do what you need to do
and exit the function.  If you have written a filter that modifies the pixel
data and you want this drawn back to the canvas then your **filter must
return `true`** to tell `rtc-videoproc` that it should draw the imageData
back to the canvas.

## Listening for custom `frame` events

In addition to providing the opportunity to analyse and modify pixel data
the `rtc-videoproc` module also provides the a custom `frame` event for
detecting when a new frame has been drawn to the canvas.

A simple example can be found below:

```js
var videoproc = require('videoproc');
var crel = require('crel');
var video = crel('video', { src: '../test/assets/tennis.webm', autoplay: true });

// set up the video processing pipeline
videoproc(video).on('frame', function(tick) {
  console.log('captured frame at: ' + tick);
});

// add the canvas to the dom
document.body.appendChild(video);

```

NOTE: The `frame` event occurs after the filter pipeline has been run and
and the imageData may have been modified from the original video frame.

## A Note with Regards to CPU Usage

By default rtc-videoproc will draw at 25fps but this can be modified to capture
at a lower frame rate for slower devices, or increased if you have a
machine with plenty of grunt.

## Reference

### videoproc(src, target, opts?)

Create (or patch) a `<canvas>` element that will receive the video images
from a video element.  The following options are supported.

- `canvas` - the canvas to draw video data to.  If not supplied a new
  canvas element will be created.

- `video` - the video element that will be used as the source of the video.
   If not supplied a new `<video>` element will be created.

- `fps` - the redraw rate of the fake video (default = 25)

- `greedy` - Specify `greedy: true` if you want the videoproc module to run
  it's capture loop using setTimeout rather than `requestAnimationFrame`.
  Doing this will mean you application will continue to capture and process
  frames even when it's tab / window becomes inactive. This is usually the
  desired behaviour with video conferencing applications.

## License(s)

### ISC

Copyright (c) 2015, Damon Oehlman <damon.oehlman@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
