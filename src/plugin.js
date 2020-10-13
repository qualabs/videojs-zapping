import videojs from 'video.js';
import { version as VERSION } from '../package.json';

const Plugin = videojs.getPlugin('plugin');

// Default options for the plugin.
const defaults = {
  startIndex: 0,
  playlist: [],
  autoplay: false,
  components: true
};

class PreviousButton extends videojs.getComponent('Button') {
  constructor(player, options = {}) {
    super(player, options);
    this.name_ = 'PreviousButton';
    this.addClass('vjs-previous-button');
    this.el().children[0].classList.add('vjs-icon-previous-item');
  }
  handleClick(e) {
    this.player_.zapping().previousChannel();
  }
}

class NextButton extends videojs.getComponent('Button') {
  constructor(player, options = {}) {
    super(player, options);
    this.name_ = 'NextButton';
    this.addClass('vjs-next-button');
    this.el().children[0].classList.add('vjs-icon-next-item');
  }

  handleClick(e) {
    this.player_.zapping().nextChannel();
  }
}

class ReplayButton extends videojs.getComponent('Button') {
  constructor(player, options = {}) {
    super(player, options);
    this.name_ = 'ReplayButton';
    this.addClass('vjs-replay-button');
    this.el().children[0].classList.add('vjs-icon-replay');
  }

  handleClick(e) {
    this.player_.currentTime(0);
  }
}

class FavButton extends videojs.getComponent('Button') {
  constructor(player, options = {}) {
    super(player, options);
    this.name_ = 'FavButton';
    this.addClass('vjs-fav-button');
    this.el().innerHTML = '&#9734;';
  }

  handleClick(e) {
    this.player_.zapping().favorite();
  }

  setColor(fav) {
    if (fav) {
      this.el().innerHTML = '&#9733;';
    } else {
      this.el().innerHTML = '&#9734;';
    }
  }
}

const Component = videojs.getComponent('Component');
const ChannelNumber = videojs.extend(Component, {
  constructor(player, options) {
    Component.apply(this, arguments);
    if (options.channel) {
      this.updateChannelNumber(options.channel);
    }
  },
  createEl() {
    return videojs.dom.createEl('div', {
      className: 'vjs-channel-number'
    });
  },
  updateChannelNumber(channel) {
    if (typeof channel !== 'string') {
      channel = 'Unknown Channel';
    }
    videojs.dom.emptyEl(this.el());
    videojs.dom.appendContent(this.el(), channel);
  }
});

class Zapping extends Plugin {
  /**
   * Create a Zapping plugin instance.
   *
   * @param  {Player} player
   *         A Video.js Player instance.
   *
   * @param  {Object} [options]
   *         An optional options object.
   *
   *         Defaults:
   *           {
   *              startIndex: 0,
   *              playlist: [],
   *              autoplay: false
   *          }
   *
   */
  constructor(player, options) {
    // the parent class will add player under this.player
    super(player);

    this.options = videojs.mergeOptions(defaults, options);
    this.playlist = this.options.playlist;
    if (
      this.options.playlist.length <= this.options.startIndex ||
      this.options.startIndex < 0
    ) {
      throw new Error('Start index is too large or lower then zero.');
    }

    this.currentIndex = this.options.startIndex;
    this.components = this.options.components;
    this.lastChannelNumber = this.currentIndex;
    this.favorites = [];

    this.initPlaylist();
    this.player.ready(() => {
      this.player.addClass('vjs-zapping');
      this.player.aspectRatio('16:9');
      this.player.loop(true);
      this.playChannel(this.currentIndex, this.options.autoplay);
    });

    videojs.registerComponent('ChannelNumber', ChannelNumber);

    const controlBar = this.player.getChild('ControlBar');

    if (controlBar.getChild('PictureInPictureToggle') !== undefined) {
      controlBar.getChild('PictureInPictureToggle').hide();
    }

    const prevButton = new PreviousButton(this.player);
    const nextButton = new NextButton(this.player);
    const replayButton = new ReplayButton(this.player);
    const favButton = new FavButton(this.player);

    controlBar.addChild(replayButton);
    controlBar.addChild(prevButton);
    controlBar.addChild(nextButton);
    controlBar.addChild(favButton);
    this.player.addChild('ChannelNumber', {
      channel: this.currentIndex.toString()
    });
  }

  initPlaylist() {
    for (let i = 0; i < this.playlist.length; i++) {
      const channel = this.playlist[i];

      if (!channel.hasOwnProperty('played')) {
        channel.played = false;
      }
      if (!channel.hasOwnProperty('length')) {
        channel.length = 0;
      }
      if (!channel.hasOwnProperty('startTime')) {
        channel.startTime = 0;
      }
      if (!channel.hasOwnProperty('startedInSec')) {
        channel.startedInSec = 0;
      }
      if (!channel.hasOwnProperty('favorite')) {
        channel.favorite = false;
      }
    }
  }

  /**
   * Gets the channels playlist or a specific channel
   *
   * @param {number} index Channel number in the playlist
   *
   * @return {Object|Array|undefined} Returns the playlist if index is not specified, otherwise returns the channel object
   */
  getChannel(index = null) {
    if (index && (index < 0 || index > this.playlist.length)) {
      return undefined;
    }
    return !index ? this.playlist : this.playlist[index];
  }

