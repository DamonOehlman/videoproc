var videoproc = require('..');
var crel = require('crel');
var video = crel('video', { src: '../test/assets/tennis.webm', autoplay: true });

// set up the video processing pipeline
videoproc(video).on('frame', function(tick) {
  console.log('captured frame at: ' + tick);
});

// add the canvas to the dom
document.body.appendChild(video);
