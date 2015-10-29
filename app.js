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

var geometry = new THREE.SphereGeometry( 1000, 32, 32 );
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
  position: Argon.Cesium.Cartesian3.fromDegrees(11.500362, 55.613421) // MAH 55.608716, 12.992131
});

// Create a another Object3D linked to a Cesium Entity. This get's added to the scene for us.
var sphereGeoTarget = three.argon.objectFromEntity(sphereGeoEntity);
sphereGeoTarget.add(sphere);

/**
 * Each time our context is assigned a new Reality, including the first time, we
 * receive a "realityChange" event. We should do initialization that is based on
 * the state of the world here.
 *
 * A state parameter looks like this:
 * {
 *   reality: Argon.Reality,
 *   previousReality; Argon.Reality
 * }
 */

// This will tell us if we have a reality
var realityInit = false;

// Listen for reality changes
three.on('argon:realityChange', function(e) {
  realityInit = true;
});

/**
 * Argon's update state is stored in the threestrap update event in the
 * argonState property. In general, this is only needed for lower-level
 * information from Argon, such as the raw geolocation.
 *
 * An Argon state parameter looks like this:
 * {
 *   frameNumber: number (int),
 *   time: a Cesium time for the update,
 *   referenceFrame: Cesium.ReferenceFrame.FIXED or {id: frameID} // the root reference
 *   position: {
 *     cartesian: Cesium.Cartesian,
 *     cartographicDegrees: [longitude, latitude, height]
 *   },
 *   orientation: {
 *     unitQuaternion: Cesium.Quaternion, // Orientation in reference frame
 *     unitQuaternionRelative: Cesium.Quaternion, // Orientation relative to local origin
 *   },
 *   frustum: {
 *     fov: number,
 *     fovy: number,
 *     aspectRatio: number
 *   },
 *   reality: {
 *     id: realityID
 *   }
 * }
 */

// This will save the last info text that was rendered
var lastInfoText = '';

three.on('update', function(e) {
  var locationElem = document.getElementById('location');
  var state = e.argonState;
  var gpsCartographicDeg = [0, 0, 0];
  var sphereGeographicDeg = [0, 0, 0];
  var cameraPos;
  var spherePos;
  var distanceToSphere;
  var infoText;

  // Ignore update until we have a reality
  if (! realityInit) {
    locationElem.innerText = 'No reality yet';
    return;
  }

  // Get the Argon's cartographic degrees [longitude, latitude, height]
  if (state.position.cartographicDegrees) {
    gpsCartographicDeg = state.position.cartographicDegrees;
  }

  // Get Rotundans cartographic degrees as well
  if (three.argon.getCartographicDegreesFromEntity(sphereGeoEntity)) {
    sphereGeographicDeg = three.argon.getCartographicDegreesFromEntity(sphereGeoEntity)
  }

  // Calculate some information
  cameraPos = three.camera.getWorldPosition();
  spherePos = sphere.getWorldPosition();
  distanceToSphere = cameraPos.distanceTo(spherePos);

  // Ouput some information
  infoText = 'Operation Rotundan:\n';
  // infoText += 'frame: ' + state.frameNumber + '\n';
  // infoText += 'argon time: (' + three.argon.time.secondsOfDay + ')\n';
  // infoText += 'three time: (' + three.Time.now + ')\n';
  infoText += 'camera (' + cameraPos[0] + ', ' + cameraPos[1] + ', ' + cameraPos[2] + '\n';
  infoText += 'eye (' + gpsCartographicDeg[0] + ', ' + gpsCartographicDeg[1] + ', ' + gpsCartographicDeg[2] + '\n';
  infoText += 'sphere (' + sphereGeographicDeg[0] + ', ' + sphereGeographicDeg[1] + ', ' + sphereGeographicDeg[2] + '\n';
  infoText += 'distance to rotundan (' + distanceToSphere + ')';

  // Don't rerender the same information
  if (lastInfoText !== infoText) {
    locationElem.innerText = infoText;
    lastInfoText = infoText;
  }
});
