import { InputComponent } from '../input/input-component'
import { Bullet } from '../../types'

interface BulletConfig {
  maxCount: number
  yOffset: number
  interval: number
  speed: number
  lifespan: number
  flipY: boolean
}

export class WeaponComponent {
  #gameObject
  #inputComponent
  #bulletGroup
  #bulletConfig
  #fireBulletInterval

  constructor(
    gameObject: Phaser.GameObjects.Container,
    inputComponent: InputComponent,
    bulletConfig: BulletConfig,
  ) {
    this.#gameObject = gameObject
    this.#inputComponent = inputComponent
    this.#bulletConfig = bulletConfig
    this.#fireBulletInterval = 0

    this.#bulletGroup = this.#gameObject.scene.physics.add.group({
      name: `bullets-${Phaser.Math.RND.uuid()}`,
      enable: false,
    })

    this.#bulletGroup.createMultiple({
      key: 'bullet',
      quantity: this.#bulletConfig.maxCount,
      active: false,
      visible: false,
    })

    this.#gameObject.scene.physics.world.on(
      Phaser.Physics.Arcade.Events.WORLD_STEP,
      this.worldStep,
      this,
    )
    this.#gameObject.once(
      Phaser.GameObjects.Events.DESTROY,
      () => {
        this.#gameObject.scene.physics.world.off(
          Phaser.Physics.Arcade.Events.WORLD_STEP,
          this.worldStep,
          this,
        )
      },
      this,
    )
  }

  get bulletGroup() {
    return this.#bulletGroup
  }

  update(dt: number) {
    this.#fireBulletInterval -= dt
    if (this.#fireBulletInterval > 0) return

    if (this.#inputComponent.shootIsDown) {
      const bullet = this.#bulletGroup.getFirstDead()
      if (!bullet) return

      const x = this.#gameObject.x
      const y = this.#gameObject.y + this.#bulletConfig.yOffset
      bullet.enableBody(true, x, y, true, true)
      bullet.body.velocity.y -= this.#bulletConfig.speed
      bullet.setState(this.#bulletConfig.lifespan)
      bullet.play('bullet')
      bullet.setScale(0.7)
      bullet.body.setSize(14, 18)
      bullet.setFlipY(this.#bulletConfig.flipY)

      this.#fireBulletInterval = this.#bulletConfig.interval
    }
  }

  worldStep(delta: number) {
    this.#bulletGroup.getChildren().forEach((bullet: Phaser.GameObjects.GameObject) => {
      const arcadeBullet = bullet as Bullet
      if (!arcadeBullet.active) return

      arcadeBullet.state -= delta
      if (arcadeBullet.state <= 0) {
        arcadeBullet.disableBody(true, true)
      }
    })
  }

  destroyBullet(bullet: Bullet) {
    bullet.setState(0)
  }
}
