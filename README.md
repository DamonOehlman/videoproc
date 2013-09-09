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

  // iterate through the data
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

## Reference

### canvas(target, opts)

Create a fake video element for the specified target element.

- `fps` - the redraw rate of the fake video (default = 25)

## License(s)

### MIT

Copyright (c) 2013 National ICT Australia Limited (NICTA)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
