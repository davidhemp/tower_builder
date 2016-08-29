var playState = {
    create: function() {
        mapsize = [32, 21];
        tilesize = 32;
        uiLower = (mapsize[1]+2)*tilesize;
        uiUpper = uiLower - tilesize;
        game.stage.backgroundColor = "0x52CAF2";
        // this.sky = game.add.sprite(0, 0, 'sky');
        this.ground = game.add.sprite(0, mapsize[1]*tilesize, 'ground');

        // For the moment I have just using this to represent buildings
        map = game.add.tilemap();

        map.addTilesetImage('tiles')
        layer = map.create('layer', mapsize[0], mapsize[1], tilesize, tilesize );
        layer.resizeWorld();
        this.createTileSelector();
        currentTile = 0;

        marker = game.add.graphics();
        marker.lineStyle(2, 0x000000, 0.5);
        marker.drawRect(0, 0, tilesize, tilesize);
        game.input.addMoveCallback(this.updateMarker, this);
        layer.inputEnabled = true;
        layer.events.onInputDown.add(this.placeTile, this);

        money = 1000000;
        game.add.text(700, uiUpper, "Money", {font: '20px'});
        moneyLabel = game.add.text(700, uiLower, "£" + this.scaleValue(money), {font: '20px'});

        tileIncome = [20, 100, 300];
        tileCost = [100, 3000, 10000];
        income = 0;
        game.add.text(800, uiUpper, "Income", {font: '20px'});
        incomeLabel = game.add.text(800, uiLower, this.scaleValue(income),  {font: '20px'});

        reputation = 0;
        game.add.text(900, uiUpper, "Reputation", {font: '20px'});
        reputationLabel = game.add.text(900, uiLower, reputation,  {font: '20px'});

        tileCostLabel = game.add.text(260, uiUpper, ' ', {font: '20px'});
        tileIncomeLabel = game.add.text(260, uiLower, ' ', {font: '20px'});

        game.time.events.loop(Phaser.Timer.SECOND*10, this.newDay, this);
    },

    createTileSelector: function () {

        //  Our tile selection window
        var tileSelector = game.add.group();

        var tileSelectorBackground = game.make.graphics();
        tileSelectorBackground.beginFill("0xaaaaaa", 1);
        tileSelectorBackground.drawRect(0, uiUpper, 1024, tilesize*2);
        tileSelectorBackground.endFill();

        tileSelector.add(tileSelectorBackground);

        var tileStrip = tileSelector.create(0, uiUpper, 'tiles');
        tileStrip.inputEnabled = true;
        tileStrip.events.onInputDown.add(this.pickTile, this);
        tileStrip.events.onInputOver.add(this.tileDetails, this);

        selector1 = game.add.graphics();
        selector1.lineStyle(2, 0x000000, 1);
        selector1.drawRect(0, uiUpper, tilesize, tilesize);

        selector2 = game.add.graphics();
        selector2.lineStyle(2, 0x000000, 1);
        selector2.drawRect(tilesize, uiUpper, tilesize*2, tilesize);
        selector2.alpha = 0;

        selector3 = game.add.graphics();
        selector3.lineStyle(2, 0x000000, 1);
        selector3.drawRect(tilesize*3, uiUpper, tilesize*3, tilesize);
        selector3.alpha = 0;
    },

//--------Update functions----------

    update: function() {
    },

    updateMarker: function() {
        var x = layer.getTileX(game.input.activePointer.worldX) * tilesize;
        var y = layer.getTileY(game.input.activePointer.worldY) * tilesize;
        if (y < (mapsize[1])*tilesize || (x < tilesize*6 && y > (mapsize[1])*tilesize)){
            marker.x = x;
            marker.y = y;
        }
    },


    placeTile: function() {
        function checkmoney(){
            if (cost < money){
                for (i = 0; i <= currentTile; i++){
                    map.putTile(currentTile+i, (marker.x/tilesize)+i, marker.y/tilesize, layer);
                }
                money -= cost;
                income += tileIncome[currentTile];
            } else {
                var warningText = game.add.text(20, 15, 'Not enough cash', {font: '20px', fill :'#ff0000'});
                game.time.events.add(1000, function() {game.add.tween(warningText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);}, this);
            }
        }
        tile = map.getTile(marker.x/tilesize, marker.y/tilesize, 'layer', true)
        //Check to see if placeble. 1, nothing there already. 2, something below it. 3, enough money to buy
        if (tile.index < 0){
            var cost = tileCost[currentTile];
            if (tile.y == mapsize[1]-1){
                checkmoney();
            } else {
                var build = true;
                for (i = 0; i <= currentTile; i++){
                    tilebelow = map.getTile(marker.x/tilesize + i,
                                            marker.y/tilesize + 1,
                                            'layer', true);
                    if (tilebelow.index < 0){
                        build = false;
                    }
                }
                if (build == true){
                    checkmoney();
                } else {
                    var warningText = game.add.text(20, 15, 'No enough support below', {font: '20px', fill :'#ff0000'});
                    game.time.events.add(1000, function() {game.add.tween(warningText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);}, this);
                }
            }
        }
        moneyLabel.text = "£" + this.scaleValue(money);
        incomeLabel.text = "£" + this.scaleValue(income);
    },

    pickTile: function () {
        currentTile = layer.getTileX(game.input.activePointer.worldX);
        if (currentTile < 1){
            selector1.alpha = 1;
            selector2.alpha = 0;
            selector3.alpha = 0;
        } else if (currentTile < 3){
            selector1.alpha = 0;
            selector2.alpha = 1;
            selector3.alpha = 0;
            currentTile = 1;
        } else if (currentTile < 6){
            selector1.alpha = 0;
            selector2.alpha = 0;
            selector3.alpha = 1;
            currentTile = 2;
        }
        tileCostLabel.text = "Costs £" + this.scaleValue(tileCost[currentTile]);
        tileIncomeLabel.text = "Generates £" + this.scaleValue(tileIncome[currentTile]) + " per day";
    },

    tileDetails: function() {
        tileDetailLabel.text = tileIncome[marker.x];
    },

    newDay: function() {
            money += income;
            moneyLabel.text = "£" + this.scaleValue(money);
            incomeLabel.text = "£" + this.scaleValue(income);
    },

    scaleValue: function(value){
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
}
