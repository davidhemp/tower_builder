var playState = {
    create: function() {
        mapsize = [38, 25];
        tilesize = 32;
        uiLower = (mapsize[1]+3)*tilesize;
        uiUpper = uiLower - tilesize;
        bgc = [0, 0, 0, 1]
        game.stage.backgroundColor = 'rgba(' + bgc[0] + ','+ bgc[1] + ',' + bgc[2] + ',' + bgc[3] + ')';
        this.ground = game.add.sprite(0, (mapsize[1])*tilesize, 'ground');

        map = game.add.tilemap();
        map.addTilesetImage('tiles')
        layer = map.create('layer', mapsize[0], mapsize[1], tilesize, tilesize );
        layer.resizeWorld();
        this.createTileSelector();
        currentTile = 0;

        marker = game.add.graphics();
        marker.lineStyle(2, 0x888888, 1);
        marker.drawRect(0, 0, tilesize, tilesize);
        game.input.addMoveCallback(this.updateMarker, this);
        layer.inputEnabled = true;
        layer.events.onInputDown.add(this.placeTile, this);

        var style = {font: '20px', fill :'#000000'}
        money = 100000;
        game.add.text(950, uiUpper, "Money", style);
        moneyLabel = game.add.text(950, uiLower, "£" + scaleValue(money), style);

        tileIncome = [20, 100, null, 300, null, null, 1000];
        tileCost = [100, 3000, null, 10000, null, null, 10000];
        tileLength = [0,1, null ,2, null, null, 2];
        income = 0;
        game.add.text(1050, uiUpper, "Income", style);
        incomeLabel = game.add.text(1050, uiLower, scaleValue(income),  style);

        reputation = 0;
        game.add.text(1150, uiUpper, "Reputation", style);
        reputationLabel = game.add.text(1150, uiLower, reputation,  style);

        tileCostLabel = game.add.text(260, uiUpper, ' ', style);
        tileIncomeLabel = game.add.text(260, uiLower, ' ', style);

        dayNightCycle = 0;

        var clock = game.add.graphics();
        clock.lineStyle(2, 0x000000, 1);
        clock.beginFill(0xFFFFFF, 1);
        clock.drawCircle(1155, 90, 140);
        clock.endFill();

        game.add.text(1145, 25, '12', {font: "20px"});
        game.add.text(1150, 135, '6', {font: "20px"});
        game.add.text(1210, 80, '3', {font: "20px"});
        game.add.text(1090, 80, '9', {font: "20px"});
        ampm = game.add.text(1143, 50, "am", {font: "20px"});

        hourArm = game.add.sprite(1155, 90, 'hourArm');
        hourArm.anchor.setTo(0.5, 0.9);
        hourArm.angle += 225;

        tickSpeed = 1;
        var speedOne = game.add.sprite(1085, 170, 'arrow1');
        speedOne.inputEnabled = true;
        speedOne.events.onInputDown.add(function f(){tickSpeed=1;}, this);

        var speedTwo = game.add.sprite(1115, 170, 'arrow2');
        speedTwo.inputEnabled = true;
        speedTwo.events.onInputDown.add(function f(){tickSpeed=2;}, this);

        var speedThree = game.add.sprite(1165, 170, 'arrow3');
        speedThree.inputEnabled = true;
        speedThree.events.onInputDown.add(function f(){tickSpeed=3;}, this);

        debugMode = true;
        var debugKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        debugKey.onDown.add(function f(){debugMode = !debugMode}, this);


    },

    createTileSelector: function () {

        //  Our tile selection window

        var buildMenuBackground = game.make.graphics();
        buildMenuBackground.beginFill("0xaaaaaa", 1);
        buildMenuBackground.drawRect(0, uiUpper, 1248, tilesize*2);
        buildMenuBackground.endFill();

        var categorySelector = game.add.group();
        categorySelector.add(buildMenuBackground);

        var categoryStrip = categorySelector.create(0, uiUpper, 'buildmenu');
        categoryStrip.inputEnabled = true;
        categoryStrip.events.onInputDown.add(this.pickCategory, this);

        // var tileSelectorBackground = game.make.graphics();
        // tileSelectorBackground.beginFill("0xFF0000", 1);
        // tileSelectorBackground.drawRect(tilesize*0.2, uiUpper-tilesize*1.2, tilesize*6.6, tilesize*1.1);
        // tileSelectorBackground.endFill();
        //
        flatGroup = game.add.group();
        // flatGroup.add(tileSelectorBackground);
        //
        var flat1 = flatGroup.create(tilesize*0.3, uiUpper-tilesize*1.15, 'flat1');
        var flat2 = flatGroup.create(tilesize*1.45, uiUpper-tilesize*1.15, 'flat2');
        var flat3 = flatGroup.create(tilesize*3.6, uiUpper-tilesize*1.15, 'flat3');
        flat1.inputEnabled = true;
        flat1.events.onInputDown.add(this.pickTile, {tile:0});
        flat2.inputEnabled = true;
        flat2.events.onInputDown.add(this.pickTile, {tile:1});
        flat3.inputEnabled = true;
        flat3.events.onInputDown.add(this.pickTile, {tile:3});
        flatGroup.visible = false;


        restGroup = game.add.group();
        // restGroup.add(tileSelectorBackground);

        var rest1 = restGroup.create(tilesize*0.3, uiUpper-tilesize*1.15, 'rest1');
        // var flat2 = flatGroup.create(tilesize*1.45, uiUpper-tilesize*1.15, 'flat2');
        // var flat3 = flatGroup.create(tilesize*3.6, uiUpper-tilesize*1.15, 'flat3');
        rest1.inputEnabled = true;
        rest1.events.onInputDown.add(this.pickTile, {tile:6});
        // flat2.inputEnabled = true;
        // flat2.events.onInputDown.add(this.pickTile, {tile:1});
        // flat3.inputEnabled = true;
        // flat3.events.onInputDown.add(this.pickTile, {tile:3});
        restGroup.visible = false;

    },

//--------Update functions----------

    update: function() {
        if (debugMode == true){
            var x = game.input.activePointer.worldX;
            var y = game.input.activePointer.worldY;
            game.debug.text("bgc: " + bgc, 20, 20);
            game.debug.text("Time: " + dayNightCycle, 20, 40);
            game.debug.text("Current tile: " + currentTile, 20, 60);
            game.debug.text("x: " + x, 20, 80);
            game.debug.text("y: " + y, 90, 80);
        } else{
            game.debug.text("", 0, 0);
        }
        if (dayNightCycle < 300){
            if (bgc[0] < 160){
                bgc[0] = bgc[0] + 3*tickSpeed;
            }
            if (bgc[1] < 200){
                bgc[1] = bgc[1] + 1*tickSpeed;
            }
            if (bgc[2] < 200){
                bgc[2] = bgc[2] + 2*tickSpeed;
            }
            game.stage.backgroundColor = 'rgba(' + bgc[0] + ','+ bgc[1] + ',' + bgc[2] + ',' + bgc[3] + ')';
        } else if (dayNightCycle > 350 && dayNightCycle <= 360){
            ampm.text = "pm";
        } else if (dayNightCycle > 1050 && dayNightCycle <= 1250){
            if (bgc[0] > 1){
                bgc[0] = bgc[0] - 1*tickSpeed;
            }
            if (bgc[1] > 1){
                bgc[1] = bgc[1] - 2*tickSpeed;
            }
            if (bgc[2] > 1){
                bgc[2] = bgc[2] - 2*tickSpeed;
            }
            game.stage.backgroundColor = 'rgba(' + bgc[0] + ','+ bgc[1] + ',' + bgc[2] + ',' + bgc[3] + ')';
        } else if (dayNightCycle > 1250 && dayNightCycle <= 1260){
            ampm.text = "am";
        } else if (dayNightCycle > 1800){
            money += income;
            moneyLabel.text = "£" + scaleValue(money);
            incomeLabel.text = "£" + scaleValue(income);
            dayNightCycle = 0;
        }
        dayNightCycle += tickSpeed;
        if (dayNightCycle % 5 == 0){
            hourArm.angle += 2*tickSpeed;
        }
    },

    updateMarker: function() {
        var x = layer.getTileX(game.input.activePointer.worldX);
        var y = layer.getTileY(game.input.activePointer.worldY);
        if (y < mapsize[1]){
            marker.x = x*tilesize;
            marker.y = y*tilesize;
        }
    },

    pickCategory: function(){
        var x = game.input.activePointer.worldX;
        if (x <= 92){
            flatGroup.visible = true;
            restGroup.visible = false;
        } else if (x <= 184){
            flatGroup.visible = false;
            restGroup.visible = true;
        }

    },

    pickTile: function () {
        currentTile = this.tile;
        tileCostLabel.text = "Costs £" + scaleValue(tileCost[currentTile]);
        tileIncomeLabel.text = "Generates £" + scaleValue(tileIncome[currentTile]) + " per day";
    },

    placeTile: function() {
        function checkmoney(){
            if (tileCost[currentTile] <= money){
                for (i = 0; i <= tileLength[currentTile]; i++){
                    map.putTile(currentTile + i, x + i, y, layer);
                }
                money -= tileCost[currentTile];
                income += tileIncome[currentTile];
            } else {
                var warningText = game.add.text(20, 15, 'Not enough cash', {font: '20px', fill :'#FF0000'});
                game.time.events.add(1000, function() {game.add.tween(warningText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);}, this);
            }
        }
        //Check to see if placeble. 1, nothing there already. 2, something below it. 3, enough money to buy
        var build = true;
        var x = marker.x/tilesize;
        var y = marker.y/tilesize;
        var tile = map.getTile(x, y, 'layer', true);
        if (tile.y == mapsize[1]-1){
            for (i = 0; i <= tileLength[currentTile]; i++){
                tileBuildLevel = map.getTile(x + i, y, 'layer', true);
                if (tileBuildLevel.index >= 0){
                    build = false;
                }
            }
        } else {
            for (i = 0; i <= tileLength[currentTile]; i++){
                tileBuildLevel = map.getTile(x + i, y, 'layer', true);
                tileBelow = map.getTile(x + i, y + 1, 'layer', true);
                if (tileBelow.index == -1 || tileBuildLevel.index >= 0){
                    build = false;
                }
            }
        }

        if (build == true){
            checkmoney();
        } else {
            var warningText = game.add.text(20, 15, 'Blocked or not supported', {font: '20px', fill :'#FF0000'});
            game.time.events.add(1000, function() {game.add.tween(warningText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);}, this);
        }
        moneyLabel.text = "£" + scaleValue(money);
        incomeLabel.text = "£" + scaleValue(income);
    }
}
