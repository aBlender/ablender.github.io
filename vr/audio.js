var Spotify = new SpotifyWebApi();
Spotify.getToken().then(function (response) {
  Spotify.setAccessToken(response.token);
});

AFRAME.registerComponent('click-to-play',{
  schema: {
    playing: {default: false}
  },
  init: function(){
    //var data = this.data;
    //var playing = this.data.playing;
    var el = this.el;
    var data = this.data;
    el.addEventListener('click', function(){
      console.log("CLICKED ON ELEMENT");
      //var analyser = document.querySelector('#analyser');
      //var data = this.el.data;
      var playing = el.getAttribute('click-to-play').playing;
      console.log(playing);
      var textEl = document.querySelector('#playText');
      var audioEl = document.querySelector('#song');
      if (playing == false){
        textEl.setAttribute("value", "PAUSE SONG");
        audioEl.play();
        el.setAttribute('click-to-play','playing',true);
      }
      else{
        textEl.setAttribute("value", "PLAY SONG");
        audioEl.pause();
        el.setAttribute('click-to-play','playing',false);
      }
    });
  }
});

AFRAME.registerComponent('click-to-listen',{
  init: function(){
    // Set up speech recognition.
    annyang.addCommands({
      '*song': this.searchTrack.bind(this)
    });
    annyang.pause();

    this.el.addEventListener('click', function(){
      console.log("Listening");
      var textEl = document.querySelector('#songInfo');
      var playText = document.querySelector('#playText')
      var audioEl = document.querySelector('#song');
      var playEl = document.querySelector('#rightEyeball');
      playText.setAttribute("value", "PLAY SONG");
      audioEl.pause();
      playEl.setAttribute('click-to-play','playing',false);
      textEl.setAttribute("value", "     Listening     ");
      annyang.start({autoRestart: false, continuous: false});
    });
  },
  searchTrack: function (query) {
    var audioEl = document.querySelector('#song');
    var textEl = document.querySelector('#songInfo');
    textEl.setAttribute("value", "Searching for " + query);
    var el = this.el;
    console.log(query);
    if (query == "trash80"){
      audioEl.src = "trash80.mp3";
      textEl.setAttribute("value", "Trash80 - Sidk Fnck");
    }else if(query == "cider time"){
      audioEl.src = "cidertime.flac";
      textEl.setAttribute("value", "Lifeformed - Cider Time");
    }else if(query == "9 bit Expedition"){
      audioEl.src = "9bitexpedition.flac";
      textEl.setAttribute("value", "Lifeformed - 9-Bit Expedition");
    }else if(query == "summer vibe"){
      audioEl.src = "summervibe.mp3";
      textEl.setAttribute("value", "Walk Off The Earth - Summer Vibe");
    }else if(query == "Party Rock Anthem"){
      audioEl.src = "partyrockanthem.mp3";
      textEl.setAttribute("value", "Walk Off The Earth - Party Rock Anthem");
    }else{
      Spotify.searchTracks(query).then(function (results) {
        var track = results.tracks.items[0];
        textEl.setAttribute("value", track.artists[0].name + " - " + track.name);
        var previewUrl = track.preview_url;
        el.emit('spotify-play', results);
        audioEl.src = track.preview_url;
      });
    }
  }
});

AFRAME.registerSystem('speech-command', {
    init: function () {
        //console.log("in speech-command system init");
        this.entities = [];
        //window.addEventListener('loaded', this.onSceneLoaded.bind(this));
    },
    registerMe: function (comp) {
        this.entities.push(comp);
        //console.log("in register, comp: "+comp.data.command);
    },
    unregisterMe: function (comp) {
        var index = this.entities.indexOf(comp);
        this.entities.splice(index, 1);
    },
    onSceneLoaded: function(evt) {
        //console.log("in speech-command system onSceneLoaded listener");
    },
    play: function() {
        //console.log("in system play, entities: "+this.entities);
    }
});
AFRAME.registerComponent('speech-command', {
    multiple: true,
    schema: {
        command: { type: 'string' },
        type: { type: 'string' },
        targetElement: { type: 'selector' },
        targetComponent: { type: 'string' },
        function: { type: 'string' },
        attribute: { type: 'string' },
        value: { type: 'string' },
        keyCode: { type: 'string' }
    },
    init: function () {
        this.system.registerMe(this);
        if (!this.data.targetElement) {
            this.data.targetElement = this.el;
        }
        if (this.data.keyCode) {
            window.addEventListener('keyup', this.onKeyup.bind(this));
        }
    },
    remove: function () {
        this.system.unregisterMe(this);
    },
    play: function() {
        //console.log("in speech-command play, command: "+this.data.command+", type: "+this.data.type);
    },
    executeCommand: function () {
        //console.log("in executeCommand for: "+this.data.targetElement);
        var targetElement = this.data.targetElement;
        if (this.data.type == 'attribute') {
            //console.log("about to change attribute "+this.data.attribute+" to: "+this.data.value);
            targetElement.setAttribute(this.data.attribute, this.data.value);
        } else if (this.data.type == 'function') {
            console.log("targetElement: "+targetElement+", components: "+ this.data.targetComponent);
            if (this.data.targetComponent == ""){
              targetElement[this.data.function]();
            }else{
              var targetComponent = targetElement.components[this.data.targetComponent];
              targetComponent[this.data.function]();
            }
        }
    },
    onKeyup: function (evt) {
        if (evt.keyCode == this.data.keyCode) {
            //console.log("in speech command keyup for: "+this.data.command);
            this.executeCommand();
        }
    }
});
AFRAME.registerComponent('annyang-speech-recognition', {
    init: function () {
        //console.log("in annyang-speech-recognition init");
    },
    play: function() {
        if (annyang) {
            //console.log("annyang: "+annyang);
            console.log("annyang.addCommands: "+annyang.addCommands);
            var speechCommandSystem = document.querySelector('a-scene').systems['speech-command'];
            var commands = {};
            var commandsMap = {};
            for (var i = 0; i < speechCommandSystem.entities.length; i++) {
                var speechCommand = speechCommandSystem.entities[i];
                commandsMap[speechCommand.data.command] = speechCommand;
                // note: function empty here because real work is done in the resultMatch callback below
                commands[speechCommand.data.command] = function() { };
            }
            annyang.addCommands(commands);

            annyang.addCallback('resultMatch', function(userSaid, commandText, phrases) {
                //console.log("commandText: "+commandText); // sample output: 'hello (there)'
                var speechCommand = commandsMap[commandText];
                speechCommand.executeCommand();
                annyang.pause();
            });

            // Start listening. You can call this here, or attach this call to an event, button, etc.
            annyang.pause();
        }
    }

});
