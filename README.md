# rtc-videoproc

This is a small helper module that allows you to substitute a video
element with a canvas element.  This can be useful when you want to
do pixel manipulation of the rendered images, or in situations when
a video element does not behave as you expect.


[![NPM](https://nodei.co/npm/rtc-videoproc.png)](https://nodei.co/npm/rtc-videoproc/)

[![unstable](http://hughsk.github.io/stability-badges/dist/unstable.svg)](http://github.com/hughsk/stability-badges)

## Example Usage

```js
var crel = require('crel');
var media = require('rtc-media');
var videoproc = require('rtc-videoproc');
var vid = crel('video');
var canvas = crel('canvas');

// create the processor
var processor = videoproc(vid, canvas, {
  filter: require('rtc-filter-grayscale')
});

// capture media and render
media().render(vid);

// add the canvas to the document
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
var media = require('rtc-media');
var videoproc = require('rtc-videoproc');
var crel = require('crel');
var video = crel('video');

// set up the video processing pipeline
videoproc(video).on('frame', function(imageData, tick) {
  console.log('captured frame at: ' + tick);
});

// capture media and render to the video
media().render(video);

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

### Apache 2.0

Copyright 2014 National ICT Australia Limited (NICTA)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
