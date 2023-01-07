import * as THREE from "../build/three.module.js";
// 법선벡터 시각화를 위한 import
import {VertexNormalsHelper}from "../examples/jsm/helpers/VertexNormalsHelper.js"
// 화면을 마우스로 돌리기위한 import
import {OrbitControls} from "../examples/jsm/controls/OrbitControls.js"

class App{
     constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;
        const renderer = new THREE.WebGLRenderer({antialias:true});
        
        renderer.setPixelRatio(window.devicePixelRatio);
        
        divContainer.appendChild(renderer.domElement);
        
        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;

        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();
        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
    }
    _setupControls(){
        new OrbitControls(this._camera,this._divContainer)
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
        const light = new THREE.DirectionalLight(color,intensity);
        light.position.set(-1, 2, 4);
        this._scene.add(light);
    }

    _setupModel(){
        // 사각형을 형성할 4개의 점 생성
        const rawPosition = [
            -1,-1,0,
            1,-1,0,
            -1,1,0,
            1,1,0
        ]

        // 법선 벡터에 대한 값
        const rawNormals = [
            // 위의 사각형에 수직이되는 값을 입력해줬다
            0,0,1,
            0,0,1,
            0,0,1,
            0,0,1
        ]

        // 각 정점에 대한 색상값을 입력하기 위한 값
        const rawColors = [
            1,0,0,
            0,1,0,
            0,0,1,
            1,1,0
        ]

        // 텍스쳐 매핑을 위한 uv 좌표 값
        const rawUVs=[
            0,0,
            1,0,
            0,1,
            1,1
        ]


        // 객체로 래핑
        const positions = new Float32Array(rawPosition);
        const normals = new Float32Array(rawNormals);
        const colors = new Float32Array(rawColors);
        const uvs = new Float32Array(rawUVs);

        // BufferGeometry객체 생성
        const geometry = new THREE.BufferGeometry();
        // geometry객체의 위치 설정
        // BufferAttribute( 정점 정의, 하나의 정점이 x,y,z 3개의 인자로 이루어져있다는 것을 의미)
        geometry.setAttribute("position",new THREE.BufferAttribute(positions,3))
        geometry.setAttribute("normal",new THREE.BufferAttribute(normals,3))
        geometry.setAttribute("color", new THREE.BufferAttribute(colors,3))
        geometry.setAttribute("uv",new THREE.BufferAttribute(uvs,2))
        // 3각형 면 정의 (VertexIndex) @@ 꼭 반시계 방향으로 정의할것
        geometry.setIndex([
            0,1,2,
            2,1,3
        ]);
        // 정점에 대한 법선 벡터 설정(해당 도형을 어떻게 비춰줄것인지)
        // geometry.computeVertexNormals();

        // 텍스쳐 매핑을 위해 필요한 값
        const textureLoader = new THREE.TextureLoader();
        const map = textureLoader.load("../examples/textures/uv_grid_opengl.jpg")

        // 재질 정의(각 vertex에 색상 지정해서 표시하기)
        const material = new THREE.MeshPhongMaterial({
            color:0xffffff,      // 도형 전체 색상
            vertexColors:true,   // vertex 좌표마다의 색상 적용
            map : map            // 텍스쳐 매핑 추가
        });
        // scene에 추가
        const box = new THREE.Mesh(geometry,material)
        this._scene.add(box);
        // 시각화 법선벡터 생성 및 추가
        const helper = new VertexNormalsHelper(box,0.1,0xffff00);
        this._scene.add(helper)
    }

    resize(){
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width,height);
    }
    render(time){
        this._renderer.render(this._scene, this._camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }
    update(time){
        time *= 0.001;  
 
    }

}

window.onload = function(){
    new App();
}




