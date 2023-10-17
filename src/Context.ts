import * as THREE from 'three';
import { FlyControls } from './control';
import { FlyControlsMobile } from './controlMobile';
import Weapons from './Weapons';
import Enemies from './Enemies';
import EnemyPointers from './EnemyPointers';

export default class Context {

  scene: THREE.Scene;
  clock: THREE.Clock;
  camera: THREE.PerspectiveCamera;
  canvas: HTMLCanvasElement;
  weapons: Weapons;
  enemies: Enemies;
  enemyPointers: EnemyPointers;
  renderer: THREE.WebGL1Renderer;
  controls: FlyControls | FlyControlsMobile;
  audioListener: THREE.AudioListener;
  sound: THREE.Audio;

  constructor(controlType: string) {
    this.scene = new THREE.Scene;
    this.weapons = new Weapons(this);
    this.enemies = new Enemies(this);
    this.enemyPointers = new EnemyPointers(this);

    this.clock = new THREE.Clock();

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 30;
    this.scene.add(this.camera);

    const light = new THREE.PointLight(0xffffff, 10000);
    light.position.set(100, 50, 100);
    this.scene.add(light);
    const light1 = new THREE.PointLight(0xffffff, 1000);
    light1.position.set(-100, -50, -100);
    this.scene.add(light1);

    //renderer
    const canvas = document.querySelector('.webgl') as HTMLCanvasElement;
    console.log(canvas)
    this.renderer = new THREE.WebGL1Renderer({
      canvas
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
    this.canvas = canvas

    const controls = controlType === 'pc' 
      ? new FlyControls(this.camera, this.renderer.domElement, this)
      : new FlyControlsMobile(this.camera, this.renderer.domElement, this);
    controls.movementSpeed = 30;
    controls.domElement = this.renderer.domElement;
    controls.rollSpeed = Math.PI / 6;
    controls.autoForward = false;
    controls.dragToLook = false;
    this.controls = controls;

    window.addEventListener( 'resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize( window.innerWidth, window.innerHeight );
    })

    const audioListener = new THREE.AudioListener();
    this.camera.add( audioListener );
    this.audioListener = audioListener;

    // create a global audio source
    this.sound = new THREE.Audio(audioListener);

    new THREE.CubeTextureLoader()
      .setPath('/')
      .load(
        [
          'px.png', 'nx.png',
          'ny.png', 'py.png',
          'pz.png','nz.png'
        ],
        (cubeTexture) => {
          this.scene.background = cubeTexture;
        }
      )
  }
}