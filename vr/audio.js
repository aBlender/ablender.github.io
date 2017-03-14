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
