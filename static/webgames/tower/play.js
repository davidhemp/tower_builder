var playState = {
    create: function() {
        mapsize = [32, 21];
        tilesize = 32;
        uiLower = (mapsize[1]+2)*tilesize;
        uiUpper = uiLower - tilesize;
        game.debug.text('game started', 20, 20);
        game.stage.backgroundColor = "0x52CAF2";
        // this.sky = game.add.sprite(0, 0, 'sky');
        this.ground = game.add.sprite(0, mapsize[1]*tilesize, 'ground');

        // For the moment I have just using this to represent buildings
        map = game.add.tilemap();
        bmd = game.make.bitmapData(tilesize * mapsize[0], tilesize * 1);

        var colors = Phaser.Color.HSVColorWheel();

        var i = 0;

        for (var y = 0; y < 1; y++)
        {
            for (var x = 0; x < mapsize[0]/4; x++)
            {
                bmd.rect(x * tilesize, y * tilesize, tilesize, tilesize, colors[i].rgba);
                i += 32;
            }
        }
        tileIncome = [10, 60, 320, 1900, 11520, 69100, 414720, 2488300]
        map.addTilesetImage('tiles', bmd)
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

        var tileStrip = tileSelector.create(0, uiUpper, bmd);
        tileStrip.inputEnabled = true;
        tileStrip.events.onInputDown.add(this.pickTile, this);
        tileStrip.events.onInputOver.add(this.tileDetails, this);

        selector = game.add.graphics();
        selector.lineStyle(2, 0x000000, 1);
        selector.drawRect(0, uiUpper, tilesize, tilesize);
    },

//--------Update functions----------

    update: function() {
    },

    updateMarker: function() {
        marker.x = layer.getTileX(game.input.activePointer.worldX) * tilesize;
        marker.y = layer.getTileY(game.input.activePointer.worldY) * tilesize;
    },


    placeTile: function() {
        function checkmoney(){
            if (cost < money){
                map.putTile(currentTile, marker.x/tilesize, marker.y/tilesize, layer);
                money -= cost;
                income += tileIncome[currentTile];
            } else {
                var warningText = game.add.text(60, 15, 'Not enough cash', {font: '30px', fill :'#ff0000'});
                game.time.events.add(1000, function() {
                    game.add.tween(warningText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);}, this);
            }
        }
        tile = map.getTile(marker.x/tilesize, marker.y/tilesize, 'layer', true)
        //Check to see if placeble. 1, nothing there already. 2, something below it. 3, enough money to buy
        if (tile.index < 0){
            var cost = tileIncome[currentTile]*7
            if (tile.y == mapsize[1]-1){
                checkmoney();
            } else {
                tilebelow = map.getTile(marker.x/tilesize,
                                        marker.y/tilesize + 1,
                                        'layer', true)
                if (tilebelow.index > -1){
                    checkmoney();
                }
            }
        }
        moneyLabel.text = "£" + this.scaleValue(money);
        incomeLabel.text = "£" + this.scaleValue(income);
    },

    pickTile: function () {
        currentTile = layer.getTileX(game.input.activePointer.worldX);
        if (marker.x < 8*tilesize){
            selector.x = marker.x
        }
        tileCostLabel.text = "Costs £" + this.scaleValue(tileIncome[selector.x/32]*7);
        tileIncomeLabel.text = "Generates £" + this.scaleValue(tileIncome[selector.x/32]) + " per day";

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
