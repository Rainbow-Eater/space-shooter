import { Player } from '../objects/player'
// import { ScoutEnemy } from '../objects/scout-enemy'
import { FighterEnemy } from '../objects/fighter-enemy'

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    const player = new Player(this)
    // const enemy = new ScoutEnemy(this, this.scale.width / 2, 0)
    const enemy = new FighterEnemy(this, this.scale.width / 2, 0)

    this.physics.add.overlap(player, enemy, (playerGameObject, enemyGameObject) => {
      const playerWithCollider = playerGameObject as Player

      const enemyWithCollider = enemyGameObject as FighterEnemy
      playerWithCollider.colliderComponent.collideWithEnemyShip()
      enemyWithCollider.colliderComponent.collideWithEnemyShip()
    })

    this.physics.add.overlap(
      player,
      enemy.weaponGameObjectGroup,
      (playerGameObject, projectileGameObject) => {
        const playerWithCollider = playerGameObject as Player

        enemy.weaponComponent.destroyBullet(projectileGameObject)
        playerWithCollider.colliderComponent.collideWithEnemyProjectile()
      },
    )

    this.physics.add.overlap(
      enemy,
      player.weaponGameObjectGroup,
      (enemyGameObject, projectileGameObject) => {
        const enemyWithCollider = enemyGameObject as FighterEnemy

        player.weaponComponent.destroyBullet(projectileGameObject)
        enemyWithCollider.colliderComponent.collideWithEnemyProjectile()
      },
    )
  }

  update() {}
}

export default GameScene
