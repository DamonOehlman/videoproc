var media = require('rtc-media');
var processor = require('..');
var vid;

// capture media
media().render(vid = processor(document.body));

// handle draw events on the fake video
vid.pipeline.add(require('../filters/grayscale'));