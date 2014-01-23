# rtc-videoproc

This is a small helper module that allows you to substitute a video
element with a canvas element.  This can be useful when you want to
do pixel manipulation of the rendered images, or in situations when
a video element does not behave as you expect.


[![NPM](https://nodei.co/npm/rtc-videoproc.png)](https://nodei.co/npm/rtc-videoproc/)

[![unstable](http://hughsk.github.io/stability-badges/dist/unstable.svg)](http://github.com/hughsk/stability-badges)

## Example Usage

This was primarily written to work with the
[rtc-media](https://github.com/rtc-io/rtc-media) library so here's an
example of how it works there:

```js
var media = require('rtc-media');
var processor = require('rtc-videoproc');

media().render(processor(document.body));
```

Normally, the `media().render` call will create a `<video>` element in
the specified target container.  In this case, however, `rtc-canvas`
intercepts the request and creates it's own fake video element that is
passed back to the render call.

## Using the Processing Pipeline

A processing pipeline has been included to assist with
manipulating the canvas on the fly. Adding a processor to the pipeline is
simply a matter of adding a pipeline processor available on the returned
fake video:

```js
// add a processor
canvas.pipeline.add(function(imageData) {
  // examine the pixel data

  // if we've modified the pixel data and want to write that back
  // to the canvas then we must return a truthy value
  return true;
});
```

A more complete example is shown below:

```js
var media = require('rtc-media');
var processor = require('rtc-videoproc');
var vid;

function handleDraw(imageData) {
  var channels = imageData.data;
  var rgb = [];
  var rgbAvg;
  var alpha;
  var ii;

  // check that we have channels is divisible by four (just as a safety)
  if (channels.length % 4 !== 0) {
    return;
  }

  // iterate through the data
  // NOTE: decrementing loops are fast but you need to know that you will
  // hit 0 using this logic otherwise it will run forever (only 0 is falsy)
  for (ii = channels.length; ii -= 4; ) {
    // get the rgb tuple
    rgb = [channels[ii], channels[ii + 1], channels[ii + 2]];

    // get the alpha value
    alpha = channels[ii + 3];

    // calculate the rgb average
    rgbAvg = (rgb[0] + rgb[1] + rgb[2] ) / 3;

    // update the values to the rgb average
    channels[ii] = channels[ii + 1] = channels[ii + 2] = rgbAvg;
  }

  return true;
}

// capture media
media().render(vid = processor(document.body));

// handle draw events on the fake video
vid.pipeline.add(handleDraw);
```

### Using the internal filters

From `rtc-videoproc@0.6` onwards, we have begun including some simple
filters as part of the library, which can be used by simply requiring
`rtc-videoproc/filters/%filtername%` and letting browserify do the rest.

An example of doing a grayscale transformation using the internal
filters is shown below:

```js
var media = require('rtc-media');
var processor = require('rtc-videoproc');
var vid;

// capture media
media().render(vid = processor(document.body));

// handle draw events on the fake video
vid.pipeline.add(require('rtc-videoproc/filters/grayscale'));
```

## Listening for custom `frame` events

In addition to providing the opportunity to analyse and modify pixel data
the `rtc-videoproc` module also provides the a custom `frame` event for
detecting when a new frame has been drawn to the canvas.

A simple example can be found below:

```js
var media = require('rtc-media');
var processor = require('rtc-videoproc');
var canvas = processor(document.body);

// capture the media and render to the fake canvas
media().render(canvas);

// listen from frames in the canvas
canvas.addEventListener('frame', function(evt) {
  console.log('captured frame at ' + evt.detail.tick);
});

```

## A Note with Regards to CPU Usage

By default rtc-videoproc will draw at 25fps but this can be modified to capture
at a lower frame rate for slower devices, or increased if you have a
machine with plenty of grunt.

## Reference

### videoproc(opts?)

Create (or patch) a `<canvas>` element that will receive the video images
from a video element.  The following options are supported.

- `canvas` - the canvas to draw video data to.  If not supplied a new 
  canvas element will be created.

- `video` - the video element that will be used as the source of the video.
   If not supplied a new `<video>` element will be created.
   
- `fps` - the redraw rate of the fake video (default = 25)

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
