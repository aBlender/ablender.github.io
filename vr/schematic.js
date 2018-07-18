AFRAME.registerComponent('dojo-schematic', {
  init: function(){
    fetch('http://mod.learntomod.com/schematics/aBlender-dojo.json').then(function(response){
      return response.json();
    }).then(function(j){
        for(var i in j){
          var thing = j[i];
          var x = thing.x;
          var y = thing.y;
          var z = thing.z;
          console.log("XYZ: " + x + " " + y + " " + z )

          var voxel = document.createElement("a-box");
          var dojoEl = document.querySelector("#dojo");
          var name = thing.name;
          //voxel.setAttribute("color", getColorFromName(name));
          voxel.setAttribute("material", "src", getTextureIdFromName(name)); //disabled to improve performance on mobile
          voxel.setAttribute("material", "shader", "flat");
          voxel.setAttribute("position", x + " " + y + " " + z);
          dojoEl.appendChild(voxel);
        }
    });
  }
});

function getColorFromName(name){
  var color;
  switch(name){
    case "wood:5":
      color = "#3D2912";
      break;
    case "wood":
      color = "#AB7E43";
      break;
    case "sandstone":
      color = "#B59A68";
      break;
    case "glowstone":
      color = "#C6B049";
      break;
    case "cobblestone":
      color = "#877C7C";
      break;
    default:
      color = "white";
  }
  return color;
}

function getTextureIdFromName(name){
  var textureId;
  switch(name){
    case "wood:5":
      textureId = "#spruce";
      break;
    case "wood":
      textureId = "#oak";
      break;
    case "sandstone":
      textureId = "#sandstone";
      break;
    case "glowstone":
      textureId = "#glowstone";
      break;
    case "cobblestone":
      textureId = "#cobblestone";
      break;
    default:
      textureId = "#cobblestone";
  }
  return textureId;
}
