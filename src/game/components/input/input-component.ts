export class InputComponent {
  _up: boolean | undefined
  _down: boolean | undefined
  _left: boolean | undefined
  _right: boolean | undefined
  _shoot: boolean | undefined

  constructor() {
    this.reset()
  }

  get upIsDown() {
    return this._up
  }

  get downIsDown() {
    return this._down
  }

  get leftIsDown() {
    return this._left
  }

  get rightIsDown() {
    return this._right
  }

  get shootIsDown() {
    return this._shoot
  }

  reset() {
    this._up = false
    this._down = false
    this._right = false
    this._left = false
    this._shoot = false
  }
}
