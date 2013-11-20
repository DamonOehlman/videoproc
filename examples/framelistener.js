var media = require('rtc-media');
var fakevid = require('..');
var canvas = fakevid(document.body);

// capture the media and render to the fake canvas
media().render(canvas);

// listen from frames in the canvas
canvas.addEventListener('frame', function(evt) {
  console.log('captured frame at ' + evt.detail.tick);
});
