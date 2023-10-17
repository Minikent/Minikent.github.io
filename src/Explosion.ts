import Context from "./Context";
import * as THREE from 'three'

interface ExplosionAttrs {
  x: number;
  y: number;
  z: number;
  context: Context;
  soundBuffer: AudioBuffer | null;
}

const TOTAL_OBJECTS = 150;
// const PARTICLE_GEOMETRY = new THREE.BufferGeometry();
const PARTICLE_SIZE = 2;
const movementSpeed = 0.5;

export default class Explosion {

  context: Context
  dirs: {x: number, y: number, z: number}[] = [];
  parts: THREE.Vector3[] = [];
  object: THREE.Points;
  PARTICLE_GEOMETRY = new THREE.BufferGeometry();
  material = new THREE.PointsMaterial( {
    size: PARTICLE_SIZE,
    color: "#00ff83"
  } );

  constructor({context, x, y, z, soundBuffer}: ExplosionAttrs) {
    this.context = context;
    if (soundBuffer) {
      const sound = new THREE.Audio(this.context.audioListener);
      sound.setBuffer(soundBuffer);
      sound.setVolume(0.5);
      sound.play();
    }
    for (var i = 0; i < TOTAL_OBJECTS; i ++) { 
      var vertex = new THREE.Vector3();
      vertex.x = x;
      vertex.y = y;
      vertex.z = z;
      this.parts.push(vertex)
      this.dirs.push({x:(Math.random() * movementSpeed)-(movementSpeed/2),y:(Math.random() * movementSpeed)-(movementSpeed/2),z:(Math.random() * movementSpeed)-(movementSpeed/2)});
    }
    this.PARTICLE_GEOMETRY.setFromPoints(this.parts);
    // var material = new THREE.PointsMaterial( { size: PARTICLE_SIZE,  color: "#00ff83", fog: true } );
    this.object = new THREE.Points( this.PARTICLE_GEOMETRY, this.material );
    
    context.scene.add( this.object  );
    const pointsDynamocInterval = setInterval(() => {
      this.material = new THREE.PointsMaterial({
        size: this.material.size * 0.8,
        color: "#00ff83"
      })
    }, 100);
    setTimeout(() => {
      clearTimeout(pointsDynamocInterval)
      context.scene.remove(this.object)
    }, 2000)
  }

  update() {
    var pCount = TOTAL_OBJECTS;
    const positions = (this.PARTICLE_GEOMETRY.attributes.position).array
    while(pCount--) {
      const partPos = pCount*3
      positions[partPos] += this.dirs[pCount].y;
      positions[partPos + 1] += this.dirs[pCount].x;
      positions[partPos + 2] += this.dirs[pCount].z;
    }
    this.object.material = this.material
    this.PARTICLE_GEOMETRY.attributes.position.needsUpdate = true
  }
}
