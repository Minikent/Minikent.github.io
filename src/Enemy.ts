import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import Context from './Context';
import Explosion from './Explosion';
import EnemyAI from './EnemyAI';

export default class Enemy {
  
  context: Context;
  mesh: THREE.Mesh | THREE.Group<THREE.Object3DEventMap>
  _positionVector: THREE.Vector3;
  explosion?: Explosion;
  ai = new EnemyAI();
  boomAudioBuffer: AudioBuffer | null = null;

  constructor(context: Context) {
    this.context = context
    const geometry = new THREE.SphereGeometry( 0.01, 64, 64 ); 
    const material = new THREE.MeshStandardMaterial( { color: "#00ff83" } ); 
    this.mesh = new THREE.Mesh( geometry, material );
    this._positionVector = new THREE.Vector3
    const loader = new GLTFLoader();
    loader.load('X-WING.gltf', (gltf) => {
      context.scene.remove(this.mesh)
      this.mesh = gltf.scene;
      context.scene.add(this.mesh);
    })
    context.scene.add(this.mesh);
  }

  handleHit() {
    this.explosion = new Explosion({
      context: this.context,
      ...this.mesh.position,
      soundBuffer: this.boomAudioBuffer
    });
    this.mesh.position.x = Math.random() * 100 - 50
    this.mesh.position.y = Math.random() * 100 - 50
    this.mesh.position.z = Math.random() * 100 - 50
  }

  setAudioBuffer(boomAudioBuffer: AudioBuffer) {
    this.boomAudioBuffer = boomAudioBuffer
  } 

  animate() {
    switch (this.ai.rotationAxis) {
      case 1: this.mesh.rotateX(this.ai.rotationSpeed); break;
      case 2: this.mesh.rotateY(this.ai.rotationSpeed); break;
      case 3: this.mesh.rotateZ(this.ai.rotationSpeed); break;
    }
    this.mesh.translateX(0.3)
  }

  getPosition(): THREE.Vector3 {
    this._positionVector.setFromMatrixPosition(this.mesh.matrixWorld)
    return this._positionVector
  }
}