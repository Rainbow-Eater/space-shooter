import { Player } from '../objects/player'
import { FighterEnemy } from '../objects/fighter-enemy'
import { ScoutEnemy } from '../objects/scout-enemy'
import { EnemySpawnerComponent } from '../components/spawners/enemy-spawner-component'
import { EventBusComponent } from '../components/events/event-bus-component'
import { Bullet } from '../types'
import { EnemyDestroyedComponent } from '../components/spawners/enemy-destroyed-component'
import { Score } from '../objects/ui/score'
import { Lives } from '../objects/ui/lives'
import { CUSTOM_EVENTS } from '../event-types'
import CONFIG from '../config'

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    this.add
      .sprite(0, 0, 'bg1', 0)
      .setOrigin(0, 1)
      .setAlpha(0.7)
      .setAngle(90)
      .setScale(1, 1.25)
      .play('bg1')
    this.add
      .sprite(0, 0, 'bg2', 0)
      .setOrigin(0, 1)
      .setAlpha(0.7)
      .setAngle(90)
      .setScale(1, 1.25)
      .play('bg2')
    this.add
      .sprite(0, 0, 'bg3', 0)
      .setOrigin(0, 1)
      .setAlpha(0.7)
      .setAngle(90)
      .setScale(1, 1.25)
      .play('bg3')

    const eventBusComponent = new EventBusComponent()
    const player = new Player(this, eventBusComponent)

    // +++ Enemy spawners +++
    const scoutSpawner = new EnemySpawnerComponent(
      this,
      ScoutEnemy,
      {
        interval: CONFIG.ENEMY_SCOUT_GROUP_SPAWN_INTERVAL,
        spawnAt: CONFIG.ENEMY_SCOUT_GROUP_SPAWN_AT,
      },
      eventBusComponent,
    )
    const fighterSpawner = new EnemySpawnerComponent(
      this,
      FighterEnemy,
      {
        interval: CONFIG.ENEMY_FIGHTER_GROUP_SPAWN_INTERVAL,
        spawnAt: CONFIG.ENEMY_FIGHTER_GROUP_SPAWN_AT,
      },
      eventBusComponent,
    )

    new EnemyDestroyedComponent(this, eventBusComponent)

    // +++ Adding collision between player and enemy ships +++
    this.physics.add.overlap(
      player,
      scoutSpawner.phaserGroup,
      (playerGameObject, enemyGameObject) => {
        const playerWithCollider = playerGameObject as Player
        const enemyWithCollider = enemyGameObject as ScoutEnemy
        if (!playerWithCollider.active || !enemyWithCollider.active) return

        playerWithCollider.colliderComponent.collideWithEnemyShip()
        enemyWithCollider.colliderComponent.collideWithEnemyShip()
      },
    )
    this.physics.add.overlap(
      player,
      fighterSpawner.phaserGroup,
      (playerGameObject, enemyGameObject) => {
        const playerWithCollider = playerGameObject as Player
        const enemyWithCollider = enemyGameObject as FighterEnemy
        if (!playerWithCollider.active || !enemyWithCollider.active) return

        playerWithCollider.colliderComponent.collideWithEnemyShip()
        enemyWithCollider.colliderComponent.collideWithEnemyShip()
      },
    )

    // +++ Adding collision between ships and projectiles +++
    eventBusComponent.on(CUSTOM_EVENTS.ENEMY_INIT, (gameObject: FighterEnemy | ScoutEnemy) => {
      if (
        gameObject.constructor.name !== 'FighterEnemy' ||
        !('weaponGameObjectGroup' in gameObject)
      ) {
        return
      }

      this.physics.add.overlap(
        player,
        gameObject.weaponGameObjectGroup,
        (playerGameObject, projectileGameObject) => {
          const playerWithCollider = playerGameObject as Player
          const projectileWithCollier = projectileGameObject as Bullet
          if (!playerWithCollider.active || !projectileWithCollier.active) return

          gameObject.weaponComponent.destroyBullet(projectileWithCollier)
          playerWithCollider.colliderComponent.collideWithEnemyProjectile()
        },
      )
    })

    this.physics.add.overlap(
      scoutSpawner.phaserGroup,
      player.weaponGameObjectGroup,
      (enemyGameObject, projectileGameObject) => {
        const enemyWithCollider = enemyGameObject as ScoutEnemy
        const projectileWithCollier = projectileGameObject as Bullet
        if (!enemyWithCollider.active || !projectileWithCollier.active) return

        player.weaponComponent.destroyBullet(projectileWithCollier)
        enemyWithCollider.colliderComponent.collideWithEnemyProjectile()
      },
    )

    this.physics.add.overlap(
      fighterSpawner.phaserGroup,
      player.weaponGameObjectGroup,
      (enemyGameObject, projectileGameObject) => {
        const enemyWithCollider = enemyGameObject as FighterEnemy
        const projectileWithCollier = projectileGameObject as Bullet
        if (!enemyWithCollider.active || !projectileWithCollier.active) return

        player.weaponComponent.destroyBullet(projectileWithCollier)
        enemyWithCollider.colliderComponent.collideWithEnemyProjectile()
      },
    )

    new Score(this, eventBusComponent)
    new Lives(this, eventBusComponent)
  }
}

export default GameScene
