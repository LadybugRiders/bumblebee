"use strict";

LR.Entity.State = function(_game) {
	Phaser.State.call(this, _game);
};

LR.State.prototype = Object.create(Phaser.State.prototype);
LR.State.prototype.constructor = LR.State;