  /**
   * Plays a channel on the playlist. If index isn't valid, current video remains playing.
   *
   * @param {number} index The index of the channel to be played.
   */
  playChannel(index = 0, play = true) {

    index = parseInt(index, 10);

    if (index < 0 || index > this.playlist.length - 1) {
      return;
    }

    if (this.currentIndex !== index) {
      this.lastChannelNumber = this.currentIndex;
    }
    this.currentIndex = index;
    const channel = this.playlist[index];

    this.player.getChild('ControlBar').getChild('FavButton').setColor(channel.favorite);

    this.player.src(channel.sources[0].src);
    if (channel.poster) {
      this.player.poster(channel.poster);
    }

    this.player.one('loadedmetadata', (e) => {
      if (this.player.liveTracker && this.player.liveTracker.isLive() || this.player.duration() === Infinity) {
        this.player.liveTracker.seekToLiveEdge()
        channel.played = true;
      } else {
        if (play) {
          this.player.play();
        }
        channel.length = this.player.duration();
        if (!channel.played) {
          this.player.currentTime(Math.trunc(Math.random() * this.player.duration()));
          channel.startTime = Date.now() / 1000;
          channel.played = true;
          channel.startedInSec = this.player.currentTime();
        } else {
          const timePlaying = Date.now() / 1000 - channel.startTime;

          this.player.currentTime((timePlaying + channel.startedInSec) % channel.length);
        }
      }
    });

    this.player.removeChild('ChannelNumber');
    this.player.addChild('ChannelNumber', {
      channel: index.toString()
    });
    this.player.getChild('ChannelNumber').addClass('vjs-zapping-show');
    setTimeout(
      () =>
        this.player.getChild('ChannelNumber').removeClass('vjs-zapping-show'),
      4000
    );
  }

  /**
   * Plays the previous channel of the playlist.
   */
  previousChannel() {
    const newIndex =
      this.currentIndex > 0 ? this.currentIndex - 1 : this.playlist.length - 1;

    this.playChannel(newIndex);
  }

  /**
   * Plays the next channel of the playlist.
   */
  nextChannel() {
    const newIndex =
      this.currentIndex < (this.playlist.length - 1) ? (this.currentIndex + 1) : 0;

    this.playChannel(newIndex);
  }
  /**
   * Gets the current channel number.
   *
   * @return {number} Current channel number.
   */
  currentChannel() {
    return this.currentIndex;
  }
  /**
   * Verifies if components are active.
   *
   * @returns whether or not components are showing in the player.
   */
  hasComponents() {
    return this.components;
  }
  /**
   * Toggle the components in the player.
   */
  toggleComponents() {
    const controlBar = this.player.getChild('ControlBar');

    if (this.components) {
      controlBar.getChild('PreviousButton').hide();
      controlBar.getChild('NextButton').hide();
      controlBar.getChild('ReplayButton').hide();
      controlBar.getChild('FavButton').hide();
      if (controlBar.getChild('PictureInPictureToggle') !== undefined) {
        controlBar.getChild('PictureInPictureToggle').show();
      }
    } else {
      controlBar.getChild('PreviousButton').show();
      controlBar.getChild('NextButton').show();
      controlBar.getChild('ReplayButton').show();
      controlBar.getChild('FavButton').show();
      if (controlBar.getChild('PictureInPictureToggle') !== undefined) {
        controlBar.getChild('PictureInPictureToggle').hide();
      }
    }
    this.components = !this.components;
  }

  /**
   * Plays the last seen channel
   */
  lastChannel() {
    this.playChannel(this.lastChannelNumber);
  }

  /**
   * Add the channel to the favorite's list.
   *
   * @returns {Boolean} channel favorite state
   */
  favorite() {
    const isFav = this.playlist[this.currentIndex].favorite;

    this.player.getChild('ControlBar').getChild('FavButton').setColor(!isFav);

    this.playlist[this.currentIndex].favorite = !isFav;
    if (isFav) {
      this.favorites = this.favorites.filter(i => i !== this.currentIndex);
    } else {
      this.favorites.push(this.currentIndex);
      this.favorites.sort();
    }

    return !isFav;
  }

  /**
   * Plays the next channel in the favorites list. If you're not watching a favorite channel
   * and call this method, then the first favorite channel in the list is played.
   */
  nextFav() {
    const index = this.favorites.findIndex(i => i === this.currentIndex);

    const next = index === this.favorites.length - 1 ? 0 : index + 1;

    this.playChannel(this.favorites[next]);
  }

  /**
   * Plays the previous channel in the favorites list. If you're not watching a favorite channel
   * and call this method, then the first favorite channel in the list is played.
   */
  prevFav() {
    const index = this.favorites.findIndex(i => i === this.currentIndex);

    const prev = index !== -1 ? (index === 0 ? this.favorites.length - 1 : index - 1) : 0;

    this.playChannel(this.favorites[prev]);
  }
}

videojs.registerComponent('channelNumber', ChannelNumber);

// Include the version number.
Zapping.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('zapping', Zapping);

export default Zapping;
