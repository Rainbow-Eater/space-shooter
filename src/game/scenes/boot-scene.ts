export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  preload() {
    this.load.json('animations_json', '/data/animations.json')
  }

  create() {
    console.log('boot scene')
    this.scene.start('PreloadScene')
  }
}

export default BootScene
