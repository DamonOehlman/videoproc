var crel = require('crel');
var media = require('rtc-media');
var videoproc = require('..');
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