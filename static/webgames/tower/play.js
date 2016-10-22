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
        layer = map.create('layer', mapsize[0], mapsize[1], tilesize, tilesize);
        layer.resizeWorld();
        Logger.debug('Grid made')

        marker = game.add.graphics();
        marker.lineStyle(2, 0x888888, 1);
        marker.drawRect(0, 0, tilesize, tilesize);
        game.input.addMoveCallback(this.updateMarker, this);
        layer.inputEnabled = true;
        layer.events.onInputDown.add(this.placeTile, this);
        Logger.debug('Marker added to layer');

        flatOne = {
            'name':'singleFlat',
            'type':'residential',
            'tile':0,
            'income': 20,
            'cost': 100,
            'length':0,
            'pop':10,
            'rep':-0.1,
            'reqRep':-5
        };
        flatTwo = {
            'name':'doubleFlat',
            'type':'residential',
            'tile':1,
            'income': 100,
            'cost': 3000,
            'length':1,
            'pop':2,
            'rep':0,
            'reqRep':-5
        };
        flatThree = {
            'name':'familyFlat',
            'type':'residential',
            'tile':3,
            'income': 300,
            'cost': 10000,
            'length':2,
            'pop':4,
            'rep':0.1,
            'reqRep':-5
        };
        poshFlat = {
            'name':'poshFlat',
            'type':'residential',
            'tile':9,
            'income': 3000,
            'cost': 10000,
            'length':5,
            'pop':2,
            'rep':0.5,
            'reqRep':1
        };

        wamaking = {
            'name':'wamaking',
            'type':'food',
            'tile':6,
            'income': 1000,
            'cost': 10000,
            'length':2,
            'pop':0,
            'jobs':2,
            'food':100,
            'rep':0.2,
            'reqRep':-5
        };

        selectedTile = {'tile':0}
        this.createTileSelector();
        Logger.debug('Tile selector completed')


        var style = {font: '20px', fill :'#000000'};
        player = {
            'money': 1000,
            'income':0,
            'rep':0,
            'pop':0,
            'food':100,
            'restaurants':0
        }
        game.add.text(850, uiUpper, "Population", style);
        populationLabel = game.add.text(850, uiLower, scaleValue(player.pop),  style);
        game.add.text(950, uiUpper, "Money", style);
        moneyLabel = game.add.text(950, uiLower, "£" + scaleValue(player.money), style);
        game.add.text(1050, uiUpper, "Income", style);
        incomeLabel = game.add.text(1050, uiLower, scaleValue(player.income),  style);
        game.add.text(1150, uiUpper, "Reputation", style);
        reputationLabel = game.add.text(1150, uiLower, scaleValue(player.rep),  style);

        tileCostLabel = game.add.text(260, uiUpper, ' ', style);
        tileIncomeLabel = game.add.text(260, uiLower, ' ', style);

        Logger.debug('Info section of UI completed')

        Logger.debug('Building clock system/UI')
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

        Logger.debug('UI finished')
        debugMode = false;
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
        Logger.debug('category strip made')

        flatGroup = game.add.group();
        var flatOneSprite = flatGroup.create(tilesize*0.3, uiUpper-tilesize*1.15, 'flat1');
        var flatTwoSprite = flatGroup.create(tilesize*1.45, uiUpper-tilesize*1.15, 'flat2');
        var flatThreeSprite = flatGroup.create(tilesize*3.6, uiUpper-tilesize*1.15, 'flat3');
        var poshFlatSprite = flatGroup.create(tilesize*6.9, uiUpper-tilesize*1.15, 'poshFlat');
        flatOneSprite.inputEnabled = true;
        flatTwoSprite.inputEnabled = true;
        flatThreeSprite.inputEnabled = true;
        poshFlatSprite.inputEnabled = true;
        flatOneSprite.events.onInputDown.add(this.pickTile, {clickedTile: flatOne});
        flatTwoSprite.events.onInputDown.add(this.pickTile, {clickedTile: flatTwo});
        flatThreeSprite.events.onInputDown.add(this.pickTile, {clickedTile: flatThree});
        poshFlatSprite.events.onInputDown.add(this.pickTile, {clickedTile: poshFlat});
        flatGroup.visible = false;
        Logger.debug('Flats completed')

        restGroup = game.add.group();

        var rest1 = restGroup.create(tilesize*0.3, uiUpper-tilesize*1.15, 'rest1');
        rest1.inputEnabled = true;
        rest1.events.onInputDown.add(this.pickTile, {clickedTile: wamaking});
        restGroup.visible = false;

        Logger.debug('Restaurants completed')
    },

