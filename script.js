// ========== Three.js 主场景 ==========
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 灯光系统
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffe6b3, 3, 50);
pointLight.position.set(5, 10, 15);
scene.add(pointLight);

// 加载青铜鼎模型
let artifact;
const loader = new THREE.GLTFLoader();
loader.load('models/artifact.glb', (gltf) => {
    artifact = gltf.scene;

    
    artifact.scale.set(0.03, 0.03, 0.03);
    artifact.rotation.set(0, Math.PI/4, 0); // 初始旋转角度

    artifact.position.y = -2;
    
    // 材质增强
    artifact.traverse(child => {
        if (child.isMesh) {
            child.material.metalness = 0.8;
            child.material.roughness = 0.2;
            child.material.envMapIntensity = 2;
        }
    });
    
    scene.add(artifact);
    camera.lookAt(scene.position);
});

camera.position.z = 15;

// 鼠标交互
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / innerWidth) * 2 - 1;
    mouseY = -(e.clientY / innerHeight) * 2 + 1;
});

// 滚轮缩放
document.addEventListener('wheel', (e) => {
    camera.position.z = THREE.MathUtils.clamp(
        camera.position.z + (e.deltaY > 0 ? 1 : -1) * 2,
        8, 30
    );
});

// ========== 鼠标粒子效果 ==========
const particleCanvas = document.querySelector('.particles');
const ctx = particleCanvas.getContext('2d');
particleCanvas.width = window.innerWidth;
particleCanvas.height = window.innerHeight;

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.alpha = 1;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.03;
    }
    
    draw() {
        ctx.fillStyle = `rgba(192, 168, 110, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

let particles = [];
document.addEventListener('mousemove', (e) => {
    for (let i = 0; i < 3; i++) {
        particles.push(new Particle(e.clientX, e.clientY));
    }
});

function handleParticles() {
    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
}

// ========== 动画循环 ==========
function animate() {
    requestAnimationFrame(animate);
    
    // 模型旋转
    if (artifact) {
        artifact.rotation.y += (mouseX * Math.PI/2 - artifact.rotation.y) * 0.1;
        artifact.rotation.x += (mouseY * Math.PI/2 - artifact.rotation.x) * 0.1;
    }
    
    // 渲染
    renderer.render(scene, camera);
    handleParticles();
}

animate();

// 窗口自适应
window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    particleCanvas.width = innerWidth;
    particleCanvas.height = innerHeight;
});


const characters = ['鼎', '尊', '爵', '卣', '簋', '觥', '罍', '瓿', '斝', '盉'];
const floatingContainer = document.querySelector('.floating-container');

function createFloatingText() {
    const text = document.createElement('div');
    text.className = 'float-text';
    text.textContent = characters[Math.floor(Math.random() * characters.length)];
    text.style.left = `${Math.random() * 100}%`;
    text.style.animationDuration = `${5 + Math.random() * 5}s`;
    text.style.animationDelay = `${Math.random() * 2}s`;
    text.style.fontSize = `${20 + Math.random() * 15}px`;
    floatingContainer.appendChild(text);
    
    text.addEventListener('animationend', () => {
        text.remove();
    });
}

setInterval(createFloatingText, 500);
for (let i = 0; i < 10; i++) createFloatingText();
