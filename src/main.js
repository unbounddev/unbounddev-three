import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 100, 1, 100 );
const material = new THREE.MeshBasicMaterial( { color: 0x404040 } );
const cube = new THREE.Mesh( geometry, material );
cube.position.set(0, -0.5, 0)
scene.add( cube );


camera.position.z = 5;
camera.position.set(0, 5, 5);
camera.lookAt(0, 0, 0);

const loader = new GLTFLoader();

class Car {
  /** @type {THREE.Group} */
  model;
  speed = 0.05;
  forward = false;
  left = false;
  right = false;
  reverse = false;

  constructor(model){
    this.model = model;
    // TODO: Create separate class for handling input
    document.addEventListener("keydown", (e) => {
      if (e.code == "KeyW"){
        this.forward = true;
      } else if(e.code == "KeyA") {
        this.left = true;
      } else if(e.code == "KeyD") {
        this.right = true;
      } else if(e.code == "KeyS") {
        this.reverse = true;
      }
    })

    document.addEventListener("keyup", (e) => {
      if (e.code == "KeyW"){
        this.forward = false;
      } else if(e.code == "KeyA") {
        this.left = false;
      } else if(e.code == "KeyD") {
        this.right = false;
      } else if(e.code == "KeyS") {
        this.reverse = false;
      }
    })
    
  }

  update() {
    if (this.right){
      this.model.rotateY(-0.01);
    } else if(this.left){
      this.model.rotateY(0.01);
    }

    if (this.forward){
      this.moveForward()
    } else if(this.reverse){
      this.moveBackward()
    }
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



loader.load( '/raceCarRed.glb', function ( gltf ) {

  car = new Car(gltf.scene);

  scene.add( car.model );

}, undefined, function ( error ) {

  console.error( error );

} );

const light = new THREE.AmbientLight( 0x404040, 20); // soft white light
scene.add( light )

function animate() {
  
  if (car) {
    car.update();
  }
  renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );