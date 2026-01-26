import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Input, { EIGHT_BITDO_ULTIMATE_2C_MAPPING } from './input';

const quadPositions = [
  {
    left: 0,
    bottom: 0.5,
    width: 0.5,
    height: 0.5
  },
  {
    left: 0.5,
    bottom: 0.5,
    width: 0.5,
    height: 0.5
  },
  {
    left: 0,
    bottom: 0,
    width: 0.5,
    height: 0.5
  },
  {
    left: 0.5,
    bottom: 0,
    width: 0.5,
    height: 0.5
  },
]

const positions = [
  [
    {
      left: 0,
      bottom: 0,
      width: 1,
      height: 1
    }
  ],
  [
    {
      left: 0,
      bottom: 0,
      width: 0.5,
      height: 1
    },
    {
      left: 0.5,
      bottom: 0,
      width: 1,
      height: 1
    },
  ],
  quadPositions,
  quadPositions
]

/** @type {Map<string, Map<string, GLTFLoader>>} */
const modelAssets = new Map();
modelAssets.set("racing", new Map());
const racingAssets = modelAssets.get("racing");

const scene = new THREE.Scene();
const game = {
  input: new Input(),
  scene: scene,
};
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

class Player {
  input;
  /** @type {THREE.PerspectiveCamera} */
  camera;
  view;
  /** @type {Car} */
  car;
  game;

  constructor(game, input){
    this.game = game;
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 5, 0)
    this.addCar();
    if (input.type == "keyboard"){
      this.keyW = game.input.addKey("KeyW");
      this.keyA = game.input.addKey("KeyA");
      this.keyS = game.input.addKey("KeyS");
      this.keyD = game.input.addKey("KeyD");
    }

  }

  addCar(){
    let interval = setInterval(() => {
      if (racingAssets.has("redRaceCar")){
        const sourceModel = (racingAssets.get("redRaceCar")).scene;
        this.car = new Car(sourceModel.clone());
        this.game.scene.add(this.car.model);
        clearInterval(interval);
      }
    }, 1000)
  }

  update() {
    if (this.car) {
      if (this.keyD.isDown){ // right
        this.car.model.rotateY(-0.01);
      } else if(this.keyA.isDown){ // left
        this.car.model.rotateY(0.01);
      }

      if (this.keyW.isDown){
        this.car.moveForward()
      } else if(this.keyS.isDown){
        this.car.moveBackward()
      }
      const carPos = new THREE.Vector3();
      this.car.model.getWorldPosition(carPos);
      const carDir = new THREE.Vector3();
      this.car.model.getWorldDirection(carDir);
      const cameraPos = new THREE.Vector3(carDir.x*-3.5, 3.5, carDir.z*-3.5);
      carPos.add(cameraPos)
      this.camera.position.set(carPos.x, carPos.y, carPos.z);
      this.camera.lookAt((new THREE.Vector3(this.car.model.position.x, this.car.model.position.y+2, this.car.model.position.z)))
    }
    
  }
}

/** @type {Player[]} */
const players = [];

const geometry = new THREE.BoxGeometry( 100, 1, 100 );
const material = new THREE.MeshBasicMaterial( { color: 0x404040 } );
const cube = new THREE.Mesh( geometry, material );
cube.position.set(0, -0.5, 0)
scene.add( cube );

const loader = new GLTFLoader();

class Car {
  /** @type {THREE.Group} */
  model;
  speed = 0.05;

  constructor(model){
    this.model = model;
  }

  moveForward() {
    const direction = new THREE.Vector3();
    this.model.getWorldDirection(direction);
    this.model.position.add(direction.multiplyScalar(this.speed));
  }

  moveBackward() {
    const direction = new THREE.Vector3();
    this.model.getWorldDirection(direction);
    this.model.position.add(direction.multiplyScalar(this.speed*-1));
  }
}

/** @type {Car | undefined} */
let car;

function loadModel(folder, asset, path){
  loader.load(path, function (/** @type {GLTFLoader} */ gltf) {
    if (modelAssets.has(folder)){
      const assetFolder = modelAssets.get(folder);
      assetFolder.set(asset, gltf);
    } else {
      const assetFolder = new Map();
      assetFolder.set(asset, gltf);
      modelAssets.set(assetFolder);
    }
  }, undefined, function (e) {
    console.error(e);
  })
}

loadModel("racing", "redRaceCar", "/racing/raceCarRed.glb");

const light = new THREE.DirectionalLight();
scene.add( light )

window.addEventListener("keydown", (e) => {
  if (e.code != "KeyJ"){ return }
  if (players.length >= 4 || players.some(p => p.input.type == "keyboard")){
    return;
  }
  players.push(new Player(game, { type: "keyboard" }));
})

const joinText = document.getElementById("joinText");

function animate() {
  if (players.length < 1){
    joinText.style.display = "block";
    return;
  }
  joinText.style.display = "none";
  game.input.update();
  for (let i = 0; i < players.length; i++){
    const camera = players[i].camera;
    
    players[i].update()

    let viewPositions = positions[players.length-1][i];

    let left = viewPositions.left;
    let bottom = viewPositions.bottom;
    let width = viewPositions.width;
    let height = viewPositions.height;

    left = left * window.innerWidth;
    bottom = bottom * window.innerHeight;
    width = width * window.innerWidth;
    height = height * window.innerHeight;

    renderer.setViewport(left, bottom, width, height);
    renderer.setScissor(left, bottom, width, height);
    renderer.setScissorTest(true);
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    

    renderer.render( scene, camera )

  }
  
  // https://threejs.org/examples/webgl_multiple_views.html
  
  
  // console.log(input.gamepads[0])
  // console.log(input.gamepads[0]?.buttons[10].pressed)
  // renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );