AFRAME.registerComponent('magic-chest', {
  init: function(){
    this.el.addEventListener('mouseenter', function(){
      var parent = this.parentElement;
      parent.setAttribute("intensity", "0.8");
    });
  }
});
