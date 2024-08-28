import { Player } from '../objects/player'
import { ScoutEnemy } from '../objects/scout-enemy'
import { FighterEnemy } from '../objects/fighter-enemy'

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }

  preload() {}

  create() {
    console.log('game scene')
    new Player(this)
    // new ScoutEnemy(this, this.scale.width / 2, 0)
    new FighterEnemy(this, this.scale.width / 2, 0)
    const a = [1, 2, 3]
  }

  update() {}
}

export default GameScene
