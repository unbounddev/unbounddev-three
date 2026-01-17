import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Input from './input';
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

const input = new Input();

class Car {
  /** @type {THREE.Group} */
  model;
  speed = 0.05;
  keyW = input.addKey("KeyW");
  keyA = input.addKey("KeyA");
  keyS = input.addKey("KeyS");
  keyD = input.addKey("KeyD");

  constructor(model){
    this.model = model;
  }

  update() {
    if (this.keyD.isDown){ // right
      this.model.rotateY(-0.01);
    } else if(this.keyA.isDown){ // left
      this.model.rotateY(0.01);
    }

    if (this.keyW.isDown){
      this.moveForward()
    } else if(this.keyS.isDown){
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