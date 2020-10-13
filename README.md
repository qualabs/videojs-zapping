# videojs-zapping

A plugin to simulate the experience of watching live TV but in the browser.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
  - [`<script>` Tag](#script-tag)
  - [Browserify/CommonJS](#browserifycommonjs)
- [API Documentation](#api-documentation)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

![demo](/demo.gif)

## Installation

Install videojs-zapping via npm:

```sh
npm install videojs-zapping
```

## Usage

To include videojs-zapping on your website or web application, use any of the following methods.

It is mandatory to add an id to the `<video>` tag that matches the argument passed to the `videojs()` function. In this case the id of the video must be `'my-video'`

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-zapping.min.js"></script>
<script>
  var player = videojs('my-video');

  player.zapping({
    playlist: [
      {
        sources: [
          {
            src: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
            type: 'video/mp4',
          },
        ],
        poster: 'http://media.w3.org/2010/05/sintel/poster.png',
      },
      {
        sources: [
          {
            src: 'http://media.w3.org/2010/05/bunny/trailer.mp4',
            type: 'video/mp4',
          },
        ],
        poster: 'http://media.w3.org/2010/05/bunny/poster.png',
      },
    ],
  });
</script>
```

### Browserify/CommonJS

When using with Browserify, install videojs-zapping via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-zapping');

var player = videojs('my-video');

player.zapping({
  playlist: [
    {
      sources: [
        {
          src: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
          type: 'video/mp4',
        },
      ],
      poster: 'http://media.w3.org/2010/05/sintel/poster.png',
    },
    {
      sources: [
        {
          src: 'http://media.w3.org/2010/05/bunny/trailer.mp4',
          type: 'video/mp4',
        },
      ],
      poster: 'http://media.w3.org/2010/05/bunny/poster.png',
    },
  ],
});
```

## API Documentation

For the API Documentation, visit [this page](https://github.com/qualabs/videojs-zapping/blob/main/docs/api.md).

## License

Apache-2.0. Copyright (c) Qualabs

[videojs]: http://videojs.com/
[qualabs]: https://www.qualabs.com
