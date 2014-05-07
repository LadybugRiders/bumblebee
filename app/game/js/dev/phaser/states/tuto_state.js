"use strict";

var TutoState = function(_game) {
	Phaser.State.call(this, _game);
	_game.state.add("Tuto", this, false);
};


TutoState.prototype = Object.create(Phaser.State.prototype);
TutoState.prototype.constructor = TutoState;

TutoState.prototype.create = function() {
	//JUST TEXT
	var styleBig = { font: "35px Arial", fill: "#ffff", align: "center" };
	var text = this.game.add.text(this.game.width * 0.5, 0, 
    			"TUTO", styleBig);
    text.anchor.x = 0.5

    //When clicked, go to playstate
	this.game.input.onUp.add( function(){ this.game.state.start("Play");},
							this);
}
