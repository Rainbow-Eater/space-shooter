import { ColliderComponent } from '../components/collider/collider-component'
import { HealthComponent } from '../components/health/health-component'
import { KeyboardInputComponent } from '../components/input/keyboard-input-component'
import { HorizontalMovementComponent } from '../components/movement/horizontal-movement-component'
import { WeaponComponent } from '../components/weapons/weapon-component'
// import { VerticalMovementComponent } from '../components/movement/vertical-movement-component'
import CONFIG from '../config'

export class Player extends Phaser.GameObjects.Container {
  #keyboardInputComponent
  #weaponComponent
  #horizontalMovementComponent
  // #verticalMovementComponent
  #healthComponent: HealthComponent
  #colliderComponent: ColliderComponent
  #shipSprite: Phaser.GameObjects.Sprite
  #shipEngineSprite: Phaser.GameObjects.Sprite
  #shipEngineThrusterSprite: Phaser.GameObjects.Sprite

  constructor(scene: Phaser.Scene) {
    // initial positioning of player obj on the scene
    super(scene, scene.scale.width / 2, scene.scale.height - 32, [])

    // adding player obj to the scene and adding physics to it
    scene.add.existing(this)
    scene.physics.add.existing(this)
    const body = this.body as Phaser.Physics.Arcade.Body
    // setting physics boundries
    body.setSize(24, 24)
    body.setOffset(-12, -12)
    body.setCollideWorldBounds(true)
    this.setDepth(2) // basically z-index

    // adding player obj sprites
    this.#shipSprite = scene.add.sprite(0, 0, 'ship')
    this.#shipEngineSprite = scene.add.sprite(0, 2, 'ship_engine')
    this.#shipEngineThrusterSprite = scene.add.sprite(0, 2, 'ship_engine_thruster')
    this.#shipEngineThrusterSprite.play('ship_engine_thruster')

    this.add([this.#shipEngineThrusterSprite, this.#shipEngineSprite, this.#shipSprite])

    // adding keyboard movements
    this.#keyboardInputComponent = new KeyboardInputComponent(this.scene)
    this.#horizontalMovementComponent = new HorizontalMovementComponent(
      this,
      this.#keyboardInputComponent,
      CONFIG.PLAYER_MOVEMENT_VELOCITY,
    )
    this.#weaponComponent = new WeaponComponent(this, this.#keyboardInputComponent, {
      maxCount: CONFIG.PLAYER_BULLET_MAX_COUNT,
      yOffset: -20,
      interval: CONFIG.PLAYER_BULLET_INTERVAL,
      speed: CONFIG.PLAYER_BULLET_SPEED,
      lifespan: CONFIG.PLAYER_BULLET_LIFESPAN,
      flipY: false,
    })
    this.#healthComponent = new HealthComponent(CONFIG.PLAYER_HEALTH)
    this.#colliderComponent = new ColliderComponent(this.#healthComponent)
    // this.#verticalMovementComponent = new VerticalMovementComponent(
    //   this,
    //   this.#keyboardInputComponent,
    //   CONFIG.PLAYER_MOVEMENT_VELOCITY,
    // )
    //

    // TODO Do this

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

  get weaponGameObjectGroup() {
    return this.#weaponComponent.bulletGroup
  }

  get weaponComponent() {
    return this.#weaponComponent
  }

  get colliderComponent() {
    return this.#colliderComponent
  }

  get healthComponent() {
    return this.#healthComponent
  }

  #hide() {
    this.setActive(false)
    this.setVisible(false)
    this.#shipEngineSprite.setVisible(false)
    this.#shipEngineThrusterSprite.setVisible(false)
    this.#keyboardInputComponent.lockInput = true
  }

  update(_: number, dt: number) {
    if (!this.active) {
      return
    }

    if (this.#healthComponent.isDead) {
      this.#hide()
      this.setVisible(true)
      this.#shipSprite.play({
        key: 'explosion',
      })
      return
    }

    this.#shipSprite.setFrame((CONFIG.PLAYER_HEALTH - this.#healthComponent.life).toString(10))
    // on scene update calling inputs custom update methods
    this.#keyboardInputComponent.update()
    this.#horizontalMovementComponent.update()
    this.#weaponComponent.update(dt)
    // this.#verticalMovementComponent.update()
  }
}
