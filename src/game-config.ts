import Phaser from 'phaser'

export default {
  type: Phaser.CANVAS,
  parent: 'phaser-container',
  roundPixels: true,
  pixelArt: true,
  scale: {
    width: 450,
    height: 640,
    autoCenter: Phaser.Scale.NO_ZOOM,
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
  },
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: true,
    },
  },
}
