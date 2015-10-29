// Retrieve the immersive context
var context = Argon.immersiveContext;

// Initialize Three.js rendering
var options = THREE.Bootstrap.createArgonOptions(context);
var three = THREE.Bootstrap(options);

/**
 * All geospatial objects need to have an Object3D linked to a Cesium Entity. We
 * need to do this because Argon needs a mapping between Entities and Object3Ds.
 *
 * There are two ways to do this:
 * 1. Place an object using a known LLA.
 * 2. Place an object near the starting location.
 */

// Create a new Object3D
var twitter = new THREE.Object3D;

var geometry = new THREE.SphereGeometry( 500, 32, 32 );
var material = new THREE.MeshBasicMaterial( {color: 0x55acee} ); // Twitter blue
var sphere = new THREE.Mesh( geometry, material );

// Add a texture to the Object3D
// var twitterTextureLoader = new THREE.TextureLoader();
// twitterTextureLoader.load('images/tear.jpg', function (texture) {
//   var geometry = new THREE.BoxGeometry(10, 10, 10);
//   var material = new THREE.MeshBasicMaterial({ map: texture });
//   var mesh = new THREE.Mesh(geometry, material);
//   mesh.scale.set(10, 10, 10);
//   tear.add(mesh);
// });

// Create a new Cesium Entity for Turning Torso
var sphereGeoEntity = new Argon.Cesium.Entity({
  name: 'Turning Torso',
  // position: Argon.Cesium.Cartesian3.fromDegrees(13.053773, 55.587422)
  position: Argon.Cesium.Cartesian3.fromDegrees(11.800362, 55.613421) // MAH 55.608716, 12.992131
});

// Create a another Object3D linked to a Cesium Entity. This get's added to the scene for us.
var sphereGeoTarget = three.argon.objectFromEntity(sphereGeoEntity);
sphereGeoTarget.add(sphere);
