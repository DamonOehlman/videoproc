var EventEmitter = require('events').EventEmitter;
var videoproc = require('../');
var crel = require('crel');
var test = require('tape');
var video;
var processor;

test('create a video element and load the test file', function(t) {
  t.plan(1);
  video = crel('video');
  video.src = 'tennis.webm';

  video.addEventListener('canplay', function() {
    t.pass('can play the video');
  });
});

test('create a video processor for the video', function(t) {
  t.plan(1);
  processor = videoproc(video);
  t.ok(processor instanceof EventEmitter, 'created event emitter');
});

test('capture a frame of the video', function(t) {
  t.plan(2);
  processor.once('frame', function(tick) {
    t.ok(tick, 'got tick');
  });
});

// test('play the video', function(t) {
//   video.play();
//   video.addEventListener('playing', function() {
//     debugger;
//   });
// });