import * as THREE from 'three'
import Context from './Context';
import Enemy from './Enemy';

const POINTER_POSITION_GAP = 20;

export default class EnemyPointers {

  context: Context
  private _frustum: THREE.Frustum
  private containerWidth: number = window.innerWidth;
  private containerHeight: number = window.innerHeight;
  private _pointerEl: HTMLDivElement;

  constructor(context: Context) {
    this.context = context;
    this._frustum = new THREE.Frustum();

    let pointerEl = document.createElement("div");
    pointerEl.style.color = '#ff5555'
    pointerEl.style.position = 'fixed'
    pointerEl.textContent = `◄`;
    pointerEl.setAttribute("class", "aim-arrow");
    this._pointerEl = pointerEl;
    const body = document.querySelector("body") as HTMLElement
    body.appendChild(this._pointerEl);
    window.addEventListener( 'resize', () => {
      this.containerHeight= window.innerHeight;
      this.containerWidth= window.innerWidth;
    })
  }

  animate() {
    this.context.enemies.list.forEach((enemy: Enemy) => {
      if (!this._checkIsAtScreen(enemy.getPosition())) {
        let posViewer = new THREE.Vector3(0, 0, (0.1 + 1000 / 2) * -1)
        this.context.camera.localToWorld(posViewer)

        //find intersections
        let line3 = new THREE.Line3();
        line3.set(posViewer, enemy.getPosition());
        let intersectionPoint = new THREE.Vector3();

        let isValidScreenCoordinates = false;
        let isNearToScreenEdge = false;
        for (let i of [0, 1, 2, 3]) {
          this._frustum.planes[i].intersectLine(line3, intersectionPoint);
          if(!!intersectionPoint) {
              let screenCoordinate = this._vector3ToScreenXY(intersectionPoint);
              if (!!screenCoordinate) {
                  isValidScreenCoordinates = (screenCoordinate.x >= 0)
                    && (screenCoordinate.y >= 0)
                    && (screenCoordinate.x <= this.containerWidth)
                    && (screenCoordinate.y <= this.containerHeight);
                  isNearToScreenEdge = ((screenCoordinate.x < POINTER_POSITION_GAP) || (screenCoordinate.x > (this.containerWidth - POINTER_POSITION_GAP)))
                    || ((screenCoordinate.y < POINTER_POSITION_GAP) || (screenCoordinate.y > (this.containerHeight - POINTER_POSITION_GAP)))
                  if (isValidScreenCoordinates && isNearToScreenEdge) {
                      this._placePointer(screenCoordinate);
                      //display pointer
                      this._pointerEl.classList.add("visible");
                  }
              }
          }
        }
      } else {
        this._pointerEl.classList.remove('visible')
      }
    })
    
  }
  private _vector3ToScreenXY(vector3: THREE.Vector3) {
    const camera = this.context.camera
    let result = null;
    let pos = vector3.clone();
    let projScreenMat = new THREE.Matrix4();
    projScreenMat.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    // projScreenMat.multiplyVector3(pos);
    pos.applyMatrix4(projScreenMat)

    let x = ( pos.x + 1 ) * this.containerWidth / 2;
    let y = ( - pos.y + 1) * this.containerHeight / 2;

    if (!isNaN(x) && !isNaN(y)) {
        result = { x, y };
    }

    return result;
  }

  private _checkIsAtScreen(pointVector3: THREE.Vector3) {
    const camera = this.context.camera;
    camera.updateMatrix();
    camera.updateMatrixWorld();
    this._frustum.setFromProjectionMatrix(
      new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    );
    return this._frustum.containsPoint(pointVector3);
  }

  _placePointer(screenCoordinate: {x:number, y: number}) {
    let angle = this._findAimPointerAngle(screenCoordinate);
    this._pointerEl.style.left = `${screenCoordinate.x}px`;
    this._pointerEl.style.top = `${screenCoordinate.y}px`;
    this._pointerEl.style.transformOrigin = "0% 0%";
    this._pointerEl.style.transform = `rotate(${angle}deg) translate(0%, -50%)`;
  }

  _findAimPointerAngle(pointerXYCoordinate: {x: number, y: number}) {
    let cx = pointerXYCoordinate.x;
    let cy = pointerXYCoordinate.y;
    let ex = this.containerWidth / 2;
    let ey = this.containerHeight / 2;

    let dy = ey - cy;
    let dx = ex - cx;
    let theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
  }
}