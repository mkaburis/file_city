// Configure our phaser game
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
          debug: false
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
  let overlapTriggered = false;


// Timer for directory selection
  let timer = setInterval(()=> {
    overlapTriggered = false;
  }, 3000)
  

// Global variables for phaser!
  let cursors;
  let sprite;
  let debugGraphics;
  let showDebug = false;
  let building =[];
  let fileData = [];

// Create our phaser scene for the city
function create() {
  //Load in the tilemap, cityCSV
    map = this.make.tilemap({ key: "citymap", tileWidth: 8, tileHeight: 8});
    tileset = map.addTilesetImage("tiles");
    layer = map.createDynamicLayer(0, tileset, 0, 0); // layer index, tileset, x, y
    sprite = this.physics.add.sprite(25, 130, 'car');
    refreshScene = false;
 
    
    // Scale the car sprite down
    sprite.scaleX = 0.5
    sprite.scaleY = 0.5

    // Set up camera to follow car sprite
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(sprite);
    this.cameras.main.setZoom(2);
    
     // Set collision bounds at edge of our city world
    sprite.setCollideWorldBounds(true);

    //////////////////////////////////////////
    // Load in Files and Directories for UI //
    //////////////////////////////////////////
    let fileContents = getFileList();

    let x = 104, y = 80
    let count = 0
    let i = 0;

    fileContents.forEach(element => {
      if (count === 4)
      {
        count = 0;
        x+= 112
        y = 80
      }
      let fileObj = fileInfo(element);

      if(fileObj.isFile())
      {
        building[i] = this.add.sprite(x, y, 'fileBuilding').setInteractive()
        let absolute = path.resolve(element)
        fileData[i] = {
          id: i,
          name: element,
          size: fileObj.size,
          cTime: fileObj.birthtime,
          modTime: fileObj.mtime,
          absPath: absolute };
      }
      else {
        building[i] = this.add.sprite(x, y, 'dirBuilding').setInteractive()
        let absolute = path.resolve(element)
        fileData[i] = {
          id: i,
          name: element,
          size: fileObj.size,
          cTime: fileObj.birthtime,
          modTime: fileObj.mtime,
          absPath: absolute };
      }

      this.add.text(x-25, y-10, formatBytes(fileObj.size), {
        fontFamily: 'Arial',
        fontSize: '10px',
        padding: { x: 5, y: 5 },
        fill: '#ffffff',
        backgroundColor: '#000000',
        visible: false
      });

      this.physics.add.existing(building[i], true);
      // this.physics.add.collider(building, sprite);
      this.physics.add.overlap(sprite, building[i], getCurrent);
      y+=90;
      count++;
      i++;
    });

    this.input.on('gameobjectover', function (pointer, gameObject) {
      
      gameObject.setTint(0xff0000);
  });

  this.input.on('gameobjectout', function (pointer, gameObject) {

      gameObject.clearTint();

  });

    // Set collision spaces on the map!
    map.setCollisionBetween(3, 7);
    map.setCollisionBetween(11, 15);
    map.setCollisionBetween(19, 23);
    map.setCollision(27);
    map.setCollisionBetween(29, 31);
    map.setCollisionBetween(35, 39);
    map.setCollisionBetween(126, 126);
    map.setCollision(134);

    // Railroad tracks go up a directory!
    layer.setTileIndexCallback(127, () => {
      changeDirectory('../');
      this.scene.restart();
    }, this);


    // Set up collissions with the parking lot and building sprites!
    layer.setTileIndexCallback(28, () => {
      clearInterval(timer);
      if(refreshScene === false && overlapTriggered === false) {
        overlapTriggered = true;
        selectDirectory();
      }
    } );

    //Set up collission with our map layer
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
  if(refreshScene === true) {
    overlapTriggered = false; 
    this.scene.restart();
  }
  // this.physics.add.collider(sprite, building, openFileMenu);

  sprite.setVelocity(0);

  if (cursors.left.isDown)
  {
      sprite.setAngularVelocity(-200);
      // map.replaceByIndex(tile.index, 140)
  }
  else if (cursors.right.isDown)
  {
      sprite.setAngularVelocity(200);
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

}

function getCurrent(sprite, building) {
  let x;

  var promise = new Promise(function (resolve, reject) {
    // do a thing, possibly async, then…
    // COLUMN A
    if (sprite.x > 95 && sprite.x < 116 && sprite.y > 108.5 && sprite.y < 115)
      x = 0
    if (sprite.x > 95 && sprite.x < 116 && sprite.y > 195 && sprite.y < 205)
      x = 1
    if (sprite.x > 95 && sprite.x < 116 && sprite.y > 292 && sprite.y < 302)
      x = 2
    if (sprite.x > 95 && sprite.x < 116 && sprite.y > 318 && sprite.y < 328)
      x = 3

    // COLUMN B
    if (sprite.x > 205 && sprite.x < 226 && sprite.y > 108.5 && sprite.y < 115)
      x = 4
    if (sprite.x > 205 && sprite.x < 226 && sprite.y > 195 && sprite.y < 205)
      x = 5
    if (sprite.x > 205 && sprite.x < 226 && sprite.y > 292 && sprite.y < 302)
      x = 6
    if (sprite.x > 205 && sprite.x < 226 && sprite.y > 318 && sprite.y < 328)
      x = 7

    // COLUMN C
    if (sprite.x > 315 && sprite.x < 336 && sprite.y > 108.5 && sprite.y < 115)
      x = 8
    if (sprite.x > 315 && sprite.x < 336 && sprite.y > 195 && sprite.y < 205)
      x = 9
    if (sprite.x > 315 && sprite.x < 336 && sprite.y > 292 && sprite.y < 302)
      x = 10
    if (sprite.x > 315 && sprite.x < 336 && sprite.y > 318 && sprite.y < 328)
      x = 11

    // COLUMN D
    if (sprite.x > 425 && sprite.x < 446 && sprite.y > 108.5 && sprite.y < 115)
      x = 12
    if (sprite.x > 425 && sprite.x < 446 && sprite.y > 195 && sprite.y < 205)
      x = 13
    if (sprite.x > 425 && sprite.x < 446 && sprite.y > 292 && sprite.y < 302)
      x = 14
    if (sprite.x > 425 && sprite.x < 446 && sprite.y > 318 && sprite.y < 328)
      x = 15

    // COLUMN E
    if (sprite.x > 535 && sprite.x < 556 && sprite.y > 108.5 && sprite.y < 115)
      x = 16
    if (sprite.x > 535 && sprite.x < 556 && sprite.y > 195 && sprite.y < 205)
      x = 17
    if (sprite.x > 535 && sprite.x < 556 && sprite.y > 292 && sprite.y < 302)
      x = 18
    if (sprite.x > 535 && sprite.x < 556 && sprite.y > 318 && sprite.y < 328)
      x = 19


    if (x != undefined) {
      resolve(x);
    }

  });
  promise.then((x) => {
    currentObj = fileData[x];
    document.getElementById("curr").innerHTML = fileData[x].absPath;
  })

}