import { ARButton } from "https://threejs.org/examples/jsm/webxr/ARButton.js";
import { GLTFLoader } from "https://threejs.org/examples/jsm/loaders/GLTFLoader.js";
import { WebGLRenderer, Scene, PerspectiveCamera, BoxBufferGeometry, MeshBasicMaterial, Mesh } from "https://threejs.org/build/three.module.js";

async function initXR() {
  const renderer = new WebGLRenderer({antialias:true, alpha:true});
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio);

  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);

  document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures:["hit-test"]}));

  createScene(renderer);
}

function createScene(renderer) {
  const scene = new Scene(renderer);
  const camera = new PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.02,
    20,
  );

  if(localStorage.getItem("visited") === null) {
    localStorage.setItem("visited", 1);
    document.getElementById("xr-overlay").style.display = "block";
  }
  
  const boxGeometry = new BoxBufferGeometry(1, 1, 1);
  const boxMaterial = new MeshBasicMaterial({ color: 0xff0000 });
  const box = new Mesh(boxGeometry, boxMaterial);
  box.position.z = -3;
  
  scene.add(box);

  function renderLoop(timestamp, frame) {
    box.rotation.y += 0.01;
    box.rotation.x += 0.01
    if(renderer.xr.isPresenting) {
      renderer.render(scene, camera);
    }
  }

  renderer.setAnimationLoop(renderLoop);
}

async function browserCheck() {
  if (window.navigator.xr) {
    const isSupported = await window.navigator.xr.isSessionSupported("immersive-ar");
    if(isSupported) {
    initXR();
    } else {
      document.location = "/pages/unsupportedDevice.html";
    } 
  } 
}

browserCheck();
