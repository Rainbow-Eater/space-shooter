import { EventBusComponent } from '../../components/events/event-bus-component'
import CONFIG from '../../config'
import { CUSTOM_EVENTS } from '../../event-types'
import { FighterEnemy } from '../fighter-enemy'
import { ScoutEnemy } from '../scout-enemy'

type Enemy = FighterEnemy | ScoutEnemy

const ENEMY_SCORES = {
  ScoutEnemy: CONFIG.ENEMY_SCOUT_SCORE,
  FighterEnemy: CONFIG.ENEMY_FIGHTER_SCORE,
}

export class Score extends Phaser.GameObjects.Text {
  #eventBusComponent
  #score

  constructor(scene: Phaser.Scene, eventBusComponent: EventBusComponent) {
    super(scene, scene.scale.width / 2, 20, '0', {
      fontSize: '24px',
      color: '#ff2f66',
    })

    this.scene.add.existing(this)
    this.#eventBusComponent = eventBusComponent
    this.#score = 0
    this.setOrigin(0.5)

    this.#eventBusComponent.on(CUSTOM_EVENTS.ENEMY_DESTROYED, (enemy: Enemy) => {
      const enemyType = enemy.constructor.name as keyof typeof ENEMY_SCORES
      this.#score += ENEMY_SCORES[enemyType]
      this.setText(this.#score.toString(10))
    })
  }
}
