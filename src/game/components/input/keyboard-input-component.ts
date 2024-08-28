import { InputComponent } from './input-component'

export class KeyboardInputComponent extends InputComponent {
  #inputLocked: boolean
  #cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined
  #wKey: Phaser.Input.Keyboard.Key | undefined
  #aKey: Phaser.Input.Keyboard.Key | undefined
  #sKey: Phaser.Input.Keyboard.Key | undefined
  #dKey: Phaser.Input.Keyboard.Key | undefined

  constructor(scene: Phaser.Scene) {
    super()
    this.#inputLocked = false
    this.#cursorKeys = scene.input.keyboard?.createCursorKeys()
    this.#wKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.#aKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.#sKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.#dKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D)
  }

  set lockInput(val: boolean) {
    this.#inputLocked = val
  }

  update() {
    if (this.#inputLocked) {
      this.reset()
      return
    }

    this._up = this.#cursorKeys?.up.isDown || this.#wKey?.isDown
    this._down = this.#cursorKeys?.down.isDown || this.#sKey?.isDown
    this._right = this.#cursorKeys?.right.isDown || this.#dKey?.isDown
    this._left = this.#cursorKeys?.left.isDown || this.#aKey?.isDown
    this._shoot = this.#cursorKeys?.space.isDown
  }
}
