const player = (window.player = videojs("videojs-zapping-player", {
  liveui: true,
}));
const playlist = [
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
        src: "http://vjs.zencdn.net/v/oceans.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://www.videojs.com/img/poster.jpg",
  },
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/bunny/movie.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/bunny/poster.png",
  },
  {
    sources: [
      {
        src: "http://media.w3.org/2010/05/video/movie_300.mp4",
        type: "video/mp4",
      },
    ],
    poster: "http://media.w3.org/2010/05/video/poster.png",
  },
];
const zapping = (window.zapping = player.zapping({
  playlist: playlist,
  autoplay: true,
}));

document.getElementById("channelHelp").innerText =
  "0 - " + (zapping.getChannel().length - 1);

const muteCb = document.getElementById("muteCb");

muteCb.addEventListener("change", (e) => {
  player.muted(!player.muted());
});

const controlsCb = document.getElementById("controlsCb");

controlsCb.addEventListener("change", (e) => {
  player.controls(!player.controls());
});

const autoplayCb = document.getElementById("autoplayCb");

autoplayCb.addEventListener("change", (e) => {
  player.autoplay(!player.autoplay());
});

const loopCb = document.getElementById("loopCb");

loopCb.addEventListener("change", (e) => {
  player.loop(!player.loop());
});

const videoFormEle = document.getElementById("videoForm");

videoFormEle.onsubmit = (e) => {
  e.preventDefault();
  const src = document.getElementById("videoUrl").value;

  player.src(src);
};

const gotoInp = document.getElementById("gotoTime");

gotoInp.addEventListener("blur", (e) => {
  player.currentTime(e.target.value);
});

const channel = document.getElementById("changeChannelForm");

channel.addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopPropagation();
  zapping.playChannel(document.getElementById("channelNumber").value);
});
const addRow = (src, type, i) => {
  return (
    "<tr>" +
    '<th scope="row">' +
    i +
    "</th>" +
    "<td>" +
    src +
    "</td>" +
    "<td>" +
    type +
    "</td>" +
    "</tr>"
  );
};
for (let i = 0; i < playlist.length; i++) {
  document.getElementById("tableBody").innerHTML += addRow(
    playlist[i].sources[0].src,
    playlist[i].sources[0].type,
    i
  );
}

const lCha = document.getElementById("lastChannel");
lCha.addEventListener("click", (e) => {
  e.preventDefault();
  zapping.lastChannel();
});

const favBtn = document.getElementById("fav");
favBtn.addEventListener("click", (e) => {
  zapping.favorite();
});

const pFavBtn = document.getElementById("pFav");
pFavBtn.addEventListener("click", (e) => {
  zapping.prevFav();
});

const nFavBtn = document.getElementById("nFav");
nFavBtn.addEventListener("click", (e) => {
  zapping.nextFav();
});
