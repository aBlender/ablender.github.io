var Spotify = new SpotifyWebApi();
Spotify.getToken().then(function (response) {
  Spotify.setAccessToken(response.token);
});

AFRAME.registerComponent('click-to-play',{
  schema: {
    playing: {default: false}
  },
  init: function(){
    this.el.sceneEl.addEventListener('click', function(){
      console.log("CLICKED ON SCENE");
      var analyser = document.querySelector('#analyser');
      var playing = analyser.getAttribute('click-to-play').playing;
      var textEl = document.querySelector('#statusText');
      var audioEl = document.querySelector('#song');
      if (playing == false){
        textEl.setAttribute("value", "   Playing Song   ");
        audioEl.play();
        analyser.setAttribute('click-to-play','playing',true);
      }
      else{
        textEl.setAttribute("value", "   Pausing Song   ");
        audioEl.pause();
        analyser.setAttribute('click-to-play','playing',false);
      }
    });
  }
});

AFRAME.registerComponent('click-to-play-spotify', {
  schema: {
    playing: {default: false}
  },
  init: function () {
    // Set up speech recognition.
    annyang.addCommands({
      'play *song': this.searchTrack.bind(this)
    });

    this.el.sceneEl.addEventListener('click', function(){
      console.log("CLICKED ON SCENE");
      var analyser = document.querySelector('#analyser');
      var playing = analyser.getAttribute('click-to-play-spotify').playing;
      var textEl = document.querySelector('#statusText');
      //var audioEl = document.querySelector('#song');
      var audioEl;

      annyang.start();

      // Create audio element to point to Spotify preview URL.
      audioEl = document.createElement('audio');
      audioEl.crossOrigin = 'anonymous';
      audioEl.loop = true;
      audioEl.id = 'spotifyTrack';
      analyser.appendChild(audioEl);
      analyser.setAttribute('audioanalyser', {src: '#spotifyTrack'});

      /*if (playing == false){
        textEl.setAttribute("value", "   Playing Song   ");
        audioEl.play();
        analyser.setAttribute('click-to-play','playing',true);
      }
      else{
        textEl.setAttribute("value", "   Pausing Song   ");
        audioEl.pause();
        analyser.setAttribute('click-to-play','playing',false);
      }*/
    });


  },
  searchTrack: function (query) {
    var audioEl = document.querySelector('#spotifyTrack');
    var el = this.el;
    Spotify.searchTracks(query).then(function (results) {
      var track = results.tracks.items[0];
      var previewUrl = track.preview_url;
      el.emit('spotify-play', results);
      audioEl.src = track.preview_url;
      audioEl.play();
    });
  }
});
