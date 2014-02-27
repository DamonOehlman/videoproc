var media = require('rtc-media');
var videoproc = require('..');
var crel = require('crel');
var video = crel('video');

// set up the video processing pipeline
videoproc(video).on('frame', function(tick) {
  console.log('captured frame at: ' + tick);
});

// capture media and render to the video
media().render(video);

// add the canvas to the dom
document.body.appendChild(video);