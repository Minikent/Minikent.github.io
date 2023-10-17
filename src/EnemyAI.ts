const MIN_TIME_IN_DIRECTION = 3000
const GAP_TIME = 3000

export default class EnemyAI {
  
  rotationAxis: number = 0;
  rotationSpeed: number = 0;

  constructor() {
    this.changeFlyDirection = this.changeFlyDirection.bind(this);
    setTimeout(this.changeFlyDirection, Math.random() * GAP_TIME + MIN_TIME_IN_DIRECTION)
  }

  changeFlyDirection() {
    this.rotationAxis = Math.round(Math.random() * 3)
    this.rotationSpeed = (Math.random() - 0.5) * 0.1
    setTimeout(this.changeFlyDirection, Math.random() * GAP_TIME + MIN_TIME_IN_DIRECTION)
  }
}