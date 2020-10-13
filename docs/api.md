# videojs-zapping API Documentation

## Channel Object

The playlist is an array of channels objects, which have the following structure:

| Property  | Type   | Optional | Description                                                          |
| --------- | ------ | -------- | -------------------------------------------------------------------- |
| `sources` | Array  |          | An array of objects with the following attributes: `src` and `type`. |
| `poster`  | String | ✓        | A poster to display for the channel when not playing.                |

> Note: This version only supports one element in the `sources` array.

## Getting Started

The preferred way to initialize the plugin is as follows:

```js
const playlist = [
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/sintel/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/sintel/poster.png",
  },
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/bunny/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/bunny/poster.png",
  },
];
const zapping = player.zapping({
  playlist: playlist,
  autoplay: false,
});
```

But you can also do it as in the [Usage](../README.md#Usage) section od the [Documentation](../README.md).

### Default options

In addition to the playlist another options are configurable:

```js
const zapping = player.zapping({
  playlist: [], // default
  autoplay: false, // default
  startIndex: 0, // default
  components: true, //default
});
```

- `autoplay` : This option sets whether or not to play the video automatically when page loads. Default: false.
- `startIndex` : Sets the first channel to be played when page loads. Default: 0.
- `components` : If true, the player is customized with the 'Start from the beginning', 'Next Channel' and 'Previous Channel' buttons. Otherwise, the player is as default.

## Methods

### `zapping.getChannel([Number channel]) -> Array|Object|undefined`

If no number is passed as argument, returns the entire playlist, otherwise returns the selected channel object.

If the argument is not valid (e.g. the index is out of bounds) returns `undefined`.

```js
const playlist = [
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/sintel/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/sintel/poster.png",
  },
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/bunny/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/bunny/poster.png",
  },
];
const zapping = player.zapping({
  playlist: playlist,
});

zapping.getChannel();
// [{ ... }, ...]

zapping.getChannel(0);
// { ... }

zapping.getChannel(3); // out of bounds
// undefined
```

### `zapping.currentChannel() -> Number`

Gets the current channel number.

```js
const playlist = [
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/sintel/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/sintel/poster.png",
  },
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/bunny/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/bunny/poster.png",
  },
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/bunny/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/bunny/poster.png",
  },
];

const zapping = player.zapping({
  playlist: playlist,
  startIndex: 1,
});

zapping.currentChannel();
// 1
```

### `zapping.previousChannel() -> void`

Change the src of the player to the previous channel in the playlist.

If the channel is the first one, then the last one is played.

```js
const playlist = [
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/sintel/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/sintel/poster.png",
  },
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/bunny/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/bunny/poster.png",
  },
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/bunny/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/bunny/poster.png",
  },
];

const zapping = player.zapping({
  playlist: playlist,
  startIndex: 1,
});

zapping.previousChannel();
// will play src from video at the position 0

zapping.previousChannel();
// will play src from video at the last position
```

### `zapping.nextChannel() -> void`

Change the src of the player to the next channel in the playlist.

If the channel is the last one, then the first one is played.

```js
const playlist = [
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/sintel/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/sintel/poster.png",
  },
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/bunny/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/bunny/poster.png",
  },
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/bunny/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/bunny/poster.png",
  },
];

const zapping = player.zapping({
  playlist: playlist,
  startIndex: 1,
});

zapping.nextChannel();
// will play src from video at the position 2

zapping.nextChannel();
// will play src from video at position 0
```

### `zapping.playChannel([Number channel]) -> void`

Plays the channel passed by argument or first channel if not.

If it is the first time to watch this channel, then it would start at a random point of the video. That is to simulate better the experience of live TV.

On the other hand, after you hace watched the channel, the next time you select to watch it, it would show the 'live' content, calculating the time passed since you left the channel in the first place.

If the number of channel passed to be played is out of bounds, then the method will return without changing the channel.

Internally, `zapping.nextChannel()` and `zapping.previousChannel()` use this method to perform their tasks.

```js
const playlist = [
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/sintel/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/sintel/poster.png",
  },
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/bunny/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/bunny/poster.png",
  },
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/bunny/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/bunny/poster.png",
  },
];

const zapping = player.zapping({
  playlist: playlist,
  startIndex: 1,
});

zapping.playChannel();
// will play src from video at the position 0

zapping.playChannel(2);
// will play src from video at position 2
```

### `zapping.hasComponents() -> Boolean`

Verifies if components are active.

It is a utility method if you choose to implement your own components using this API.

### `zapping.toggleComponents() -> void`

Toggle the components in the player. The 'PicureInPicture' button is hidden if components are enabled. If you disable them, then that button is shown again.

### `zapping.lastChannel() -> void`

Plays the last seen channel.

```js
const playlist = [
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/sintel/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/sintel/poster.png",
  },
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/bunny/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/bunny/poster.png",
  },
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/bunny/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/bunny/poster.png",
  },
];

const zapping = player.zapping({
  playlist: playlist,
});

zapping.playChannel(0);
// will play channel 0

zapping.playChannel(2);
// will play channel 2

zapping.lastChannel();
// will play channel 0
```

### `zapping.favorite() -> Boolean`

Toggle favorite state to the currently playing channel. Also, it is added to the favorites list.

```js
const playlist = [
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/sintel/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/sintel/poster.png",
  },
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/bunny/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/bunny/poster.png",
  },
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/bunny/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/bunny/poster.png",
  },
];

const zapping = player.zapping({
  playlist: playlist,
});

zapping.playChannel(0);
// will play channel 0

zapping.favorite();
// will set favorite to true

zapping.favorite();
// will set favorite to false
```

### `zapping.nextFav() -> void`

Plays the next channel in the favorites list. If you're not watching a favorite channel and call this method, then the first favorite channel in the list is played.

```js
const playlist = [
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/sintel/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/sintel/poster.png",
  },
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/bunny/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/bunny/poster.png",
  },
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/bunny/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/bunny/poster.png",
  },
];

const zapping = player.zapping({
  playlist: playlist,
});

zapping.playChannel(0);
// will play channel 0

zapping.favorite();
// will set favorite to true

zapping.playChannel(1);
// will play channel 0

zapping.favorite();
// will set favorite to true of channel 1

zapping.nextFav();
// will play channel 0

zapping.nextFav();
// will play channel 1
```

### `zapping.prevFav() -> void`

Plays the previous channel in the favorites list. If you're not watching a favorite channel and call this method, then the first favorite channel in the list is played.

```js
const playlist = [
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/sintel/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/sintel/poster.png",
  },
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/bunny/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/bunny/poster.png",
  },
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/bunny/trailer.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/bunny/poster.png",
  },
];

const zapping = player.zapping({
  playlist: playlist,
});

zapping.playChannel(0);
// will play channel 0

zapping.favorite();
// will set favorite to true

zapping.playChannel(1);
// will play channel 0

zapping.favorite();
// will set favorite to true of channel 1

zapping.prevFav();
// will play channel 0

zapping.prevFav();
// will play channel 1
```
