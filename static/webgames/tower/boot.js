var bootState = {
    create: function () {
        game.debug.text('booting', 20, 20);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        Logger.debug('Phaser engine Booted')
        game.state.start('load');
    }
};
