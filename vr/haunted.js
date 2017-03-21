AFRAME.registerComponent('light-fx', {
  init: function(){
    console.log("LightFX INIT");
    var self = this;
    var animation = this.animation = document.createElement("a-animation");
    animation.setAttribute("id","carlos-strobe");
    animation.setAttribute("attribute","intensity");
    animation.setAttribute("from", "0");
    animation.setAttribute("to", "0.5");
    animation.setAttribute("direction", "alternate");
    animation.setAttribute("dur", "100");
    animation.setAttribute("repeat", "19");
    this.el.addEventListener("animationstart", function(){
      var ambientLightEl = document.querySelector("#ambient-light");
      ambientLightEl.setAttribute("intensity", "0");
      var spotLightEl = document.querySelector("#carlos-light");
      spotLightEl.appendChild(self.animation);
    });
    this.el.addEventListener("animationend", function(){
      console.log("CARLOS LIGHT OFF");
      var ambientLightEl = document.querySelector("#ambient-light");
      ambientLightEl.setAttribute("intensity", "0.6");
      var spotLightEl = document.querySelector("#carlos-light");
      //var lfxComponent = document.querySelector("#carlos").components.lightfx;
      //var animation = lfxComponent.animation;
      spotLightEl.removeChild(self.animation);
      spotLightEl.setAttribute("intensity", "0.1");
    });
  }
});

AFRAME.registerComponent('boo-fx', {
  init: function(){
    //<a-animation attribute="rotation" to="0 660 0" direction="alternate" dur="4000" repeat="0" begin="mouseenter"></a-animation>
    //<a-animation attribute="position" to="2 -2 0" direction="alternate" dur="4000" repeat="0" begin="mouseenter"></a-animation>
    //<a-animation attribute="material.opacity" from="1" to="0.5" direction="alternate" dur="400" repeat="9" begin="mouseenter"></a-animation>
    var rotAnimation = document.createElement("a-animation");
    var posAnimation = document.createElement("a-animation");
    var matAnimation = document.createElement("a-animation");
    rotAnimation.setAttribute("attribute","rotation");
    rotAnimation.setAttribute("to", "0 660 0");
    rotAnimation.setAttribute("direction", "alternate");
    rotAnimation.setAttribute("dur", "4000");
    rotAnimation.setAttribute("begin", "mouseenter");
    posAnimation.setAttribute("attribute","position");
    posAnimation.setAttribute("to", "2 -2 0");
    posAnimation.setAttribute("direction", "alternate");
    posAnimation.setAttribute("dur", "4000");
    posAnimation.setAttribute("begin", "mouseenter");
    matAnimation.setAttribute("attribute","material.opacity");
    matAnimation.setAttribute("from", "1");
    matAnimation.setAttribute("to", "0.5");
    matAnimation.setAttribute("direction", "alternate");
    matAnimation.setAttribute("dur", "400");
    matAnimation.setAttribute("repeat", "9");
    matAnimation.setAttribute("begin", "mouseenter");
    this.el.appendChild(rotAnimation);
    this.el.appendChild(posAnimation);
    this.el.appendChild(matAnimation);
  }
});
