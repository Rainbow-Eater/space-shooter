import { ColliderComponent } from '../components/collider/collider-component'
import { EventBusComponent } from '../components/events/event-bus-component'
import { BotFighterInputComponent } from '../components/input/bot-fighter-input-component'
import { VerticalMovementComponent } from '../components/movement/vertical-movement-component'
import { HealthComponent } from '../components/health/health-component'
import { EnemyObject } from '../types'
import { CUSTOM_EVENTS } from '../event-types'
import CONFIG from '../config'

export class Heal extends Phaser.GameObjects.Container implements EnemyObject {
  #isInitialized: boolean
  #shipSprite
  #colliderComponent!: ColliderComponent
  #eventBusComponent!: EventBusComponent
  #inputComponent!: BotFighterInputComponent
  #verticalMovementComponent!: VerticalMovementComponent
  #healthComponent!: HealthComponent

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, [])

    this.#isInitialized = false
    // adding heal obj to the scene and adding physics to it
    scene.add.existing(this)
    scene.physics.add.existing(this)
    const body = this.body as Phaser.Physics.Arcade.Body
    // setting physics boundries
    body.setSize(24, 24)
    body.setOffset(-12, -12)

    // adding heal obj sprites
    this.#shipSprite = scene.add.sprite(0, 0, 'heal_animation', 0)
    this.#shipSprite.play('heal_animation')

    this.add(this.#shipSprite)
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

  init(eventBusComponent: EventBusComponent) {
    // initiating heal components
    this.#eventBusComponent = eventBusComponent
    this.#inputComponent = new BotFighterInputComponent()
    this.#verticalMovementComponent = new VerticalMovementComponent(
      this,
      this.#inputComponent,
      CONFIG.ENEMY_FIGHTER_MOVEMENT_VELOCITY,
    )
    this.#healthComponent = new HealthComponent(CONFIG.ENEMY_FIGHTER_HEALTH)
    this.#colliderComponent = new ColliderComponent(this.#healthComponent, this.#eventBusComponent)
    this.#eventBusComponent.emit(CUSTOM_EVENTS.ENEMY_INIT, this)

    this.#isInitialized = true
  }

  reset() {
    this.setActive(true)
    this.setVisible(true)
    this.#healthComponent.reset()
    this.#verticalMovementComponent.reset()
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
  }
}
