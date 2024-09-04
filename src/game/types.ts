import { EventBusComponent } from './components/events/event-bus-component'

export interface EnemyObject extends Phaser.GameObjects.GameObject {
  init(eventBusComponent: EventBusComponent): void
  reset(): void
}

export interface Bullet extends Phaser.Physics.Arcade.Image {
  state: number
}
