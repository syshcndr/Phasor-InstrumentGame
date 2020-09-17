var GameState = {
  preload: function() {
    this.load.image('background', 'assets/images/background.png');
    this.load.image('arrow', 'assets/images/arrow.png');
    
    this.load.spritesheet('chicken', 'assets/images/piano_spritesheet.png', 244, 200, 3);
    this.load.spritesheet('horse', 'assets/images/guitar_spritesheet.png', 244, 200, 3);
    this.load.spritesheet('pig', 'assets/images/flute_spritesheet.png', 244, 200, 3);
    this.load.spritesheet('sheep', 'assets/images/drum_spritesheet.png', 244, 200, 3);
    
    this.load.audio('piano', ['assets/audio/piano.ogg', 'assets/audio/piano.mp3']);
    this.load.audio('guitar', ['assets/audio/guitar.ogg', 'assets/audio/guitar.mp3']);
    this.load.audio('flute', ['assets/audio/flute.ogg', 'assets/audio/flute.mp3']);
    this.load.audio('drums', ['assets/audio/drums.ogg', 'assets/audio/drums.mp3']);
  },
  create: function() {
    
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.scale.setScreenSize(true);


    this.background = this.game.add.sprite(0, 0, 'background')
    
    var animalData = [
      {key: 'chicken', text: 'CHICKEN', audio: 'piano'},
      {key: 'horse', text: 'HORSE', audio: 'guitar'},
      {key: 'pig', text: 'PIG', audio: 'flute'},
      {key: 'sheep', text: 'SHEEP', audio: 'drums'}
    ];

    this.animals = this.game.add.group();

    var self = this;    
    var animal;
    animalData.forEach(function(element){
      animal = self.animals.create(-1000, self.game.world.centerY, element.key, 0);

      animal.customParams = {text: element.key, sound: self.game.add.audio(element.audio)};

      animal.anchor.setTo(0.5);

      animal.animations.add('animate', [0, 1, 2, 1, 0, 1], 3, false);

      animal.inputEnabled = true;
      animal.input.pixelPerfectClick = true;
      animal.events.onInputDown.add(self.animateAnimal, self);
    });

    this.currentAnimal = this.animals.next();
    this.currentAnimal.position.set(this.game.world.centerX, this.game.world.centerY);

    this.leftArrow = this.game.add.sprite(60, this.game.world.centerY, 'arrow');
    this.leftArrow.anchor.setTo(0.5);
    this.leftArrow.scale.x = -1;
    this.leftArrow.customParams = {direction: -1};

    this.leftArrow.inputEnabled = true;
    this.leftArrow.input.pixelPerfectClick = true;
    this.leftArrow.events.onInputDown.add(this.switchAnimal, this);

    this.rightArrow = this.game.add.sprite(580, this.game.world.centerY, 'arrow');
    this.rightArrow.anchor.setTo(0.5);
    this.rightArrow.customParams = {direction: 1};

    this.rightArrow.inputEnabled = true;
    this.rightArrow.input.pixelPerfectClick = true;
    this.rightArrow.events.onInputDown.add(this.switchAnimal, this);    

  },
  update: function() {
  },
  animateAnimal: function(sprite, event) {
    sprite.play('animate');
    sprite.customParams.sound.play();
  },
  switchAnimal: function(sprite, event) {

    if(this.isMoving) {
      return false;
    }

    this.isMoving = true;

    var newAnimal, endX;
    if(sprite.customParams.direction > 0) {
      newAnimal = this.animals.next();
      newAnimal.x = -newAnimal.width/2;
      endX = 640 + this.currentAnimal.width/2;
    }
    else {
      newAnimal = this.animals.previous();
      newAnimal.x = 640 + newAnimal.width/2;
      endX = -this.currentAnimal.width/2;
    }

    var newAnimalMovement = this.game.add.tween(newAnimal);
    newAnimalMovement.to({ x: this.game.world.centerX }, 1000);
    newAnimalMovement.onComplete.add(function(){this.isMoving = false;}, this);
    newAnimalMovement.start();

    var currentAnimalMovement = this.game.add.tween(this.currentAnimal);
    currentAnimalMovement.to({ x: endX }, 1000);
    currentAnimalMovement.start();

    this.currentAnimal = newAnimal;
  }

};

var game = new Phaser.Game(640, 360, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');