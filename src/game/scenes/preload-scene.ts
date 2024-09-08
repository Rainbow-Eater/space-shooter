export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.pack('assets_pack', '/data/assets.json')
  }

  create() {
    this.#createAnimations()
    this.scene.start('GameScene')
  }

  #createAnimations() {
    const animations = this.cache.json.get('animations_json')

    for (const animation of animations) {
      const frames = animation.frameRate
        ? this.anims.generateFrameNumbers(animation.assetKey, { frames: animation.frames })
        : this.anims.generateFrameNumbers(animation.assetKey)

      this.anims.create({
        key: animation.key,
        frames,
        frameRate: animation.frameRate,
        repeat: animation.repeat,
      })
    }
  }
}

export default PreloadScene
