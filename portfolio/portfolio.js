import * as THREE from '../build/three.module.js';
import {FBXLoader} from "../examples/jsm/loaders/FBXLoader.js"

let scene_num = 0;
let first_camera_position;
let move_camera_position;
let wheelEnabled = true;
class App{
  
    constructor() {
  


        const divContainer = document.querySelector("#webgl_container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0xffa500); // 배경색 설정
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;

        const scene = new THREE.Scene();

        this._scene = scene;
        
        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupEventListeners();
        this._clock = new THREE.Clock();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));

    }
    _setupEventListeners() {
        // 마우스 스크롤 이벤트 리스너 추가
        window.addEventListener('wheel', this._handleMouseScroll.bind(this));
    }
    _handleMouseScroll(event) {
        if (!wheelEnabled) {
            return;
          }
          wheelEnabled = false;
          setTimeout(() => {
            wheelEnabled = true;
          }, 1800);

        const deltaY = event.deltaY; // 스크롤 이동 값

        if (deltaY > 0) {
          if (scene_num < 4) {
            ++scene_num;
          }
        } else {
          if (scene_num > 0) {
            --scene_num;
          }
        }
      
        console.log(scene_num)
      
        if (scene_num == 0) {
          move_camera_position = { x: 0, y: 88, z: 170 };
        } else if (scene_num == 1) {
          move_camera_position = { x: 0, y: 150, z: 50 };
        }else if (scene_num == 2) {
            move_camera_position = { x: 0, y: 10, z: 50 };
        }else if (scene_num == 3) {
            move_camera_position = { x: 0, y: 88, z: 800 };
        }else if (scene_num == 4) {
            move_camera_position = { x: 0, y: 70, z: 50 };
        }
      
        let duration = 1700; // 애니메이션 지속 시간 (밀리초)
        const startTime = performance.now(); // 시작 시간

        // 애니메이션 프레임 함수
        const animateCamera = (currentTime) => {
          const elapsedTime = currentTime - startTime; // 경과 시간
          let progress = Math.min(elapsedTime / duration, 1); // 진행률 (0~1)
      
          // 현재 위치에서 목표 위치까지 일정한 간격으로 이동
          this._camera.position.copy(
            first_camera_position.clone().lerp(move_camera_position, progress/10)
          );
      
          // 애니메이션 종료 조건
          if (progress < 1) {
            requestAnimationFrame(animateCamera);
          } else {
            // 애니메이션이 끝나면 first_camera_position을 갱신
            first_camera_position.copy(move_camera_position);
          }
        };
      
        // 애니메이션 시작
        requestAnimationFrame(animateCamera);
      
        // 카메라의 바라보는 방향을 설정하거나 변경해야 한다면 아래 코드 사용
        // this._camera.lookAt(targetX, targetY, targetZ);
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

        first_camera_position = this._camera.position;
            console.log(first_camera_position)
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




