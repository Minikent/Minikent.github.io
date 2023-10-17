import Ammo from "./Ammo"
import Context from "./Context"
import * as THREE from 'three'

export default class Weapons {
  ammo: Ammo[] = []
  context: Context;
  audioBuffer: AudioBuffer | null = null

  constructor(context: Context) {
    this.context = context
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'shot.wav', ( buffer ) => {
      this.audioBuffer = buffer
    });
  }

  fire() {
    this.ammo.push(new Ammo(this.context, this.audioBuffer))
  }

  ammoWentOut(which: Ammo) {
    this.ammo = this.ammo.filter(ammo => ammo !== which)
  }

  checkAndHandleHits() {
    this.ammo.forEach(ammo => {
      this.context.enemies.list.forEach((enemy) => {
        if (ammo.checkIsHit(enemy)) {
          enemy.handleHit();
          ammo.handleHit();
        }
      })
    })
  }

  animate() {
    this.ammo.forEach(ammo => ammo.animate())
  }
}