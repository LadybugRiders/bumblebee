"use strict";

var MenuState = function(_game) {
	Phaser.State.call(this, _game);
	_game.state.add("Menu", this, false);
};

MenuState.prototype = Object.create(Phaser.State.prototype);
MenuState.prototype.constructor = MenuState;

MenuState.prototype.preload = function() {
}

MenuState.prototype.create = function() {

	var play = this.game.add.button(this.game.width * 0.5,this.game.height *0.5 + 10, 
    					'play',
    					this.onPlay, this, 1, 0, 0) ;
	play.anchor.setTo(0.5,0.5);

	var styleBig = { font: "35px Arial", fill: "#ffff", align: "center" };
	var text = this.game.add.text(this.game.width * 0.5, 0, 
    			"BUMBLEBEE GAME TEMPLATE", styleBig);
    text.anchor.x = 0.5

}

MenuState.prototype.onPlay = function() {	
	this.game.state.start("Tuto");
}
