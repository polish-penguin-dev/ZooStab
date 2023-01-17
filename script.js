async function initXR() {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  
  const gl = canvas.getContext("webgl", {xrCompatible: true});

  const scene = new THREE.Scene();
  const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({color: 0xff0000});
  
  const cube = new THREE.mesh(boxGeometry, material);
  scene.add(cube);

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  preserveDrawingBuffer: true,
  canvas: canvas,
  context: gl
});
renderer.autoClear = false;

const camera = new THREE.PerspectiveCamera();
camera.matrixAutoUpdate = false;

const session = await navigator.xr.requestSession("immersive-ar");
  
session.updateRenderState({
  baseLayer: new XRWebGLLayer(session, gl)
});

const referenceSpace = await session.requestReferenceSpace("local");

const onXRFrame = (time, frame) => {
  
  session.requestAnimationFrame(onXRFrame);

  gl.bindFramebuffer(gl.FRAMEBUFFER, session.renderState.baseLayer.framebuffer)

  const pose = frame.getViewerPose(referenceSpace);
  if (pose) {
    const view = pose.views[0];

    const viewport = session.renderState.baseLayer.getViewport(view);
    renderer.setSize(viewport.width, viewport.height)

    camera.matrix.fromArray(view.transform.matrix)
    camera.projectionMatrix.fromArray(view.projectionMatrix);
    camera.updateMatrixWorld(true);

    renderer.render(scene, camera)
  }
}
  
session.requestAnimationFrame(onXRFrame);
}

async function browserCheck() {
  if (window.navigator.xr) {
    const isSupported = await window.navigator.xr.isSessionSupported("immersive-ar");
    if(isSupported) {
document.getElementById("ActivateXR").addEventListener("click", () => {
      initXR();
    });
    } else {
      document.location = "/pages/unsupportedDevice.html";
    } 
  } 
}

browserCheck();