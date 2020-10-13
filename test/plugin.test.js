import document from 'global/document';

import QUnit from 'qunit';
import sinon from 'sinon';
import videojs from 'video.js';

import plugin from '../src/plugin';

const Player = videojs.getComponent('Player');

QUnit.test('the environment is sane', function(assert) {
  assert.strictEqual(typeof Array.isArray, 'function', 'es5 exists');
  assert.strictEqual(typeof sinon, 'object', 'sinon exists');
  assert.strictEqual(typeof videojs, 'function', 'videojs exists');
  assert.strictEqual(typeof plugin, 'function', 'plugin is a function');
});

QUnit.module('videojs-zapping', {

  beforeEach() {

    // Mock the environment's timers because certain things - particularly
    // player readiness - are asynchronous in video.js 5. This MUST come
    // before any player is created; otherwise, timers could get created
    // with the actual timer methods!
    this.clock = sinon.useFakeTimers();

    this.fixture = document.getElementById('qunit-fixture');
    this.video = document.createElement('video');
    this.fixture.appendChild(this.video);
    this.player = videojs(this.video);
  },

  afterEach() {
    this.player.dispose();
    this.clock.restore();
  }
});

QUnit.test('registers itself with video.js', function(assert) {
  assert.expect(2);

  assert.strictEqual(
    typeof Player.prototype.zapping,
    'function',
    'videojs-zapping plugin was registered'
  );

  this.player.zapping({ playlist: [
    {
      sources: [
        {
          src: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
          type: 'video/mp4'
        }
      ],
      poster: 'http://media.w3.org/2010/05/sintel/poster.png'
    },
    {
      sources: [
        {
          src: 'http://media.w3.org/2010/05/bunny/trailer.mp4',
          type: 'video/mp4'
        }
      ],
      poster: 'http://media.w3.org/2010/05/bunny/poster.png'
    },
    {
      sources: [
        {
          src: 'http://vjs.zencdn.net/v/oceans.mp4',
          type: 'video/mp4'
        }
      ],
      poster: 'http://www.videojs.com/img/poster.jpg'
    },
    {
      sources: [
        {
          src: 'http://media.w3.org/2010/05/bunny/movie.mp4',
          type: 'video/mp4'
        }
      ],
      poster: 'http://media.w3.org/2010/05/bunny/poster.png'
    },
    {
      sources: [
        {
          src: 'http://media.w3.org/2010/05/video/movie_300.mp4',
          type: 'video/mp4'
        }
      ],
      poster: 'http://media.w3.org/2010/05/video/poster.png'
    }
  ]});

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  assert.ok(
    this.player.hasClass('vjs-zapping'),
    'the plugin adds a class to the player'
  );
});
