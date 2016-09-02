var loadState = {
    preload: function() {
        game.stage.disableVisibilityChange = true;
        game.debug.text('loading', 20, 20);
        var loadingLabel = game.add.text(80, 150, 'loading...', {font: '30px', fill :'#ffffff'});
        // game.load.image('sky', '/static/webgames/tower/assets/sky.png');
        game.load.image('ground', '/static/webgames/tower/assets/ground.png');
        game.load.image('tiles', '/static/webgames/tower/assets/tiles.png');
        game.load.image('hourArm', '/static/webgames/tower/assets/hourarm.png');
        game.load.image('arrow1', '/static/webgames/tower/assets/arrow1.png');
        game.load.image('arrow2', '/static/webgames/tower/assets/arrow2.png');
        game.load.image('arrow3', '/static/webgames/tower/assets/arrow3.png');
        // game.load.image('rest1', '/static/webgames/tower/assets/rest1.png');
    },

    create: function() {
        // game.state.start('menu');
        game.state.start('play');
    }
};
