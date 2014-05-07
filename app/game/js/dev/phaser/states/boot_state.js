"use strict";

var BootState = function(_game) {
	Phaser.State.call(this, _game);
	_game.state.add("Boot", this, false);
};

BootState.prototype = Object.create(Phaser.State.prototype);
BootState.prototype.constructor = BootState;

BootState.prototype.preload = function() {
	// Boot
	this.game.stage.backgroundColor = "#9a0909";
	this.game.load.spritesheet('loading', 'assets/images/loading.png', 48, 48, 2);

}

BootState.prototype.create = function() {
	this.game.plugins.add(Phaser.Plugin.Pollinator);
	this.game.state.start("Loading");	
}

BootState.prototype.update = function() {
}

BootState.prototype.render = function() {
}
