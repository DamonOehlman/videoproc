/* jshint node: true */
/* global document: false */
/* global HTMLVideoElement: false */
'use strict';

var DEFAULT_FPS = 25;
var raf = require('cog/raf');

/**
  # fakevid

  This is a small helper module that allows you to substitute a video
  element with a canvas element.  This can be useful when you want to 
  do pixel manipulation of the rendered images, or in situations when 
  a video element does not behave as you expect.

  ## Example Usage

  This was primarily written to work with the
  [rtc-media](https://github.com/rtc-io/rtc-media) library so here's an
  example of how it works there:

  <<< examples/rtc-media.js

  Normally, the `media().render` call will create a `<video>` element in
  the specified target container.  In this case, however, `fakevid` intercepts
  the request and creates it's own fake video element that is passed back
  to the render call.

  ## Using the Processing Pipeline

  As of `fakevid@0.3` a processing pipeline has been included to assist with
  manipulating the canvas on the fly. Adding a processor to the pipeline is
  simply a matter of adding a pipeline processor available on the returned
  fake video:

  ```js
  // add a processor
  vid.pipeline.add(function(imageData) {
    // examine the pixel data

    // if we've modified the pixel data and want to write that back
    // to the canvas then we must return a truthy value
    return true;
  });
  ```

  A more complete example is shown below:

  <<< examples/grayscale-filter.js

  ## A Note with Regards to CPU Usage

  By default fakevid will draw at 25fps but this can be modified to capture
  at a lower frame rate for slower devices, or increased if you have a
  machine with plenty of grunt.

  ## Reference

  ### fakevid(target, opts)

  Create a fake video element for the specified target element.

  - `fps` - the redraw rate of the fake video (default = 25)
  
**/
module.exports = function(target, opts) {
  var canvas = (target instanceof HTMLCanvasElement) ?
    target :
    document.createElement('canvas');

  var vid = (target instanceof HTMLVideoElement) ?
    target :
    document.createElement('video');

  // if the target is a video
  if (target === vid) {
    // insert the canvas to the video parent element
    vid.parentNode.insertBefore(canvas, vid);
  }
  // otherwise, if the target was not a canvas add the canvas to the target
  else if (target !== canvas) {
    // append the canvas to the target
    target.appendChild(canvas);
  }

  // initialise the canvas width and height
  canvas.width = (opts || {}).width || 0;
  canvas.height = (opts || {}).height || 0;

  // hide the video element
  vid.style.display = 'none';

  // initialise the canvas pipeline
  canvas.pipeline = createFacade(canvas, vid, opts);

  return canvas;
};

/*
  ### createFacade(canvas, vid) ==> EventEmitter

  Inject the required fake properties onto the canvas and return a
  node-style EventEmitter that will provide updates on when the properties
  change.

*/
function createFacade(canvas, vid, opts) {
  var context = canvas.getContext('2d');
  var playing = false;
  var lastTick = 0;
  var tick;

  // initialise fps
  var fps = (opts || {}).fps || DEFAULT_FPS;

  // calaculate the draw delay, clamp as int
  var drawDelay = (1000 / fps) | 0;
  var drawWidth;
  var drawHeight;
  var drawX = 0;
  var drawY = 0;
  var drawData;

  var processors = [];
  var pIdx;
  var pCount = 0;

  function addProcessor(processor) {
    pCount = processors.push(processor);
  }

  function redraw() {
    var imageData;
    var tweaked;

    if (! playing) {
      return;
    }

    // get the current tick
    tick = Date.now();

    // only draw as often as specified in the fps
    if (tick - lastTick > drawDelay) {
      // draw the image
      context.drawImage(vid, drawX, drawY, drawWidth, drawHeight);

      // if we have processors, get the image data and pass it through
      if (pCount) {
        imageData = context.getImageData(0, 0, drawWidth, drawHeight);
        tweaked = false;

        // iterate through the processors
        for (pIdx = 0; pIdx < pCount; pIdx++) {
          // call the processor, and allow it to tell us if it has modified
          // the pipeline
          tweaked = processors[pIdx](imageData, context, canvas, drawData) ||
            tweaked;
        }

        if (tweaked) {
          // TODO: dirty area
          context.putImageData(imageData, 0, 0);
        }
      }

      // update the last tick
      lastTick = tick;
    }

    // queue up another redraw
    raf(redraw);
  }

  function handlePlaying() {
    var scale;
    var scaleX;
    var scaleY;
    
    // set the canvas the right size (if not already initialized)
    if (canvas.width === 0 || canvas.height === 0) {
      canvas.width = vid.videoWidth;
      canvas.height = vid.videoHeight;
    }

    // if either width or height === 0 then bail
    if (canvas.width === 0 || canvas.height === 0) {
      return;
    }

    // calculate required scaling
    scale = Math.min(
      scaleX = (canvas.width / vid.videoWidth),
      scaleY = (canvas.height / vid.videoHeight)
    );

    // calculate the scaled draw width and height
    drawWidth = (vid.videoWidth * scale) | 0;
    drawHeight = (vid.videoHeight * scale) | 0;

    // calculate the offsetX and Y
    drawX = (canvas.width - drawWidth) >> 1;
    drawY = (canvas.height - drawHeight) >> 1;

    // save the draw data
    drawData = {
      x: drawX,
      y: drawY,
      width: drawWidth,
      height: drawHeight
    };

    // flag as playing
    playing = true;

    // start the animation loop
    raf(redraw);
  }

  vid.addEventListener('playing', handlePlaying);

  // inject the fake properties
  ['mozSrcObject', 'src'].forEach(function(prop) {
    if (typeof vid[prop] == 'undefined') {
      return;
    }

    Object.defineProperty(canvas, prop, {
      get: function() {
        return vid[prop];
      },

      set: function(value) {
        vid[prop] = value;
      }
    });
  });

  // add a fake play function
  canvas.play = function() {
    // play the video
    vid.play();
  };

  return {
    add: addProcessor 
  };
}