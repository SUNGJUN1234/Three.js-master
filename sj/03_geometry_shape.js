import * as THREE from '../build/three.module.js';
// 마우스를 이용해 Object를 회전시키기 위한 코드
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js"

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
        this._setupControls();

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
    _setupControls(){
        // OrbitControls : 마우스로 화면을 컨트롤하는 기능
        // OrbitControls객체 = 카메라 객체 + 마우스 이벤트를 받는 Dom요소
        new OrbitControls(this._camera, this._divContainer);
    }
    // 카메라
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
        camera.position.z = 15;      // 카메라의 위치
        this._camera = camera;
    }
    // 빛
    _setupLight(){
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color,intensity);
        light.position.set(-1, 2, 4);
        this._scene.add(light);
    }
        //  2D 네모
        // _setupModel(){
        //     const shape = new THREE.Shape();

        //     // shape에 대한 모양을 정의해주자 (정의하지 않으면 아무것도 나타나지 않는다)
        //     shape.moveTo(1,1);      // 시작지점 설정
        //     shape.lineTo(1,-1);     // 선긋기
        //     shape.lineTo(-1,-1);    // 선긋기
        //     shape.lineTo(-1,1);     // 선긋기
        //     shape.closePath();      // 도형이 열여있다면 닫기

        //     const geometry = new THREE.BufferGeometry();
        //     const points = shape.getPoints();
        //     geometry.setFromPoints(points);

        //     const material = new THREE.LineBasicMaterial({color: 0xffff00});
        //     const line = new THREE.Line(geometry,material);

        //     this._scene.add(line);
        // }


        // 2D 하트
        // _setupModel(){
            // const shape = new THREE.Shape();
            // const x = -2.5, y = -5;
            // shape.moveTo(x+2.5,y+2.5);
            // shape.bezierCurveTo(x+2.5,y+2.5,x+2,y,x,y);
            // shape.bezierCurveTo(x-3,y,x-3,y+3.5,x-3,y+3.5);
            // shape.bezierCurveTo(x-3,y+5.5,x-1.5,y+7.7,x+2.5,y+9.5);
            // shape.bezierCurveTo(x+6,y+7.7,x+8,y+4.5,x+8,y+3.5);
            // shape.bezierCurveTo(x+8,y+3.5,x+8,y,x+5,y);
            // shape.bezierCurveTo(x+3.5,y,x+2.5,y+2.5,x+2.5,y+2.5);

        //     const geometry = new THREE.BufferGeometry();
        //         const points = shape.getPoints();
        //         geometry.setFromPoints(points);

        //         const material = new THREE.LineBasicMaterial({color: 0xffff00});
        //         const line = new THREE.Line(geometry,material);

        //         this._scene.add(line);
        // }


        // // 2D 하트 shape를 이용한 2D하트 도형 만들기
        // _setupModel(){
            // // 2D 모양 만들기
            // const shape = new THREE.Shape();
            // const x = -2.5, y = -5;
            // shape.moveTo(x+2.5,y+2.5);
            // shape.bezierCurveTo(x+2.5,y+2.5,x+2,y,x,y);
            // shape.bezierCurveTo(x-3,y,x-3,y+3.5,x-3,y+3.5);
            // shape.bezierCurveTo(x-3,y+5.5,x-1.5,y+7.7,x+2.5,y+9.5);
            // shape.bezierCurveTo(x+6,y+7.7,x+8,y+4.5,x+8,y+3.5);
            // shape.bezierCurveTo(x+8,y+3.5,x+8,y,x+5,y);
            // shape.bezierCurveTo(x+3.5,y,x+2.5,y+2.5,x+2.5,y+2.5);

            // // 위에서 만든 2D모양을 geometry인자로 넣어 2D도형 생성
            // const geometry = new THREE.ShapeGeometry(shape);
            
        //     // 파란색 계열의 재질 생성
        //     const Material = new THREE.MeshPhongMaterial({color: 0x44a88});
        //     // 회색 계열의 재질 생성
        //     const fillMaterial = new THREE.MeshPhongMaterial({color:0x515151});

        //     // 정육면체 생성
        //     const cube = new THREE.Mesh(geometry,fillMaterial);

        //     // 노란색 라인 생성
        //     const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
        //     const line = new THREE.LineSegments(
        //         // WireframeGeometry : 모델의 외각선 표시
        //         new THREE.WireframeGeometry(geometry),lineMaterial);

        //     // 라인과 정육면체를 합칠 수 있도록 group 객체생성
        //     const group = new THREE.Group();
        //     // 그룹안에 정육면체와 라인 넣기
        //     group.add(cube);
        //     group.add(line);

        //     // scene객체의 구성요소로 cube추가
        //     this._scene.add(group)
        //     // 다른 메서드에서 참조할 수 있도록 field로 정의
        //     this._cube = group;
        // }


            // // 2D 곡선 만들기
            // _setupModel(){
            //     class CustomSinCurve extends THREE.Curve{
            //         constructor(scale){
            //             super();
            //             this.scale = scale;
            //         }
            //         getPoint(t){
            //             const tx = t*3-1.5;
            //             const ty = Math.sin(2*Math.PI*t);
            //             const tz = 0;
            //             return new THREE.Vector3(tx,ty,tz).multiplyScalar(this.scale);
            //         }
            //     }
                
            //     const path = new CustomSinCurve(4);

            //     const geometry = new THREE.BufferGeometry();
            //     // 커브를 구성하는 좌표의 개수
            //     const points = path.getPoints();    // 기본 값 5 높을수록 부드러운 곡선
            //     geometry.setFromPoints(points);

            //     const material = new THREE.LineBasicMaterial({color: 0xffff00});
            //     const line = new THREE.Line(geometry,material);

            //     this._scene.add(line);
            // }


        // 곡선 튜브 만들기
            // _setupModel(){
            //     // 2D 모양 만들기
                // class CustomSinCurve extends THREE.Curve{
                //     constructor(scale){
                //         super();
                //         this.scale = scale;
                //     }
                //     getPoint(t){
                //         const tx = t*3-1.5;
                //         const ty = Math.sin(2*Math.PI*t);
                //         const tz = 0;
                //         return new THREE.Vector3(tx,ty,tz).multiplyScalar(this.scale);
                //     }
                // }
                // const path = new CustomSinCurve(4);

                // // 첫번째 인자 : 튜브가 이어지는 길
                // // 두번째 인자 : 분할 수(default :  64) : 높을수록 부드러운 곡선
                // // 세번째 인자 : 튜브 원통 반지름(default : 1)
                // // 네번째 인자 : 원통에 대한 분할 수(default : 8) : 높을수록 동그란 튜브
                // // 다섯번째 인자 : 원통을 열지 닫을지 여부 (default : false)
                // const geometry = new THREE.TubeGeometry(path);  
                
                // const fillMaterial = new THREE.MeshPhongMaterial({color:0x515151});

                // const cube = new THREE.Mesh(geometry,fillMaterial);

                // // 노란색 라인 생성
                // const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
                // const line = new THREE.LineSegments(
                //     // WireframeGeometry : 모델의 외각선 표시
                //     new THREE.WireframeGeometry(geometry),lineMaterial);

                // // 라인과 정육면체를 합칠 수 있도록 group 객체생성
                // const group = new THREE.Group();
                // // 그룹안에 정육면체와 라인 넣기
                // group.add(cube);
                // group.add(line);

                // // scene객체의 구성요소로 cube추가
                // this._scene.add(group)
                // // 다른 메서드에서 참조할 수 있도록 field로 정의
                // this._cube = group;
            // }


            // // 선을 y축으로 회전시켜 도형만들기
            // _setupModel(){
            //     // 회전 대상이 되는 선
            //     const points = [];
            //     for(let i=0; i<10; ++i){
            //         points.push(new THREE.Vector2(Math.sin(i*0.2)*3+3,(i-5)*.8));
            //     }
                
            //     // 회전 대상이 되는 선을 y축을 기준으로 돌린 도형 만들기
            //     // 첫번째 인자 : 회전 대상이 되는 선
            //     // 두번째 인자 (d : 12) : 분할 수
            //     // 세번째 인자 : 시작각
            //     // 네번쨰 인자 : 연장각
            //     const geometry = new THREE.LatheGeometry(points);

            //     const fillMaterial = new THREE.MeshPhongMaterial({color:0x515151});

            //     const cube = new THREE.Mesh(geometry,fillMaterial);

            //     // 노란색 라인 생성
            //     const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
            //     const line = new THREE.LineSegments(
            //         // WireframeGeometry : 모델의 외각선 표시
            //         new THREE.WireframeGeometry(geometry),lineMaterial);

            //     // 라인과 정육면체를 합칠 수 있도록 group 객체생성
            //     const group = new THREE.Group();
            //     // 그룹안에 정육면체와 라인 넣기
            //     group.add(cube);
            //     group.add(line);

            //     // scene객체의 구성요소로 cube추가
            //     this._scene.add(group)
            //     // 다른 메서드에서 참조할 수 있도록 field로 정의
            //     this._cube = group;
            // }

            // 2D 하트를 3D하트로 만들기
            _setupModel(){

                    // 2D 하트모양 만들기
                    const shape = new THREE.Shape();
                    const x = -2.5, y = -5;
                    shape.moveTo(x+2.5,y+2.5);
                    shape.bezierCurveTo(x+2.5,y+2.5,x+2,y,x,y);
                    shape.bezierCurveTo(x-3,y,x-3,y+3.5,x-3,y+3.5);
                    shape.bezierCurveTo(x-3,y+5.5,x-1.5,y+7.7,x+2.5,y+9.5);
                    shape.bezierCurveTo(x+6,y+7.7,x+8,y+4.5,x+8,y+3.5);
                    shape.bezierCurveTo(x+8,y+3.5,x+8,y,x+5,y);
                    shape.bezierCurveTo(x+3.5,y,x+2.5,y+2.5,x+2.5,y+2.5);

                    
                    // extrude를 생성하기 위한 세팅값
                    const settings = {
                        steps: 1,   // 깊이 방향으로의 분할 수
                        depth: 0.1,   // 깊이 값
                        bevelEnabled: true,    // 베벨링 처리를 할것인지?
                        bevelThickness: 2,   // 베벨링 두께
                        bevelSize: 2,        // shape의 기본값으로 얼마나 베벨링 할지?
                        bevelSegments: 10,   // 베벨링을 얼마나 부드럽게?
                    }

                    const geometry = new THREE.ExtrudeGeometry(shape, settings);
                    
                
                const fillMaterial = new THREE.MeshPhongMaterial({color:0x515151});

                const cube = new THREE.Mesh(geometry,fillMaterial);

                // 노란색 라인 생성
                const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
                const line = new THREE.LineSegments(
                    // WireframeGeometry : 모델의 외각선 표시
                    new THREE.WireframeGeometry(geometry),lineMaterial);

                // 라인과 정육면체를 합칠 수 있도록 group 객체생성
                const group = new THREE.Group();
                // 그룹안에 정육면체와 라인 넣기
                group.add(cube);
                group.add(line);

                // scene객체의 구성요소로 cube추가
                this._scene.add(group)
                // 다른 메서드에서 참조할 수 있도록 field로 정의
                this._cube = group;
            }
        

        //     // 3D 글씨 쓰기
        //     _setupModel(){

        //         const fontLoader = new THREE.FontLoader();

        //         // 폰트데이터를 로드하기 위한 비동기함수
        //         async function loadFont(that){
        //             const url = "../examples/fonts/helvetiker_regular.typeface.json"
        //             const font = await new Promise((resolve,reject)=>{
        //                 fontLoader.load(url,resolve,undefined,reject);
        //             });
        //             // TextGeometry를 위한 장치
        //             const geometry = new THREE.TextGeometry("GIS", {
        //                 font: font, // fontLoader를 통해서 얻어온 객체
        //                 size: 9, // 텍스트 메쉬의 크기이다. 기본값은 100 이다.
        //                 height: 1.8, // 깊이 값이다. 기본값은 50 이다.
        //                 curveSegments: 5, // 하나의 커브를 구성하는 정점의 갯수이다. 기본값은 12이다.
        //                 // setting for ExtrudeGeometry
        //                 bevelEnabled: true, // 베벨링 처리를 할 것인지의 여부. 기본값은 true이다. true로 설정해주어야 다음 설정값이 적용된다.
        //                 bevelThickness: 1.5, // 베벨링에 대한 두께 값이다. 기본값은 6이다.
        //                 bevelSize : 1.7,  // shape의 외곽선으로부터 얼마나 멀리 베벨링 할 것인지에 대한 거리. 기본값은 2이다.
        //                 bevelOffset : 0,  // 텍스트 윤곽선 베벨에서 시작하는 거리이다. * 이 값을 반드시 지정해줘야 한다.
        //                 bevelSegments: 3 // 베벨링 단계 수. 기본값은 3이다.
        //             });
        //         bevelOffset : 0


        //             const fillMaterial = new THREE.MeshPhongMaterial({color:0x515151});

        //     const cube = new THREE.Mesh(geometry,fillMaterial);

        //     // 노란색 라인 생성
        //     const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
        //     const line = new THREE.LineSegments(
        //         // WireframeGeometry : 모델의 외각선 표시
        //         new THREE.WireframeGeometry(geometry),lineMaterial);

        //     // 라인과 정육면체를 합칠 수 있도록 group 객체생성
        //     const group = new THREE.Group();
        //     // 그룹안에 정육면체와 라인 넣기
        //     group.add(cube);
        //     group.add(line);

        //     // scene객체의 구성요소로 cube추가
        //     that._scene.add(group)
        //     // 다른 메서드에서 참조할 수 있도록 field로 정의
        //     that._cube = group;
        //         }
        //         // 비동기 함수 호출
        //         loadFont(this);

        // }



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
        // // 정육면체 자동 회전 장치
        //  this._cube.rotation.x = time;
        //  this._cube.rotation.y = time;
    }

}

window.onload = function(){
    new App();
}




