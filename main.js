import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/DRACOLoader.js';

const pCanvas = document.getElementById('particles');
const pCtx = pCanvas.getContext('2d');

function resizeParticles() {
  pCanvas.width  = window.innerWidth;
  pCanvas.height = window.innerHeight;
}
resizeParticles();
window.addEventListener('resize', resizeParticles);

const particles = Array.from({ length: 90 }, () => ({
  x:  Math.random() * window.innerWidth,
  y:  Math.random() * window.innerHeight,
  r:  Math.random() * 1.2 + 0.2,
  dx: (Math.random() - 0.5) * 0.3,
  dy: (Math.random() - 0.5) * 0.3,
  a:  Math.random() * 0.6 + 0.1,
}));

function drawParticles() {
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  for (const p of particles) {
    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    pCtx.fillStyle   = `rgba(0,170,255,${p.a})`;
    pCtx.shadowBlur  = 6;
    pCtx.shadowColor = '#0af';
    pCtx.fill();
    p.x += p.dx; p.y += p.dy;
    if (p.x < 0)              p.x = pCanvas.width;
    if (p.x > pCanvas.width)  p.x = 0;
    if (p.y < 0)              p.y = pCanvas.height;
    if (p.y > pCanvas.height) p.y = 0;
  }
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 120) {
        pCtx.beginPath();
        pCtx.moveTo(particles[i].x, particles[i].y);
        pCtx.lineTo(particles[j].x, particles[j].y);
        pCtx.strokeStyle = `rgba(0,170,255,${0.12 * (1 - d / 120)})`;
        pCtx.lineWidth   = 0.5;
        pCtx.shadowBlur  = 0;
        pCtx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

const container = document.getElementById('three-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x03080f);
scene.fog = new THREE.FogExp2(0x03080f, 0.035);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.set(0, 1.5, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping  = true;
orbitControls.dampingFactor  = 0.07;
orbitControls.minDistance    = 0.1;
orbitControls.maxDistance    = 200;

scene.add(new THREE.AmbientLight(0xffffff, 1.5));
const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
dirLight1.position.set(5, 10, 7);
scene.add(dirLight1);
const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight2.position.set(-5, 5, -7);
scene.add(dirLight2);

const gridHelper = new THREE.GridHelper(30, 30, 0x002244, 0x001122);
gridHelper.position.y = -0.01;
scene.add(gridHelper);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://unpkg.com/three@0.160.0/examples/jsm/libs/draco/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

let currentModel = null;
let autoRotate   = true;

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  if (currentModel && autoRotate) {
    currentModel.rotation.y += 0.005;
  }
  orbitControls.update();
  renderer.render(scene, camera);
}
animate();

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function loadModel(file) {
  const loaderEl   = document.getElementById('loader');
  const loaderText = document.getElementById('loader-text');
  loaderEl.classList.add('active');
  loaderText.textContent = `ЗАРЕЖДАНЕ: ${file.name.toUpperCase()}`;
  document.getElementById('drop-overlay').classList.add('hidden');
  const url = URL.createObjectURL(file);

  gltfLoader.load(
    url,
    (gltf) => {
      if (currentModel) {
        scene.remove(currentModel);
        currentModel.traverse(child => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach(m => m.dispose());
          }
        });
      }
      currentModel = gltf.scene;
      const box    = new THREE.Box3().setFromObject(currentModel);
      const size   = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale  = 3 / maxDim;
      currentModel.scale.setScalar(scale);
      currentModel.position.sub(center.multiplyScalar(scale));
      const box2 = new THREE.Box3().setFromObject(currentModel);
      currentModel.position.y -= box2.min.y;
      scene.add(currentModel);
      camera.position.set(0, size.y * scale * 0.8, maxDim * scale * 1.8);
      orbitControls.target.set(0, size.y * scale * 0.4, 0);
      orbitControls.update();
      
      document.getElementById('controls').classList.add('visible');
      document.getElementById('status-bar').textContent   = 'GLB_VIEWER // MODEL_LOADED // ROTATE: ON';
      loaderEl.classList.remove('active');
      URL.revokeObjectURL(url);
      showToast('✓  МОДЕЛЪТ Е ЗАРЕДЕН УСПЕШНО');
    },
    (xhr) => {
      if (xhr.total) {
        const pct = Math.round((xhr.loaded / xhr.total) * 100);
        loaderText.textContent = `ЗАРЕЖДАНЕ... ${pct}%`;
      }
    },
    (error) => {
      console.error(error);
      loaderEl.classList.remove('active');
      document.getElementById('drop-overlay').classList.remove('hidden');
      showToast('✗  ГРЕШКА ПРИ ЗАРЕЖДАНЕ НА ФАЙЛА');
    }
  );
}

const dropZone  = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const browseBtn = document.getElementById('browse-btn');

browseBtn.addEventListener('click', e => { e.stopPropagation(); fileInput.click(); });
dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', e => {
  if (e.target.files[0]) loadModel(e.target.files[0]);
});
dropZone.addEventListener('dragover', e => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && (file.name.endsWith('.glb') || file.name.endsWith('.gltf'))) {
    loadModel(file);
  } else {
    showToast('✗  САМО .GLB / .GLTF ФАЙЛОВЕ СА ПОЗВОЛЕНИ');
  }
});
document.addEventListener('dragover', e => e.preventDefault());
document.addEventListener('drop', e => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file && (file.name.endsWith('.glb') || file.name.endsWith('.gltf'))) {
    loadModel(file);
  }
});

document.getElementById('reset-btn').addEventListener('click', () => {
  if (!currentModel) return;
  currentModel.rotation.set(0, 0, 0);
  camera.position.set(0, 1.5, 4);
  orbitControls.target.set(0, 0.5, 0);
  orbitControls.update();
  showToast('⟳  КАМЕРАТА Е НУЛИРАНА');
});

const rotateBtn = document.getElementById('rotate-btn');
rotateBtn.addEventListener('click', () => {
  autoRotate = !autoRotate;
  rotateBtn.classList.toggle('active', autoRotate);
  rotateBtn.textContent = autoRotate ? '⟁   АВТО-РОТАЦИЯ' : '⟁   РОТАЦИЯ: ИЗКЛ';
  document.getElementById('status-bar').textContent = `GLB_VIEWER // MODEL_LOADED // ROTATE: ${autoRotate ? 'ON' : 'OFF'}`;
});