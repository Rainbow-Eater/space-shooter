import { ScoutEnemy } from '../../objects/scout-enemy'
import { FighterEnemy } from '../../objects/fighter-enemy'
import { EventBusComponent } from '../events/event-bus-component'

type Enemy = typeof ScoutEnemy | typeof FighterEnemy
interface SpawnConfig {
  interval: number
  spawnAt: number
}

interface EnemyObject extends Phaser.GameObjects.Sprite {
  init(eventBusComponent: EventBusComponent): void
  reset(): void
}

export class EnemySpawnerComponent {
  #scene
  #spawnInterval
  #spawnAt
  #group: Phaser.GameObjects.Group

  constructor(
    scene: Phaser.Scene,
    enemyClass: Enemy,
    spawnConfig: SpawnConfig,
    eventBusComponent: EventBusComponent,
  ) {
    this.#scene = scene

    this.#group = this.#scene.add.group({
      name: `${this.constructor.name}-${Phaser.Math.RND.uuid()}`,
      classType: enemyClass,
      runChildUpdate: true,
      createCallback: enemy => {
        if (this.#isEnemy(enemy)) {
          enemy.init(eventBusComponent)
        }
      },
    })

    this.#spawnInterval = spawnConfig.interval
    this.#spawnAt = spawnConfig.spawnAt

    this.#scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
    this.#scene.physics.world.on(Phaser.Physics.Arcade.Events.WORLD_STEP, this.worldStep, this)
    this.#scene.events.once(
      Phaser.Scenes.Events.DESTROY,
      () => {
        this.#scene.physics.world.off(Phaser.Physics.Arcade.Events.WORLD_STEP, this.worldStep, this)
      },
      this,
    )
  }

  get phaserGroup() {
    return this.#group
  }

  update(_: number, dt: number) {
    this.#spawnAt -= dt
    if (this.#spawnAt > 0) return

    const x = Phaser.Math.RND.between(30, this.#scene.scale.width - 30)
    const enemy = this.#group.get(x, -20)
    enemy.reset()
    this.#spawnAt = this.#spawnInterval
  }

  worldStep() {
    this.#group.getChildren().forEach(enemy => {
      if (!enemy.active) return
      const enemyObject = enemy as EnemyObject
      if (enemyObject.y > this.#scene.scale.height + 50) {
        enemyObject.setActive(false)
        enemyObject.setVisible(false)
      }
    })
  }

  #isEnemy(object: any): object is EnemyObject {
    return object && typeof object.init === 'function' && typeof object.reset === 'function'
  }
}
