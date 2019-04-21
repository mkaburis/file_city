module.import = { getFileList: './app/fileManagement' }

const config = {
    type: Phaser.AUTO, // Which renderer to use
    width: 620, // Canvas width in pixels
    height: 400, // Canvas height in pixels
    pixelArt: true,
    parent: "game-container", // ID of the DOM element to add the canvas to
    physics: {
      default: 'arcade',
      arcade: {
          gravity: 0,
          debug: true
      }
  },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };


  const game = new Phaser.Game(config);
  
  function preload() {
    // Runs once, loads up assets like images and audio
    this.load.image("tiles", "assets/tilesets/galletcity_tiles.png");
    this.load.tilemapCSV("citymap", "assets/city.csv");
    this.load.image('car', "assets/car90.png");
    this.load.image('fileBuilding', "assets/fileBuilding.png");
    this.load.image('dirBuilding', "assets/dirBuilding.png");
  }

  let map;
  let tileset;
  let layer;
  let buildLayer;

  let cursors;
  let sprite;
  let debugGraphics;
  let showDebug = false;
  let helpText;
  let building;
  let currentDataString;

function create() {
  // When loading a CSV map, make sure to specify the tileWidth and tileHeight!
    map = this.make.tilemap({ key: "citymap", tileWidth: 8, tileHeight: 8});
    tileset = map.addTilesetImage("tiles");
    layer = map.createDynamicLayer(0, tileset, 0, 0); // layer index, tileset, x, y
    sprite = this.physics.add.sprite(10, 130, 'car');
    
    // Scale the car sprite down
    sprite.scaleX = 0.5
    sprite.scaleY = 0.5




    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(sprite);

    this.cameras.main.setZoom(3);
    // Set collision bounds at edge of our city world
    sprite.setCollideWorldBounds(true);



    // Load in Files and Directories for UI //
    ////////////////////
    let fileContents = getFileList();

    let x = 104, y = 80
    let count = 0
    fileContents.forEach(element => {
      if (count === 4)
      {
        count = 0;
        x+= 112
        y = 80
      }
      // console.log(element);
      let str = element
      if (str.indexOf('.') !== -1)
      {
        building = this.add.sprite(x, y, 'fileBuilding')
        
      }
      else
        building = this.add.sprite(x, y, 'dirBuilding')

      
      y+=90;
      count++
    });


    const helloButton = this.add.text(100, 100, 'Hello Phaser!', { fill: '#0f0' });
    helloButton.setInteractive();

    helloButton.on('pointerover', () => { console.log('pointerover'); });
    // COLUMN A
    
    // building = this.add.sprite(104, 170, 'dirBuilding')
    // this.building.setCollideWorldBounds(true);
    // this.add.sprite(104, 260, 'dirBuilding');
    // this.add.sprite(104, 350, 'fileBuilding');;

    // // COLUMN B
    // this.add.sprite(216, 80, 'fileBuilding')
    // this.add.sprite(216, 170, 'fileBuilding')
    // this.add.sprite(216, 260, 'dirBuilding');
    // this.add.sprite(216, 350, 'fileBuilding');

    // // COLUMN B
    // this.add.sprite(328, 80, 'fileBuilding')
    // this.add.sprite(328, 170, 'dirBuilding')
    // this.add.sprite(328, 260, 'dirBuilding');
    // this.add.sprite(328, 350, 'fileBuilding');




    map.setCollisionBetween(3, 7);
    map.setCollisionBetween(11, 15);
    map.setCollisionBetween(19, 23);
    map.setCollisionBetween(27, 31);
    map.setCollisionBetween(35, 39);
    map.setCollisionBetween(126, 126);
    map.setCollisionBetween(134, 134);

    //Set up collission with our layer
    
    this.physics.add.collider(sprite, layer);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('car', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
  });

  this.anims.create({
      key: 'turn',
      frames: [ { key: 'car', frame: 4 } ],
      frameRate: 20
  });

  this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('car', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
  });


    cursors = this.input.keyboard.createCursorKeys();

    debugGraphics = this.add.graphics();

    this.input.keyboard.on('keydown_C', function (event) {
        showDebug = !showDebug;
        drawDebug();
    });
    
}

function update() {

  var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);
    var tile = map.getTileAtWorldXY(worldPoint.x, worldPoint.y);

  sprite.setVelocity(0);

  if (cursors.left.isDown)
  {
      sprite.setAngularVelocity(-200);
      // map.replaceByIndex(tile.index, 140)
  }
  else if (cursors.right.isDown)
  {
      sprite.setAngularVelocity(200);
      console.log(getFileList());
  }

  else if (cursors.up.isDown)
  {
    sprite.setVelocity(Math.cos(sprite.rotation) * 200, Math.sin(sprite.rotation) * 200); 
  }

  else if (cursors.down.isDown)
  {
    sprite.setVelocity(Math.cos(sprite.rotation) * -200, Math.sin(sprite.rotation) * -200); 
  }

  else
  {
      sprite.setAngularVelocity(0);
  }
}

function drawDebug ()
{
    debugGraphics.clear();

    if (showDebug)
    {
        // Pass in null for any of the style options to disable drawing that component
        map.renderDebug(debugGraphics, {
            tileColor: null, // Non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Colliding face edges
        });
    }

    helpText.setText(getHelpMessage());
}

function getHelpMessage ()
{
    return 'Arrow keys to move.' +
        '\nPress "C" to toggle debug visuals: ' + (showDebug ? 'on' : 'off');
}
