import { EventBusComponent } from '../events/event-bus-component'
import { HealthComponent } from '../health/health-component'
import { CUSTOM_EVENTS } from '../../event-types'

export class ColliderComponent {
  #healthComponent
  #eventBusComponent

  constructor(lifeComponent: HealthComponent, eventBusComponent: EventBusComponent) {
    this.#healthComponent = lifeComponent
    this.#eventBusComponent = eventBusComponent
  }

  collideWithEnemyShip() {
    if (this.#healthComponent.isDead) {
      return
    }

    this.#healthComponent.die()
  }

  collideWithEnemyProjectile() {
    if (this.#healthComponent.isDead) {
      return
    }

    this.#healthComponent.hit()
    this.#eventBusComponent.emit(CUSTOM_EVENTS.SHIP_HIT)
  }
}
