"use strict";

var EndState = function(_game) {
	Phaser.State.call(this, _game);
	_game.state.add("End", this, false);
};

EndState.prototype = Object.create(Phaser.State.prototype);
EndState.prototype.constructor = EndState;

EndState.prototype.preload = function(){
	this.game.load.spritesheet("back_button","assets/images/back_button.png",48,48,3);
}

EndState.prototype.create = function(){

    //JUST TEXT
    var styleBig = { font: "35px Arial", fill: "#ffff", align: "center" };
    var text = this.game.add.text(this.game.width * 0.5, 0, 
                "END", styleBig);
    text.anchor.x = 0.5

    this.game.add.button(this.game.width - 48,this.game.height - 48, 
    					'back_button',
    					this.onBack, this, 1, 0, 2) ;
}

EndState.prototype.onBack = function(){
	this.game.state.start("Play");
}