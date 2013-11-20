# rtc-canvas

This is a small helper module that allows you to substitute a video
element with a canvas element.  This can be useful when you want to
do pixel manipulation of the rendered images, or in situations when
a video element does not behave as you expect.


[![NPM](https://nodei.co/npm/rtc-canvas.png)](https://nodei.co/npm/rtc-canvas/)

[![unstable](http://hughsk.github.io/stability-badges/dist/unstable.svg)](http://github.com/hughsk/stability-badges)

## Example Usage

This was primarily written to work with the
[rtc-media](https://github.com/rtc-io/rtc-media) library so here's an
example of how it works there:

```js
var media = require('rtc-media');
var fakevid = require('rtc-canvas');

media().render(fakevid(document.body));
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
var fakevideo = require('rtc-canvas');
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
media().render(vid = fakevideo(document.body));

// handle draw events on the fake video
vid.pipeline.add(handleDraw);
```

## A Note with Regards to CPU Usage

By default rtc-canvas will draw at 25fps but this can be modified to capture
at a lower frame rate for slower devices, or increased if you have a
machine with plenty of grunt.

## Listening for custom `frame` events

In addition to providing the opportunity to analyse and modify pixel data
the `rtc-canvas` module also provides the a custom `frame` event for
detecting when a new frame has been drawn to the canvas.

A simple example can be found below:

```js
var media = require('rtc-media');
var fakevid = require('rtc-canvas');
var canvas = fakevid(document.body);

// capture the media and render to the fake canvas
media().render(canvas);

// listen from frames in the canvas
canvas.addEventListener('frame', function(evt) {
  console.log('captured frame at ' + evt.detail.tick);
});

```

## Reference

### canvas(target, opts)

Create a fake video element for the specified target element.

- `fps` - the redraw rate of the fake video (default = 25)

## License(s)

### Apache 2.0

Copyright 2013 National ICT Australia Limited (NICTA)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
