import CONFIG from '../../config'
import { InputComponent } from './input-component'

export class BotScoutInputComponent extends InputComponent {
  #gameObject
  #startX

  constructor(gameObject: Phaser.GameObjects.Container) {
    super()

    this.#gameObject = gameObject
    this.#startX = this.#gameObject.x
    this._down = true
    this._left = false
    this._right = true
  }

  update() {
    if (this.#gameObject.x > this.#startX + CONFIG.ENEMY_SCOUT_MAX_X) {
      this._left = true
      this._right = false
    }

    if (this.#gameObject.x < this.#startX - CONFIG.ENEMY_SCOUT_MAX_X) {
      this._left = false
      this._right = true
    }
  }
}
