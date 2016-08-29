var menuState = {
    create: function() {
        game.debug.text('menu screen', 20, 20);
        var nameLabel = game.add.text(80, 80, 'Tower Builder',
                                    {font:'50px Arial', fill:'#ffffff'});
        var enterkey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterkey.onDown.addOnce(this.start, this);

    },

    start: function() {
        game.state.start('play');
    }
};
