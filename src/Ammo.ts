import * as THREE from 'three';
import Context from './Context';
import Enemy from './Enemy';

export default class Ammo {
  mesh: THREE.Mesh;
  context: Context;
  sound: THREE.Audio | null = null;

  constructor(context: Context, soundBuffer: AudioBuffer | null) {
    this.context = context;
    const ammoGeometry = new THREE.SphereGeometry( 0.5, 64, 64 ); 
    const ammoMaterial = new THREE.MeshStandardMaterial( { color: "#ff3333" } ); 
    this.mesh = new THREE.Mesh( ammoGeometry, ammoMaterial );
    this.mesh.position.set(
      context.camera.position.x,
      context.camera.position.y,
      context.camera.position.z
    )
    if (soundBuffer) {
      this.sound = new THREE.Audio(this.context.audioListener);
      this.sound.setBuffer(soundBuffer);
      this.sound.setVolume(0.5);
      this.sound.play();
    }
    this.mesh.quaternion.copy(context.camera.quaternion);
    context.camera.getWorldQuaternion(this.mesh.quaternion)
    context.scene.add( this.mesh );
    setTimeout(() => {
      context.scene.remove(this.mesh);
      context.weapons.ammoWentOut(this);
    }, 3000)
  }

  checkIsHit(enemy: Enemy) {
    return Math.abs(enemy.mesh.position.x - this.mesh.position.x) < 3 &&
      Math.abs(enemy.mesh.position.y - this.mesh.position.y) < 3 &&
      Math.abs(enemy.mesh.position.z - this.mesh.position.z) < 3
  }

  handleHit() {
    this.context.scene.remove(this.mesh);
    this.context.weapons.ammoWentOut(this);
  }

  animate() {
    this.mesh.translateZ(-1);
  }
}