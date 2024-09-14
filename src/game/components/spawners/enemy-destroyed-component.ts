import { EventBusComponent } from '../events/event-bus-component'
import { CUSTOM_EVENTS } from '../../event-types'

interface Enemy extends Phaser.GameObjects.GameObject {
  shipAsset: string
  shipDestroyedAnimationKey: string
  x: number
  y: number
}

export class EnemyDestroyedComponent {
  #scene
  #group
  #eventBusComponent

  constructor(scene: Phaser.Scene, eventBusComponent: EventBusComponent) {
    this.#scene = scene
    this.#eventBusComponent = eventBusComponent

    this.#group = this.#scene.add.group({
      name: `${this.constructor.name}-${Phaser.Math.RND.uuid()}`,
    })

    this.#eventBusComponent.on(CUSTOM_EVENTS.ENEMY_DESTROYED, (enemy: Enemy) => {
      const gameObject = this.#group.get(enemy.x, enemy.y, enemy.shipAsset, 0)
      gameObject.play({
        key: enemy.shipDestroyedAnimationKey,
      })
    })
  }
}
