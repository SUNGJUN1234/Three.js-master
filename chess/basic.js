import * as THREE from '../build/three.module.js';
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from '../examples/jsm/loaders/GLTFLoader.js';

class App {
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.outputEncoding = THREE.sRGBEncoding;
        divContainer.appendChild(renderer.domElement);

        this._renderer = renderer;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0.7, 0.7, 0.7);
        this._scene = scene;

        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();
        this._setupEvents();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
    }

    _setupEvents() {
        this._raycaster = new THREE.Raycaster();
        this._raycaster._clickedPosition = new THREE.Vector2();
        this._raycaster._selectedMesh = null;

        window.addEventListener("click", (event) => {
            this._raycaster._clickedPosition.x = (event.clientX / window.innerWidth) * 2 - 1;
            this._raycaster._clickedPosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            this._raycaster.setFromCamera(this._raycaster._clickedPosition, this._camera);
            const found = this._raycaster.intersectObjects(this._scene.children);

            if(found.length > 0) {
                const clickedObj = found[0].object;
                if(clickedObj.parent.name !== "Board") { // 보드가 아닌 말을 클릭했을 경우
                    const oldSelectedMesh = this._raycaster._selectedMesh;

                    this._raycaster._selectedMesh = clickedObj;

                    if(oldSelectedMesh !== this._raycaster._selectedMesh) {
                        gsap.to(this._raycaster._selectedMesh.position, { y: 4, duration: 1 });
                        gsap.to(this._raycaster._selectedMesh.rotation, { y: Math.PI*2, duration: 1 });
                    } else {
                        this._raycaster._selectedMesh = null;
                    }                    

                    if(oldSelectedMesh) {
                        gsap.to(oldSelectedMesh.position, { y: 0.3, duration: 1 });
                        gsap.to(oldSelectedMesh.rotation, { y: -Math.PI*2, duration: 1 });
                    }
                } else { // 보드를 클릭했을 경우
                    if(this._raycaster._selectedMesh) {
                        const timelineT = gsap.timeline();

                        timelineT.to(this._raycaster._selectedMesh.position, { 
                            x: found[0].point.x, 
                            z: found[0].point.z,
                            duration: 1,
                        });

                        timelineT.to(this._raycaster._selectedMesh.position, { 
                            y: 0.3, 
                            duration: 1,
                        });

                        const timelineR = gsap.timeline();

                        timelineR.to(this._raycaster._selectedMesh.rotation, { 
                            y: -Math.PI*2, 
                            duration: 2,
                        });

                        this._raycaster._selectedMesh = null;
                    }
                }
            } else {
                this._selectedMesh = null;
            }
        });
    }

    _setupControls() {
        const control = new OrbitControls(this._camera, this._divContainer);
        control.enableDamping = true;
        this._control = control;
    }

    _setupModel() {
        new GLTFLoader().load("./data/chess.glb", (gltf) => {
            const models = gltf.scene;
            this._modelRepository = models;

            this._createBoard();
            this._createHorses();
        })
    }

    _createBoard() {
        const mesh = this._modelRepository.getObjectByName("Board");
        const pos = { x: 0, y: 0, z: 0 };
        const quat = { x: 0, y: 0, z: 0, w: 1 };
        
        mesh.traverse(child => {
            child.receiveShadow = true;
        });

        mesh.position.set(pos.x, pos.y, pos.z);
        mesh.quaternion.set(quat.x, quat.y, quat.z, quat.w);

        this._scene.add(mesh);
    }

    _createHorses() {
        this._createHorse({row: 1, col: 0}, "White-Pawn", "White-Pawn-0");
        this._createHorse({row: 1, col: 1}, "White-Pawn", "White-Pawn-1");
        this._createHorse({row: 1, col: 2}, "White-Pawn", "White-Pawn-2");
        this._createHorse({row: 1, col: 3}, "White-Pawn", "White-Pawn-3");
        this._createHorse({row: 1, col: 4}, "White-Pawn", "White-Pawn-4");
        this._createHorse({row: 1, col: 5}, "White-Pawn", "White-Pawn-5");
        this._createHorse({row: 1, col: 6}, "White-Pawn", "White-Pawn-6");
        this._createHorse({row: 1, col: 7}, "White-Pawn", "White-Pawn-7");
        
        this._createHorse({row: 0, col: 0}, "White-Rock", "White-Rock-0");
        this._createHorse({row: 0, col: 1}, "White-Knight", "White-Knight-0");
        this._createHorse({row: 0, col: 2}, "White-Bishop", "White-Bishop-0");
        this._createHorse({row: 0, col: 3}, "White-Queen", "White-Queen");
        this._createHorse({row: 0, col: 4}, "White-King", "White-King");
        this._createHorse({row: 0, col: 5}, "White-Bishop", "White-Bishop-1");
        this._createHorse({row: 0, col: 6}, "White-Knight", "White-Knight-1");
        this._createHorse({row: 0, col: 7}, "White-Rock", "White-Rock-1");

        this._createHorse({row: 6, col: 0}, "Black-Pawn", "Black-Pawn-0");
        this._createHorse({row: 6, col: 1}, "Black-Pawn", "Black-Pawn-1");
        this._createHorse({row: 6, col: 2}, "Black-Pawn", "Black-Pawn-2");
        this._createHorse({row: 6, col: 3}, "Black-Pawn", "Black-Pawn-3");
        this._createHorse({row: 6, col: 4}, "Black-Pawn", "Black-Pawn-4");
        this._createHorse({row: 6, col: 5}, "Black-Pawn", "Black-Pawn-5");
        this._createHorse({row: 6, col: 6}, "Black-Pawn", "Black-Pawn-6");
        this._createHorse({row: 6, col: 7}, "Black-Pawn", "Black-Pawn-7");
        
        this._createHorse({row: 7, col: 0}, "Black-Rock", "Black-Rock-0");
        this._createHorse({row: 7, col: 1}, "Black-Knight", "Black-Knight-0");
        this._createHorse({row: 7, col: 2}, "Black-Bishop", "Black-Bishop-0");
        this._createHorse({row: 7, col: 3}, "Black-Queen", "Black-Queen");
        this._createHorse({row: 7, col: 4}, "Black-King", "Black-King");
        this._createHorse({row: 7, col: 5}, "Black-Bishop", "Black-Bishop-1");
        this._createHorse({row: 7, col: 6}, "Black-Knight", "Black-Knight-1");
        this._createHorse({row: 7, col: 7}, "Black-Rock", "Black-Rock-1");        
    }

    _createHorse(boardPos, name, meshName) {
        const mesh = this._modelRepository.getObjectByName(name).clone();
        mesh.name = meshName;

        mesh.traverse(child => {
            child.castShadow = true;
            child.receiveShadow = true;
        });

        const posRC = this._getBoardPosition(boardPos.row, boardPos.col);
        const pos = { x: posRC.x, y: 0.3, z: posRC.y };
        const quat = { x: 0, y: 0, z: 0, w: 1 };

        mesh.position.set(pos.x, pos.y, pos.z);
        mesh.quaternion.set(quat.x, quat.y, quat.z, quat.z);

        this._scene.add(mesh);        
    }

    _getBoardPosition(row, col) {
        const board = this._scene.getObjectByName("Board");
        const box = new THREE.Box3().setFromObject(board);
        const size = box.max.x - box.min.x; // same as 'box.max.z - box.min.z'
        const cellWidth = size / 8;

        return { 
            x: col*cellWidth + cellWidth/2 - size/2, 
            y: row*cellWidth + cellWidth/2 - size/2
        };
    }

    _setupCamera() {
        const camera = new THREE.PerspectiveCamera(
            40,
            window.innerWidth / window.innerHeight, 
            1, 
            100
        );

        camera.position.z = 50;
        this._camera = camera;
    }

    _setupLight() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        this._scene.add(ambientLight);

        this._createPointLight({x:10, y:30, z:10});
        this._createPointLight({x:-10, y:30, z:-10});
        this._createPointLight({x:-10, y:30, z:10});
        this._createPointLight({x:10, y:30, z:-10});

        const shadowLight = new THREE.DirectionalLight(0xffffff, 0.8);
        shadowLight.position.set(0, 10, 0);
        shadowLight.target.position.set(0, 0, 0);

        this._scene.add(shadowLight);
        this._scene.add(shadowLight.target);

        shadowLight.castShadow = true;

        shadowLight.shadow.mapSize.width = 1024 * 2;
        shadowLight.shadow.mapSize.height = 1024 * 2;

        let d = 11;
        shadowLight.shadow.camera.left = -d;
        shadowLight.shadow.camera.right = d;
        shadowLight.shadow.camera.top = d;
        shadowLight.shadow.camera.bottom = -d;

        shadowLight.shadow.camera.near = 3;
        shadowLight.shadow.camera.far = 12;

        //shadowLight.shadow.bias = 0.01;

        // const lightHelper = new THREE.CameraHelper(shadowLight.shadow.camera);
        // this._scene.add(lightHelper);        
    }

    _createPointLight(pos) {
        const light = new THREE.PointLight(0xffffff, 0.4);
        light.position.set(pos.x, pos.y, pos.z);
        this._scene.add(light);
    }

    update(time) {
        time *= 0.001; // second unit
        this._control.update();
    }

    render(time) {
        this._renderer.render(this._scene, this._camera);   
        this.update(time);

        requestAnimationFrame(this.render.bind(this));
    }

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
        
        this._renderer.setSize(width, height);
    }
}

window.onload = function () {
    new App();
}