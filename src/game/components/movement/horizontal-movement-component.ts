import { InputComponent } from '../input/input-component'
import CONFIG from '../../config'

export class HorizontalMovementComponent {
  #gameObject
  #inputComponent
  #velocity

  constructor(
    gameObject: Phaser.GameObjects.GameObject,
    inputComponent: InputComponent,
    velocity: number,
  ) {
    this.#gameObject = gameObject
    this.#inputComponent = inputComponent
    this.#velocity = velocity

    const body = this.#gameObject.body as Phaser.Physics.Arcade.Body
    body.setDamping(true) // removes linear speed stop from drag
    body.setDrag(CONFIG.MOVEMENT_HORIZONTAL_DRAG) // adds gradual decrease of speed (0 - 1) - the lesser the value the faster it will stop
    body.setMaxVelocityX(CONFIG.MAX_HORIZONTAL_VELOCITY) // sets max speed an object
  }

  reset() {
    if (this.#gameObject.body) {
      this.#gameObject.body.velocity.x = 0
      ;(this.#gameObject.body as Phaser.Physics.Arcade.Body).setAngularAcceleration(0)
    }
  }

  update() {
    if (this.#gameObject.body) {
      const leftIsDown = this.#inputComponent.leftIsDown
      const rightIsDown = this.#inputComponent.rightIsDown
      if (leftIsDown) {
        this.#gameObject.body.velocity.x -= this.#velocity
      }

      if (rightIsDown) {
        this.#gameObject.body.velocity.x += this.#velocity
      }

      if (!leftIsDown && !rightIsDown) {
        // we can also do 'this.#gameObject.body.velocity.x = 0' here
        ;(this.#gameObject.body as Phaser.Physics.Arcade.Body).setAngularAcceleration(0)
      }
    }
  }
}
