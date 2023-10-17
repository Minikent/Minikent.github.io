import Context from "./Context"
import Enemy from './Enemy';
import * as THREE from 'three'

export default class Enemies {
  context: Context;
  list: Enemy[];
  audioBufferBoom: AudioBuffer | null = null;

  constructor(context: Context) {
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'boom.mp3', ( buffer ) => {
      this.audioBufferBoom = buffer
      this.list.forEach((enemy) => enemy.setAudioBuffer(buffer))
    });
    this.context = context
    this.list = [new Enemy(context)]
  }

  animate() {
    this.list.forEach((enemy) => {
      enemy.animate()
      enemy.explosion && enemy.explosion.update()
    })
  }
}