var game = new Phaser.Game(1248, 928, Phaser.AUTO, 'gameDiv');

function addHexColor(c1, c2) {
  var hexStr = (parseInt(c1, 16) + parseInt(c2, 16)).toString(16);
  while (hexStr.length < 6) { hexStr = '0' + hexStr; } // Zero pad.
  return hexStr;
}

function scaleValue(value){
    if (value >= 1000000){
        value = game.math.roundTo(value/1000000, -2);
        // value = value + "m";
        unit = "m"
    } else if (value > 1000){
        value = game.math.roundTo(value / 1000, -2);
        // value = value + "k";
        unit = "k"
    } else{
        unit = ""
    }
    return value + unit;
}

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);

game.state.start('boot');