//--------Update functions----------

    update: function() {
        if (debugMode == true){
            var x = game.input.activePointer.worldX;
            var y = game.input.activePointer.worldY;
            game.debug.text("bgc: " + bgc, 20, 20);
            game.debug.text("Time: " + dayNightCycle, 20, 40);
            game.debug.text("Current tile: " + selectedTile.tile, 20, 60);
            game.debug.text("x: " + x, 20, 80);
            game.debug.text("y: " + y, 90, 80);
            game.debug.text("Food: " + player.food, 20, 100);
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
            player.money += player.income;
            moneyLabel.text = "£" + scaleValue(player.money);
            incomeLabel.text = "£" + scaleValue(player.income);
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
        Logger.debug('Category Changed')
        var x = game.input.activePointer.worldX;
        if (x <= 92){
            flatGroup.visible = true;
            restGroup.visible = false;
        } else if (x <= 184){
            flatGroup.visible = false;
            restGroup.visible = true;
        }

    },

    pickTile: function(){
        Logger.debug(this.clickedTile);
        selectedTile = this.clickedTile;
        tileCostLabel.text = "Costs £" + scaleValue(selectedTile.cost);
        tileIncomeLabel.text = "Generates £" + scaleValue(selectedTile.income) + " per day";
    },

    placeTile: function() {
        function checkMoney(){
            if (selectedTile.type == 'food'){
                if (player.restaurants >= (player.pop*0.02-1)){
                    return "Can't open another restaurant. Need more customers."
                }
            }
            if (selectedTile.cost > player.money){
                return "Not enough cash.";
            } else if (selectedTile.pop > player.food){
                return "Residances depand more restaurants."
            } else if (selectedTile.reqRep > player.rep){
                return "Your towers reputation is too low."
            } else {
                return true
            }
        }
        Logger.debug('Beginning place new tile checks')
        //Check to see if placeble, i.e. not obstructed or air blocks below
        var x = marker.x/tilesize;
        var y = marker.y/tilesize;
        var tile = map.getTile(x, y, 'layer', true);
        Logger.debug('Placement checks');
        if (tile.y == mapsize[1]-1){
            for (i = 0; i <= selectedTile.length; i++){
                tileBuildLevel = map.getTile(x + i, y, 'layer', true);
                if (tileBuildLevel.index >= 0){
                    var warningText = 'Area Blocked';
                    break;
                } else {
                    var warningText = true;
                }
            }
        } else {
            for (i = 0; i <= selectedTile.length; i++){
                tileBuildLevel = map.getTile(x + i, y, 'layer', true);
                tileBelow = map.getTile(x + i, y + 1, 'layer', true);
                if (tileBelow.index == -1 || tileBuildLevel.index >= 0){
                    var warningText = 'No fully supported';
                    break;
                } else {
                    var warningText = true;
                }
            }
        }
        // If unobstructed check money and such
        if (warningText == true){
            Logger.debug('Preforming player checks');
            var warningText = checkMoney();
        }
        if (warningText == true){
            for (i = 0; i <= selectedTile.length; i++){
                map.putTile(selectedTile.tile + i, x + i, y, layer);
            }
            player.money -= selectedTile.cost;
            player.income += selectedTile.income;
            player.pop += selectedTile.pop;
            player.rep += selectedTile.rep;
            player.food -= selectedTile.pop;
            if (selectedTile.type == "food"){
                player.food += selectedTile.food;
                player.restaurants += 1;
            }
            Logger.debug('Tile placed');
        } else {
            var warningLabel = game.add.text(
                20, 15,
                warningText,
                {font: '20px', fill :'#FF0000'}
            );
            game.time.events.add(1000,
                function() {
                    game.add.tween(warningLabel).to({alpha: 0},
                    1000, Phaser.Easing.Linear.None, true);
                }, this);
            Logger.debug('Tile not placed: ' + warningText);
        }
        moneyLabel.text = "£" + scaleValue(player.money);
        incomeLabel.text = "£" + scaleValue(player.income);
        populationLabel.text = scaleValue(player.pop);
        reputationLabel.text = scaleValue(player.rep);
        Logger.debug('Info UI updated');
    }
}
