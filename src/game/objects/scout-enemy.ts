import { BotScoutInputComponent } from '../components/input/bot-scout-input-component'
import { VerticalMovementComponent } from '../components/movement/vertical-movement-component'
import { HorizontalMovementComponent } from '../components/movement/horizontal-movement-component'
import { HealthComponent } from '../components/health/health-component'
import { ColliderComponent } from '../components/collider/collider-component'
import { EventBusComponent } from '../components/events/event-bus-component'
import { CUSTOM_EVENTS } from '../event-types'
import CONFIG from '../config'
import { EnemyObject } from '../types'

export class ScoutEnemy extends Phaser.GameObjects.Container implements EnemyObject {
  #inputComponent!: BotScoutInputComponent
  #verticalMovementComponent!: VerticalMovementComponent
  #horizontalMovementComponent!: HorizontalMovementComponent
  #healthComponent!: HealthComponent
  #colliderComponent!: ColliderComponent
  #eventBusComponent!: EventBusComponent
  #shipEngineSprite: Phaser.GameObjects.Sprite
  #shipSprite: Phaser.GameObjects.Sprite
  #isInitialized: boolean

  constructor(scene: Phaser.Scene, x: number, y: number) {
    // initial positioning of player obj on the scene
    super(scene, x, y, [])

    this.#isInitialized = false
    // adding player obj to the scene and adding physics to it
    scene.add.existing(this)
    scene.physics.add.existing(this)
    const body = this.body as Phaser.Physics.Arcade.Body
    // setting physics boundries
    body.setSize(24, 24)
    body.setOffset(-12, -12)

    // adding player obj sprites
    this.#shipSprite = scene.add.sprite(0, 0, 'scout', 0)
    this.#shipEngineSprite = scene.add.sprite(0, 0, 'scout_engine').setFlipY(true)
    this.#shipEngineSprite.play('scout_engine')

    this.add([this.#shipEngineSprite, this.#shipSprite])

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

  get colliderComponent() {
    return this.#colliderComponent
  }

  get healthComponent() {
    return this.#healthComponent
  }

  init(eventBusComponent: EventBusComponent) {
    // initiating enemy components
    this.#eventBusComponent = eventBusComponent
    this.#inputComponent = new BotScoutInputComponent(this)
    this.#horizontalMovementComponent = new HorizontalMovementComponent(
      this,
      this.#inputComponent,
      CONFIG.ENEMY_SCOUT_HORIZONTAL_MOVEMENT_VELOCITY,
    )
    this.#verticalMovementComponent = new VerticalMovementComponent(
      this,
      this.#inputComponent,
      CONFIG.ENEMY_SCOUT_VERTICAL_MOVEMENT_VELOCITY,
    )
    this.#healthComponent = new HealthComponent(CONFIG.ENEMY_SCOUT_HEALTH)
    this.#colliderComponent = new ColliderComponent(this.#healthComponent)
    this.#eventBusComponent.emit(CUSTOM_EVENTS.ENEMY_INIT, this)

    this.#isInitialized = true
  }

  reset() {
    this.setActive(true)
    this.setVisible(true)
    this.healthComponent.reset()
    this.#inputComponent.startX = this.x
    this.#verticalMovementComponent.reset()
    this.#horizontalMovementComponent.reset()
  }

  update() {
    if (!this.active || !this.#isInitialized) {
      return
    }

    if (this.#healthComponent.isDead) {
      this.setActive(false)
      this.setVisible(false)
    }

    // on scene update calling inputs custom update methods
    this.#inputComponent.update()
    this.#verticalMovementComponent.update()
    this.#horizontalMovementComponent.update()
  }
}
