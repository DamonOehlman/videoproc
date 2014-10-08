var crel = require('crel');
var videoproc = require('..');
var video = crel('video', { src: '../test/assets/tennis.webm', autoplay: true });
var canvas = crel('canvas');
var processor = videoproc(video, canvas, {
  filter: require('rtc-filter-grayscale')
});

document.body.appendChild(canvas);
