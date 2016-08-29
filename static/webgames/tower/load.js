var loadState = {
    preload: function() {
        game.stage.disableVisibilityChange = true;
        game.debug.text('loading', 20, 20);
        var loadingLabel = game.add.text(80, 150, 'loading...', {font: '30px', fill :'#ffffff'});
        // game.load.image('sky', '/static/webgames/tower/assets/sky.png');
        game.load.image('ground', '/static/webgames/tower/assets/ground.png');
        game.load.image('tiles', '/static/webgames/tower/assets/tiles.png');
    },

    create: function() {
        // game.state.start('menu');
        game.state.start('play');
    }
};
