import { useEffect } from 'react'
import Phaser from 'phaser'

import BootScene from './scenes/boot-scene'
import PreloadScene from './scenes/preload-scene'
import GameScene from './scenes/game-scene'

interface GameProps {
  config: Phaser.Types.Core.GameConfig
}

const Game = ({ config }: GameProps) => {
  useEffect(() => {
    const configWithScenes = {
      ...config,
      scene: [BootScene, PreloadScene, GameScene],
      start: BootScene,
    }
    const game = new Phaser.Game(configWithScenes)

    return () => {
      game.destroy(true)
    }
  }, [])

  return <div id="phaser-container" />
}

export default Game
