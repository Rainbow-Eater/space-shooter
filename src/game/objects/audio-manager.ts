import { EventBusComponent } from '../components/events/event-bus-component'
import { CUSTOM_EVENTS } from '../event-types'

export class AudioManager {
  #scene
  #eventBusComponent

  constructor(scene: Phaser.Scene, eventBusComponent: EventBusComponent) {
    this.#scene = scene
    this.#eventBusComponent = eventBusComponent

    this.#scene.sound.play('bg', {
      volume: 0.2,
      loop: true,
    })

    this.#eventBusComponent.on(CUSTOM_EVENTS.ENEMY_DESTROYED, () => {
      this.#scene.sound.play('explosion', {
        volume: 0.5,
      })
    })

    this.#eventBusComponent.on(CUSTOM_EVENTS.PLAYER_DESTROYED, () => {
      this.#scene.sound.play('explosion', {
        volume: 0.5,
      })
    })

    this.#eventBusComponent.on(CUSTOM_EVENTS.SHIP_HIT, () => {
      this.#scene.sound.play('hit', {
        volume: 0.4,
      })
    })

    this.#eventBusComponent.on(CUSTOM_EVENTS.SHIP_SHOOT, () => {
      this.#scene.sound.play('shot1', {
        volume: 0.05,
      })
    })
  }
}
