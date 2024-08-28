import { BotFighterInputComponent } from '../components/input/bot-fighter-input-component'
import { VerticalMovementComponent } from '../components/movement/vertical-movement-component'
import { WeaponComponent } from '../components/weapons/weapon-component'
import CONFIG from '../config'

export class FighterEnemy extends Phaser.GameObjects.Container {
  #inputComponent
  #weaponComponent
  #verticalMovementComponent
  #shipSprite: Phaser.GameObjects.Sprite
  #shipEngineSprite: Phaser.GameObjects.Sprite

  constructor(scene: Phaser.Scene, x: number, y: number) {
    // initial positioning of player obj on the scene
    super(scene, x, y, [])

    // adding player obj to the scene and adding physics to it
    scene.add.existing(this)
    scene.physics.add.existing(this)
    const body = this.body as Phaser.Physics.Arcade.Body
    // setting physics boundries
    body.setSize(24, 24)
    body.setOffset(-12, -12)

    // adding player obj sprites
    this.#shipSprite = scene.add.sprite(0, 0, 'fighter', 0)
    this.#shipEngineSprite = scene.add.sprite(0, 0, 'fighter_engine').setFlipY(true)
    this.#shipEngineSprite.play('fighter_engine')

    this.add([this.#shipEngineSprite, this.#shipSprite])

    // adding keyboard movements
    this.#inputComponent = new BotFighterInputComponent()
    this.#verticalMovementComponent = new VerticalMovementComponent(
      this,
      this.#inputComponent,
      CONFIG.ENEMY_FIGHTER_MOVEMENT_VELOCITY,
    )
    this.#weaponComponent = new WeaponComponent(this, this.#inputComponent, {
      maxCount: CONFIG.ENEMY_FIGHTER_BULLET_MAX_COUNT,
      interval: CONFIG.ENEMY_FIGHTER_BULLET_INTERVAL,
      speed: CONFIG.ENEMY_FIGHTER_BULLET_SPEED,
      lifespan: CONFIG.ENEMY_FIGHTER_BULLET_LIFESPAN,
      yOffset: 10,
      flipY: true,
    })

    // we are listening to update event of the scene and run custom update method
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
    this.once(
      Phaser.GameObjects.Events.DESTROY,
      () => {
        this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this)
      },
      this,
    )
  }

  update(_: number, dt: number) {
    // on scene update calling inputs custom update methods
    this.#inputComponent.update()
    this.#verticalMovementComponent.update()
    this.#weaponComponent.update(dt)
  }
}
