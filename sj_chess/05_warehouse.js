import * as THREE from '../build/three.module.js';
// 마우스를 이용해 Object를 회전시키기 위한 코드
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js"

import {GLTFLoader} from "../examples/jsm/loaders/GLTFLoader.js"
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
        // 배경 색상 설정
        scene.background = new THREE.Color(0.7,0.7,0.7)
        // 다른 메서드에서 참조할 수 있도록 field로 정의
        this._scene = scene;

        // 메서드 호출 (아직 정의 X)
        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();
        this._setupEvents();

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
    _setupControls(){
        // OrbitControls : 마우스로 화면을 컨트롤하는 기능
        // OrbitControls객체 = 카메라 객체 + 마우스 이벤트를 받는 Dom요소
        new OrbitControls(this._camera, this._divContainer);
    }
    _setupEvents(){
        
        this._raycaster = new THREE.Raycaster();
        // _clickedPosition : 마우스로 클릭된 scene의 좌표를 참조
        this._raycaster._clickedPosition = new THREE.Vector2();
        // 클릭해서 선택된 매쉬 객체에 대한 참조
        this._raycaster._selectedMesh = null;

        // 마우스 클릭 이벤트
        window.addEventListener("click",(event)=>{
            this._raycaster._clickedPosition.x = (event.clientX / window.innerWidth)*2-1;
            this._raycaster._clickedPosition.y = -(event.clientY / window.innerHeight)*2+1;
            this._raycaster.setFromCamera(this._raycaster._clickedPosition, this._camera);
            
            // 실제 클릭된 mesh를 얻는 코드
            const found = this._raycaster.intersectObjects(this._scene.children);
            if(found.length > 0){
                
                const clickedObj = found[0].object;

                let oldY = this._raycaster._clickedPosition.y;
                if(clickedObj.name!=""){
                    // 해당 재고가 있는 선반의 위치 (.x .y .z로 구체적으로 알 수 있음)
                    console.log(clickedObj.parent.position);
                    // 해당 선반에서 재고의 위치
                    console.log(clickedObj.position);
                    // 위의 두 값을 더할 때는 선반의 회전 여부도 알아둬야 할 듯
                    console.log("재고명 : "+clickedObj.name);
                    console.log(clickedObj);
                    // clickedObj.parent
                    clickedObj.material.color.set(0xffff00);

                    oldY = clickedObj.position.y;
                }
                    
                if(clickedObj.name!=""){
                    // 빈자리가 아닌 재고가 있는 자리를 선택했을 때

                    //  이전에 클릭한 mesh를 저장한 변수
                    const oldSelectedMesh = this._raycaster._selectedMesh;
                    // 새로운 mesh를 담을 변수
                    this._raycaster._selectedMesh = clickedObj;

                    if(oldSelectedMesh !== this._raycaster._selectedMesh){
                        // 현재 선택된 재고에 선 추가
                        gsap.to(this._raycaster._selectedMesh.position,{y:7,duration:1})
                        // 동시에 선택된 재고를 제자리에서 회전
                        // gsap.to(this._raycaster._selectedMesh.rotation,{y:Math.PI*2,duration:1})
                    }else{
                        this._raycaster._selectedMesh = null;
                    }
                    if(oldSelectedMesh){
                        // 이전에 선택된 재고가 있다면
                        // 이전에 선택된 재고를 원래상태로 변경
                        
                        gsap.to(oldSelectedMesh.position,{y:oldY,duration:1});
                        
                    }
                }else {
                    // 빈자리를 선택했을 때
                    if(this._raycaster._selectedMesh){
                        console.log(found[0].point);
                        // 선택된 재고를 클릭된 위치로 수평이동한 뒤 해당방향으로 수직이동
                        const timeline = gsap.timeline();
                        timeline.to(this._raycaster._selectedMesh.position,{
                            // x: found[0].point.x-clickedObj.position.x,
                            
                            z: found[0].point.z-clickedObj.parent.parent.position.z,
                            duration:1,
                        })
                        timeline.to(this._raycaster._selectedMesh.position,{
                            y: found[0].point.y+0.35,duration:1,
                        })
                        
                        // 동시에 회전
                        gsap.to(this._raycaster._selectedMesh.rotation,{y:-Math.PI*2,duration:1});
                        this._raycaster._selectedMesh = null;
                    }
                }
            }else{
                // 아무것도 클릭되지 않았을 경우
                this._raycaster._selectedMesh = null;
            }
        
        
                
        }
    )
    

        // 반응형 웹
        window.onresize = this.resize.bind(this);
        this.resize();

        this._clock = new THREE.Clock();
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
        camera.rotation.x = 30;
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


    _setupModel(){

                // // 3D 모델 가져와서 재고로 띄우기
                // new GLTFLoader().load("./data/cardboard_box.glb",(gltf)=>{
                //     const models = gltf.scene;
                //     this._modelRepository = models;
                //     const mesh = this._modelRepository.getObjectByName("Sketchfab_model");
                //     mesh.position.set(0,-0.8+(stock_info.floor*1),(0.6*shelf_info.length)-(0.6)-(shelf_info.width*stock_info.position))
                //     this._scene.add(mesh)
                //     this._createBoard();
                // })
this._createBoard();


    }





// 창고 생성
 _createBoard(){
    const watehouse_x = 20;
    const watehouse_y = 40;
    const wareHouse = new THREE.Object3D();
    const planeGeometry = new THREE.PlaneGeometry(watehouse_x,watehouse_y,watehouse_x/2,watehouse_y/2)

    const wareHouseMaterial = new THREE.MeshPhongMaterial({
        emissive:0x888888, flatShading:true
    })
    const group1 = new THREE.Group();
    const wareHouseMesh = new THREE.Mesh(planeGeometry,wareHouseMaterial);
     // 노란색 라인 생성
    const lineMaterial = new THREE.LineBasicMaterial({color: 0xa0a0a0});
    const line = new THREE.LineSegments(
     // WireframeGeometry : 모델의 외각선 표시
     new THREE.WireframeGeometry(planeGeometry),lineMaterial);
    group1.add(wareHouseMesh);
    group1.add(line);
    // 판 돌리기
    group1.rotation.x =-Math.PI/2;
    wareHouse.add(group1);

    const mesh = wareHouse
    mesh.position.set(0,0,0);
    this._scene.add(mesh);

    this._warehouse = wareHouse
    this._createShelfs(watehouse_x,watehouse_y);
}




// 선반 생성
_createShelfs(x,y){
    this._createShelf({x,y},"A선반",{x:-6,y:0},{width : 1,length :7,floor :4},false);
    this._createShelf({x,y},"B선반",{x:6,y:0},{width : 1,length :7,floor :4},false);
    this._createShelf({x,y},"C선반",{x:6,y:-12},{width : 1,length :7,floor :4},false);
    this._createShelf({x,y},"D선반",{x:-6,y:-12},{width : 1,length :7,floor :4},false);
    this._createShelf({x,y},"E선반",{x:6,y:12},{width : 1,length :7,floor :4},false);
    this._createShelf({x,y},"F선반",{x:-6,y:12},{width : 1,length :7,floor :4},false);
   }
_createShelf(warehouse_info,meshName,boardPos,shelf_info,rotation){

    // 선반이 창고를 넘어가지 않게하는 장치
    if(((warehouse_info.x/2>(Math.abs(boardPos.x)+shelf_info.length/2)&&rotation==true )
    ||(warehouse_info.x/2>(Math.abs(boardPos.x)+shelf_info.width/2)&&rotation==false ))
    &&
    ((warehouse_info.y/2>(Math.abs(boardPos.y)+shelf_info.width/2)&&rotation==true )
    ||(warehouse_info.y/2>(Math.abs(boardPos.y)+shelf_info.length/2)&&rotation==false )) ){
        const group2 = new THREE.Group();
        // 기본 바 생성
        const shelfBarGeometry = new THREE.CylinderGeometry(0.03,0.03,shelf_info.width*shelf_info.floor-1+0.2)
        const shelfBarMaterial = new THREE.MeshPhongMaterial({
            color : 0xffffff, emissive : 0x112244, flatShading:true
        })
        // 기본 판 생성
        const shelfFloorGeometry = new THREE.BoxGeometry(shelf_info.width,0.05,shelf_info.width*shelf_info.length)
        const shelfFloorMaterial = new THREE.MeshPhongMaterial({
            color : 0xffffff, emissive : 0x112244, flatShading:true
        })
        for(let i=0;i<4;i++){
            // 바생성
            const shelfBarMesh =new THREE.Mesh(shelfBarGeometry,shelfBarMaterial);
            let x = 1;
            let z = 1;
            if(i==1){
                z=-1;
            }else if(i==2){
                x=-1;
                z=-1;
            }else if(i==3){
                x=-1;
            }
            shelfBarMesh.position.x = shelf_info.width/2*x;
            shelfBarMesh.position.y = shelf_info.width/2*(shelf_info.floor-2)+(0.6);
            shelfBarMesh.position.z = shelf_info.width/2*z*shelf_info.length;
            group2.add(shelfBarMesh);
        }
        for(let i=0;i<shelf_info.floor;i++){
            // 판 생성
            const shelfFloorMesh = new THREE.Mesh(shelfFloorGeometry,shelfFloorMaterial)
            shelfFloorMesh.position.y = (i*1)+0.1;
            group2.add(shelfFloorMesh);
        }
    
        if(rotation==true){
            group2.rotation.y =-Math.PI/2;
        }
        group2.position.set(boardPos.x,0,boardPos.y)
        group2.name = meshName;
        this._shelf = group2;
        this._scene.add(group2)
    
    
            this._createStocks(meshName,boardPos.x,boardPos.y,shelf_info.width,shelf_info.length);


    }else{
        alert(meshName+"이 창고의 크기를 넘었습니다")
    }
    
}


// 재고 생성
 _createStocks(shelf_name,x,y,width,length){
    this._createStock({shelf_name,x,y,width,length},{shelf_name:"A선반",size : 0.7,floor : 3,position : 0,},"코카콜라(500ml)");
    this._createStock({shelf_name,x,y,width,length},{shelf_name:"B선반",size : 0.7,floor : 4,position : 1,},"델몬트 오렌지(1.5L)");
    this._createStock({shelf_name,x,y,width,length},{shelf_name:"C선반",size : 0.7,floor : 1,position : 2,},"사이다(500ml)");
    }
 _createStock(shelf_info,stock_info,meshName){

    if(shelf_info.shelf_name == stock_info.shelf_name){
        // 기본 재고 생성
        const stockGeometry = new THREE.BoxGeometry(stock_info.size,stock_info.size,stock_info.size)
        const stockMaterial = new THREE.MeshPhongMaterial({
            color : 0xffffff, emissive : 0x112244, flatShading:true
        })
            
        // 재고 생성
        const stockMesh = new THREE.Mesh(stockGeometry,stockMaterial)
        stockMesh.position.y = -0.5+(stock_info.floor*1);
        stockMesh.position.z = (stock_info.position-shelf_info.length/2)+0.5;
        stockMesh.name = meshName

        this._stock = stockMesh;

        this._shelf.add(stockMesh)
    }
    
}
// 창고의 크기 얻기
_getBoardPosition(row,col){
    const warehouse = this._warehouse
    const box = new THREE.Box3().setFromObject(warehouse);
    const size = box.max.x - box.min.x;
    const cellWidth = size /10;
    return {
        x: col * cellWidth + cellWidth/2 - size/2,
        y: row * cellWidth + cellWidth/2 - size/2
    }
}
// 선반 크기와 좌표 얻기
_getShelfPosition(name,length,floor){
    // 위에서 만든 선반 가져오기
    const shelf = this._shelf
    const box = new THREE.Box3().setFromObject(shelf);
    const floor_size = box.max.y - box.min.y;
    const floor_cellWidth = floor_size /10;

    console.log(shelf)

    const length_size = box.max.z - box.min.z;
    const length_cellWidth = length_size /10;
    return{
        y: floor * floor_cellWidth + floor_cellWidth/2 - floor_size/2,
        z: length * length_cellWidth + length_cellWidth/2 - floor_cellWidth/2
    }
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

        // this._solarSystem.rotation.y = time/2;
        // this._earthOrbit.rotation.y = time;
    }


}

window.onload = function(){
    new App();
}




