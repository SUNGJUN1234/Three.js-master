import * as THREE from '../build/three.module.js';
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js"
import {GLTFLoader} from "../examples/jsm/loaders/GLTFLoader.js"


class App {
    constructor() {
        this._setupThreeJs();
        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();
        this._setupEvents();        
    }

    _setupThreeJs() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;

        const scene = new THREE.Scene();

        // 배경 색상 설정
        scene.background = new THREE.Color(0.7,0.7,0.7)
        this._scene = scene;
    }

    _setupCamera() {
        const camera = new THREE.PerspectiveCamera(
            40, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            100
        );

        camera.position.z = 50;
        this._camera = camera;
    }

    _setupLight() {
        // 주변광 추가
        const ambientLight  = new THREE.AmbientLight(0xffffff,0.1);
        this._scene.add(ambientLight);
        // 4개의 포인트 빛을 만들어서 추가해주자
        this._createPointLight({x: 10, y:30,z:10})
        this._createPointLight({x: -10, y:30,z:-10})
        this._createPointLight({x: -10, y:30,z:10})
        this._createPointLight({x: 10, y:30,z:-10})
    }
    // 포인트 빛 설정
    _createPointLight(pos){
        const light = new THREE.PointLight(0xffffff, 0.4);
        light.position.set(pos.x,pos.y,pos.z);
        this._scene.add(light)
    }

    _setupModel() {
        new GLTFLoader().load("./data/cardboard_box.glb",(gltf)=>{
            const models = gltf.scene;
            this._modelRepository = models;

            this._createBoard();
        })
    }
    _createBoard(){
        const mesh = this._modelRepository.getObjectByName("Sketchfab_model");
        mesh.position.set(0,0,0)
        this._scene.add(mesh)
    }

    _setupControls() {
        this._orbitControls = new OrbitControls(this._camera, this._divContainer);
    }

    _setupEvents() {
        window.onresize = this.resize.bind(this);
        this.resize();

        this._clock = new THREE.Clock();
        requestAnimationFrame(this.render.bind(this));
    }

    update() {
        const delta = this._clock.getDelta();
        this._orbitControls.update();
    }

    render() {
        this._renderer.render(this._scene, this._camera);   
        this.update();

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