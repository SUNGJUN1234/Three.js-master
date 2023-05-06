import * as THREE from '../build/three.module.js';
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js"
import {FBXLoader} from "../examples/jsm/loaders/FBXLoader.js"


class App{
  
    constructor() {
      
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0xffa500); // 배경색 설정
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;
        
        this._setupCamera();
        this._setupAudio();
        this._setupLight();
        this._setupModel();
        this._setupControls();
        this._clock = new THREE.Clock();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));

    }

    _setupAudio() {
        const listener = new THREE.AudioListener();
        this._camera.add(listener); // 카메라에 추가합니다.
    
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('data/beat.mp3', (buffer) => {
          const audio = new THREE.Audio(listener);
          audio.setBuffer(buffer);
          audio.setLoop(true); // 반복 재생 설정
          audio.setVolume(0.5); // 볼륨 설정
          audio.play(); // 재생 시작
        });
      }

      _setupControls(){
        this._controls = new OrbitControls(this._camera, this._renderer.domElement);
    }
    _setupCamera(){
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            100
        );
        camera.position.z = 2;
        this._camera = camera;
    }
    _setupLight(){
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        
        // 네 개의 위치를 배열로 정의합니다.
        const positions = [
          new THREE.Vector3(-1, 2, 4),
          new THREE.Vector3(1, 2, 4),
          new THREE.Vector3(-1, 2, -4),
          new THREE.Vector3(1, 2, -4),
        ];
        
        // 네 개의 위치에 각각 Object3D를 생성하여 light를 추가합니다.
        positions.forEach((position) => {
          const obj = new THREE.Object3D();
          obj.position.copy(position);
          obj.add(light.clone());
          this._scene.add(obj);
        });
    }

    _zoomFit(object3D, camera, viewMode, bFront){
        const box = new THREE.Box3().setFromObject(object3D);
        const sizeBox = box.getSize(new THREE.Vector3()).length();
        const centerBox = box.getCenter(new THREE.Vector3());

        let offsetX = 0, offsetY = 0, offsetZ = 0;
        viewMode ==="X" ? offsetX = 1 : (viewMode === "Y")?
            offsetY = 1 : offsetZ = 1;

        if(!bFront){
            offsetX*=-1;
            offsetY*=-1;
            offsetZ*=-1;
        }
        camera.position.set(
            centerBox.x + offsetX, centerBox.y + offsetY, centerBox.z + offsetZ);
            
        const halfSizeModel = sizeBox * 0.5;
        const halfFov = THREE.MathUtils.degToRad(camera.fov * 0.5);
        const distance = halfSizeModel / Math.tan(halfFov);
        const direction = (new THREE.Vector3()).subVectors(
            camera.position, centerBox).normalize();
        const position = direction.multiplyScalar(distance).add(centerBox);

        camera.position.copy(position);
        camera.near = sizeBox / 100;
        camera.far = sizeBox * 100;

        camera.updateProjectionMatrix();

        camera.lookAt(centerBox.x, centerBox.y, centerBox.z);

        // 카메라의 위치를 발 끝이 아닌 몸의 중심으로 할 수 있도록 만드는 코드
        this._controls.target.set(centerBox.x, centerBox.y, centerBox.z);
    
    }


    _setupModel(){
       const loader = new FBXLoader();
       loader.load('data/dancing.fbx', object => {
        object.traverse(node => {
          if (node.isMesh) {
            node.geometry.computeBoundingBox(); // 메시의 크기에 맞게 Box3 객체의 크기 조정
          }
        });
      
        this._mixer = new THREE.AnimationMixer(object);
        const action = this._mixer.clipAction(object.animations[0]);
        action.play();
      
        this._scene.add(object);
              
        this._zoomFit(object, this._camera, "Z", true);
      
        this._clock = new THREE.Clock();
      
        this._cleanUp = () => {
          this._mixer.stopAllAction();
          this._mixer.uncacheRoot(object);
        };
      });

  
    }

    resize(){
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        if (this._cleanUp) {
            this._cleanUp();
            this._cleanUp = null;
        }

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width,height);
    }
 
    render(time){
        this._renderer.render(this._scene, this._camera);
        this.update(time);
    
        setTimeout(() => {
            this.render();
        }, 16);
    }
    
    update(time){
        time *= 0.001;

        // 애니메이션이 경과된 시간을 설정해주는 장치
        const delta = this._clock.getDelta();
        if(this._mixer) this._mixer.update(delta);
    }

}

window.onload = function(){
    new App();
}




