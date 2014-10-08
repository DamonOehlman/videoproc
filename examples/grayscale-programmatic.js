var crel = require('crel');
var media = require('rtc-media');
var videoproc = require('..');
var video = crel('video', { src: '../test/assets/tennis.webm', autoplay: true });
var canvas = crel('canvas');
var processor = videoproc(video, canvas, {
  filter: function(imageData) {
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
});

// add the canvas to the document
document.body.appendChild(canvas);
