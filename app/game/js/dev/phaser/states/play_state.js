"use strict";

var PlayState = function(_game) {
	Phaser.State.call(this, _game);
	_game.state.add("Play", this, false);

};

PlayState.prototype = Object.create(Phaser.State.prototype);
PlayState.prototype.constructor = PlayState;

PlayState.prototype.preload = function(){

}

PlayState.prototype.create = function(){
	//JUST TEXT
	var styleBig = { font: "35px Arial", fill: "#ffff", align: "center" };
	var text = this.game.add.text(this.game.width * 0.5, 0, 
    			"PLAYING HERE", styleBig);
    text.anchor.x = 0.5

    //When clicked, go to endstate
	this.game.input.onUp.add( function(){console.log("ToEnd"); this.game.state.start("End");} ,
							 this);

	//PHYSICS
	//Remove this if you DONT want collisions to work in your game	
	
	this.game.physics.startSystem(Phaser.Physics.P2JS);
	this.game.physics.p2.gravity.y = PhysicsSettings.GLOBAL_GRAVITY;
	this.collisionManager = new CollisionManager(this.game);
	this.collisionManager.init( PhysicsSettings.LAYERS );	
	
	//Create your game
	//...
	//this create an example for you
	if(this.collisionManager != null)
		this.example();
}

PlayState.prototype.update = function(){

}

PlayState.prototype.example = function(){

	var spr1 = new LR.Entity.Sprite(this.game,200,100,""); //Create a sprite. No image.
	spr1.go.enablePhysics().debug = true;//Enable physics. The function returns the body for chaining, so we allow debug at the same time
	spr1.go.layer = "player"; //change layer
	this.game.add.existing(spr1); //add to game
	this.collisionManager.addGameObject(spr1.go); //add GameObject to the CollisionManager.

	var spr2 = new LR.Entity.Sprite(this.game,200,300,""); ///Second sprite. This is the ground
	spr2.go.enablePhysics(PhysicsSettings.STATIC,"ground",300,40); // we can set the MotionState and the layer in the enablePhysics function
	spr2.body.debug = true; //same as above but no chaining
	this.game.add.existing(spr2);
	this.collisionManager.addGameObject(spr2.go);

}