import * as THREE from "../build/three.module.js";

// three.js의 구성

// 1. Renderer : Scene을 모니터에 렌더링(출력)할 수 있는 장치

// 1-1. Scene : 3차원 객체로 구성되는 장면

// 1-1-1. Light : 3차원 형상을 화면에 표시하기위한 광원
// 1-1-2. Mesh (Object3D) : Object3D의 파생 클래스

// 1-1-2-1. Geometry : 형상을 정의
// 1-1-2-2. Material : 색상 및 투명도 정의

// 1-2. Camera : Scene을 어떤 지점에서 볼지를 정하는 장치

class App{
    // 약속
    // 1. "_"이 앞에 붙은 메서드는 이 App클래스 내부에서만 사용되는 private라는 뜻
    constructor() {
        // html에서 3D를 띄워줄 div 선언하기
        const divContainer = document.querySelector("#webgl-container");
        // 다른 메서드에서 참조할 수 있도록 field로 정의
        this._divContainer = divContainer;

        // Renderer 생성 (antialias : 렌더링 시 물체의 경계선을 부드럽게 표시)
        const renderer = new THREE.WebGLRenderer({antialias:true});
        // pixel의 ratio값 설정
        renderer.setPixelRatio(window.devicePixelRatio);
        // renderer의 domElement를 id가 webgl-container인 div의 자식으로 추가
        divContainer.appendChild(renderer.domElement);
        // 다른 메서드에서 참조할 수 있도록 field로 정의
        this._renderer = renderer; // 이 renderer는 canvas타입의 dom 객체

        // scene객체 생성
        const scene = new THREE.Scene();
        // 다른 메서드에서 참조할 수 있도록 field로 정의
        this._scene = scene;

        // 메서드 호출 (아직 정의 X)
        this._setupCamera();
        this._setupLight();
        this._setupModel();

        // window.onresize : 창 크기 변경시 발동되는 장치
        // renderer와 camera는 창 크기가 변경될 때마다 그 크기에 맞게 속성값을 재설정 해줘야 하기 때문
        // bind : resize method안에서 this가 가르키는 객체가 이벤트 객체가 아닌 이 App
        //          클래스의 객체가 되도록하기 위해 사용
        window.onresize = this.resize.bind(this);
        this.resize();

        // render : 3차원 그래픽 장면을 만들어주는 메서드
        // render메서드를 requestAnimationFrame에 넘겨줌으로써 render메서드 호출
        // bind를 사용한 이유 : render메서드의 코드안에서 사용되는 this가 바로 이
        //                      app클래스의 객체를 가르키기 위해
        requestAnimationFrame(this.render.bind(this));
    }

    // 위에서 정의하지 않고 호출만 한 메서드 생성
    _setupCamera(){
        // three.js가 3차원 그래픽을 출력할 영역의 가로, 세로 크기를 가져오기
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        // 카메라 객체 생성
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            100
        );
        camera.position.z = 10;
        this._camera = camera;
    }
    _setupLight(){
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color,intensity);
        light.position.set(-1, 2, 4);
        this._scene.add(light);
    }
    // 태양계 생성
    _setupModel(){
        // 도화지 생성
        const solarSystem = new THREE.Object3D();
        this._scene.add(solarSystem);

        // 구 생성
        const radius = 1;           // 구의 반지름
        const widthSegments = 120;   // 구의 y축 분할
        const heightSegments = 120;  // 구의 x축 분할
        // 구geometry에 태양에 대한 정보 삽입
        const sphereGeometry = new THREE.SphereGeometry(radius,
            widthSegments, heightSegments);
        // 태양의 재질 생성
        const sunMaterial = new THREE.MeshPhongMaterial({
            emissive:0xffff00, flatShading:true});
            // 태양 생성
            const sunMesh = new THREE.Mesh(sphereGeometry,sunMaterial);
            // 태양의 크기는 기본 구 크기에 곱하기 3이다
            sunMesh.scale.set(3,3,3);
            // 도화지에 태양 생성
            solarSystem.add(sunMesh);

        const earthOrbit = new THREE.Object3D();
        solarSystem.add(earthOrbit);

        const earthMaterial = new THREE.MeshPhongMaterial({
            color : 0x2233ff, emissive: 0x112244, flatShading:true});
            const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
            earthOrbit.position.x = 7;
            earthOrbit.add(earthMesh);

        const moonOrbit = new THREE.Object3D();
        moonOrbit.position.x = 2;
        earthOrbit.add(moonOrbit);

        const moonMaterial = new THREE.MeshPhongMaterial({
            color:0x888888, emissive: 0x222222,flatShading:true});
            const moonMesh = new THREE.Mesh(sphereGeometry,moonMaterial);
            moonMesh.scale.set(0.5,0.5,0.5);
            moonOrbit.add(moonMesh)
        
            this._solarSystem = solarSystem
            this._earthOrbit = earthOrbit
    }

    // 창의 크기가 변경될때 발생하는 이벤트
    resize(){
        // 위에서 divContainer로 정의한(#webgl-container div) div의 크기 얻어오기
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width,height);
    }
    
    // time : 렌더링이 처음 시작된 이후 경과된 시간(ms 단위)
    // time은 requestAnimationFrame 함수가 render함수에 전달해준 값이다
    render(time){
        // 랜더링 시에 scene을 카메라의 시점으로 렌더링하도록 만드는 장치
        this._renderer.render(this._scene, this._camera);
        // 속성값을 변경시켜 애니메이션 효과를 만드는 장치
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }
    // render에서 전달받은 time을 사용하여 애니메이션 효과를 만드는 장치
    update(time){
        time *= 0.001;  // 알아보기 쉽게 ms단위를 초단위로 변경
        // this._cube.rotation.x = time;
        // this._cube.rotation.y = time;

        this._solarSystem.rotation.y = time/2;
        this._earthOrbit.rotation.y = time*2;
    }

}

window.onload = function(){
    new App();
}




