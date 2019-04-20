const config = {
    type: Phaser.AUTO, // Which renderer to use
    width: 400, // Canvas width in pixels
    height: 400, // Canvas height in pixels
    pixelArt: true,
    parent: "game-container", // ID of the DOM element to add the canvas to
    physics: {
      default: 'arcade',
      arcade: {
          gravity: {y: 500},
          debug: true
      }
  },
    scene: {
      preload: preload,
      create: create,
      update: update,
      render: render
    }
  };


  const game = new Phaser.Game(config);
  
  function preload() {
    // Runs once, loads up assets like images and audio
    this.load.image("tiles", "assets/tilesets/galletcity_tiles.png");
    this.load.tilemapCSV("citymap", "assets/city.csv");
    this.load.image('car', "assets/car90.png")
  }

  let map;
  let tileset;
  let layer;

  let cursors;
  let sprite;


function create() {
  //game.physics.startSystem(Phaser.Physics.ARCADE);
  // When loading a CSV map, make sure to specify the tileWidth and tileHeight!
    map = this.make.tilemap({ key: "citymap", tileWidth: 8, tileHeight: 8});
    tileset = map.addTilesetImage("tiles");
    layer = map.createDynamicLayer(0, tileset, 0, 0); // layer index, tileset, x, y
    sprite = this.add.sprite(10, 130, 'car');
    sprite.scaleX = 0.5
    sprite.scaleY = 0.5

    
}

function update() {
}

function render() {

}
//   function create() {
//   // When loading a CSV map, make sure to specify the tileWidth and tileHeight!
//     map = this.make.tilemap({ key: "map", tileWidth: 8, tileHeight: 8});
//     tileset = map.addTilesetImage("tiles");
//     layer = map.createDynamicLayer(0, tileset, 0, 0); // layer index, tileset, x, y
//   // game.world.setBounds(0, 0, 1600, 1200);
//    p = this.physics.add.sprite(100, 100, 'car');
//     // p = game.add.sprite(100, 100, 'car');

//     game.physics.enable(p);

//     game.physics.arcade.gravity.y = 250;

//     p.body.bounce.y = 0.2;
//     p.body.linearDamping = 1;
//     p.body.collideWorldBounds = true;

//     game.camera.follow(p);

//     cursors = game.input.keyboard.createCursorKeys();


//   // const camera = this.cameras.main;

//   cursors = this.input.keyboard.createCursorKeys();
//   controls = new Phaser.Cameras.Controls.FixedKeyControl({
//     camera: camera,
//     left: cursors.left,
//     right: cursors.right,
//     up: cursors.up,
//     down: cursors.down,
//     speed: 0.5
//   });

//   // camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

//   // this.add
//   //   .text(16, 16, "Arrow keys to scroll", {
//   //     font: "18px monospace",
//   //     fill: "#ffffff",
//   //     padding: { x: 20, y: 10},
//   //     backgroundColor: "#000000"
//   //   })
//   //   .setScrollFactor(0);
//   }

//   function update(time, delta) {
//     game.physics.arcade.collide(p, layer);

//     p.body.velocity.x = 0;

//     if (cursors.up.isDown)
//     {
//         if (p.body.onFloor())
//         {
//             p.body.velocity.y = -200;
//         }
//     }

//     if (cursors.left.isDown)
//     {
//         p.body.velocity.x = -150;
//     }
//     else if (cursors.right.isDown)
//     {
//         p.body.velocity.x = 150;
//     }

//   }

//   function render() {

//     // game.debug.body(p);
//     game.debug.bodyInfo(p, 32, 320);

// }