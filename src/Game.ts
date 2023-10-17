import Context from "./Context";
export default class Game {
  
  context: Context; 
  
  constructor(controlType: string) {
    this.context = new Context(controlType)
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();// @ts-ignore
    } else if (elem.webkitRequestFullscreen) { // @ts-ignore
      elem.webkitRequestFullscreen(); // @ts-ignore
    } else if (elem.msRequestFullscreen) { // @ts-ignore
      elem.msRequestFullscreen();
    }
    this.context.renderer.domElement.addEventListener('pointerdown', () => {
      this.context.weapons.fire();
    });
    this.loop.bind(this);
  }

  loop() {
    this.context.weapons.animate()
    this.context.weapons.checkAndHandleHits()
    this.context.enemies.animate()
    
    const delta = this.context.clock.getDelta();
    this.context.enemyPointers.animate();
    this.context.renderer.render(this.context.scene, this.context.camera);
    window.requestAnimationFrame(this.loop.bind(this))
    this.context.controls.update( delta );
  }

  start() {

  }
}