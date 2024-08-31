import { HealthComponent } from '../health/health-component'

export class ColliderComponent {
  #healthComponent

  constructor(lifeComponent: HealthComponent) {
    this.#healthComponent = lifeComponent
  }

  collideWithEnemyShip() {
    console.log('collide happened')
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
  }
}
