"use strict";

var LoadingState = function(_game) {
	Phaser.State.call(this, _game);
	_game.state.add("Loading", this, false);
};

LoadingState.prototype = Object.create(Phaser.State.prototype);
LoadingState.prototype.constructor = LoadingState;

LoadingState.prototype.preload = function() {

	var loadingSpr = this.game.add.sprite(this.game.width-10,this.game.height -5,"loading");
	loadingSpr.animations.add("load", [ 0, 1 ]);
	loadingSpr.animations.play('load', 5, true);
	loadingSpr.anchor.setTo(1,1);

	this.game.load.spritesheet("play", "assets/images/play.png",128,64,2);

}

LoadingState.prototype.create = function() {
	this.game.state.start("Menu");
}

LoadingState.prototype.update = function() {
}

LoadingState.prototype.render = function() {
}
