
/* https://codepen.io/jkantner/pen/zbNPMV */
/* https://codepen.io/filipz/pen/dPPyJZX */
/* https://codepen.io/filipz/pen/VYvKJQR */

/* import * as THREE from "https://esm.sh/three";
import { OrbitControls } from "https://esm.sh/three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "https://esm.sh/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://esm.sh/three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://esm.sh/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { FilmPass } from "https://esm.sh/three/examples/jsm/postprocessing/FilmPass.js";

const container = document.querySelector('.main_visual .visual_canvas');
let sizes = {
    width: container ? container.clientWidth : window.innerWidth,
    height: container ? container.clientHeight : window.innerHeight
};

const DITHER_MOTION_SPEED = 2.0;
const DITHER_MOTION_AMPLITUDE = 1.5;
const BLOB_BASE_RADIUS = 2.0;
const BLOB_NOISE_FREQUENCY_VERTEX = 0.75;
const BLOB_NOISE_AMPLITUDE_VERTEX = 0.65;
const BLOB_NOISE_SPEED_VERTEX = 0.08;
const PARTICLE_COUNT = 1200;
const STAR_COUNT = 3000;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.FogExp2(0x000000, 0.025);

const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000
);
// ★ 카메라 위치
camera.position.set(0, 0, 8);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance"
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.outputColorSpace = THREE.SRGBColorSpace;

// ★ body가 아니라 main_visual 안으로
container.appendChild(renderer.domElement);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// ★ sizes 기준으로 해상도 설정
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(sizes.width, sizes.height),
    0.45,
    0.55,
    0.75
);
composer.addPass(bloomPass);

const filmPass = new FilmPass(0.20, 0.15, 648, false);
composer.addPass(filmPass);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.04;
controls.rotateSpeed = 0.20;
controls.minDistance = 2.0;
controls.maxDistance = 12;
controls.enablePan = false;
controls.autoRotate = false;

// ... (중간 부분은 그대로, 별/블롭 셰이더들)

// ★ resize 부분
window.addEventListener('resize', () => {
    sizes.width = container.clientWidth;
    sizes.height = container.clientHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    composer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    bloomPass.resolution.set(sizes.width, sizes.height);
});

camera.lookAt(scene.position);

const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    blobMaterial.uniforms.uTime.value = elapsedTime;
    particleMaterial.uniforms.uTime.value = elapsedTime;
    starMaterial.uniforms.uTime.value = elapsedTime;

    morphingBlob.rotation.x += 0.0004;
    morphingBlob.rotation.y += 0.0007;

    pointLight1.position.x = Math.sin(elapsedTime * 0.32) * 6;
    pointLight1.position.z = Math.cos(elapsedTime * 0.32) * 6;
    pointLight2.position.y = Math.sin(elapsedTime * 0.18) * 4;
    pointLight2.position.x = Math.cos(elapsedTime * 0.25) * -5;
    pointLight3.position.z = Math.cos(elapsedTime * 0.40) * 5;
    pointLight3.position.y = Math.sin(elapsedTime * 0.35) * -4;

    controls.update();
    composer.render();
}

// ★ window.onload 없어도 됨 (스크립트가 body 끝에서 로드되니까)
animate(); */