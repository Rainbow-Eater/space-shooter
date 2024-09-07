import { Player } from '../objects/player'
import { FighterEnemy } from '../objects/fighter-enemy'
import { ScoutEnemy } from '../objects/scout-enemy'
import { EnemySpawnerComponent } from '../components/spawners/enemy-spawner-component'
import { EventBusComponent } from '../components/events/event-bus-component'
import { Bullet } from '../types'
import CONFIG from '../config'
import { CUSTOM_EVENTS } from '../event-types'
import { EnemyDestroyedComponent } from '../components/spawners/enemy-destroyed-component'

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    const eventBusComponent = new EventBusComponent()
    const player = new Player(this)

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
  }
}

export default GameScene
