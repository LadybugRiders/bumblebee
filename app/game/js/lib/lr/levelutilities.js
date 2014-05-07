"use strict";

/**
* Utilities for level import/export.
*
* @namespace LR
* @class LevelUtilities
* @constructor
*/
LR.LevelUtilities = function() {

};

LR.LevelUtilities.OBJECT_ATTRIBUTES = [
	"name", "x", "y", "width", "height", "behaviours", "layer", "visible",
	"key", "frame", "addToCollisionManager"
];

LR.LevelUtilities.TYPE_GAME_OBJECT = "GameObject";
LR.LevelUtilities.TYPE_SPRITE = "LR.Entity.Sprite";
LR.LevelUtilities.TYPE_TEXT = "Text";
LR.LevelUtilities.TYPE_GROUP = "LR.Entity.Group";
LR.LevelUtilities.TYPE_PHASER_GROUP = "Phaser.Group";
LR.LevelUtilities.TYPE_PHASER_WORLD = "Phaser.World";

LR.LevelUtilities.CreateEntityByType = function(_object, _game) {
	var cObj = null;
	//console.log(_object);
	if (_object.type === LR.LevelUtilities.TYPE_SPRITE) {
		cObj = new LR.Entity.Sprite(_game,0,0);//enable dragging		
		//add Input Handler, for dragging and other events
		cObj.go.addBehaviour(new LR.Editor.Behaviour.EntityInputHandler(cObj.go));
		_game.add.existing(cObj);
	} else if (_object.type === LR.LevelUtilities.TYPE_GROUP) {
		cObj = new LR.Entity.Group(_game);
		_game.add.existing(cObj);
	} else if (_object.type === LR.LevelUtilities.TYPE_PHASER_WORLD) {
		//cObj = new Phaser.World(_game);
	}
	return cObj;
}

LR.LevelUtilities.GetType = function(_object) {
	var type = "";

	if (_object instanceof LR.Entity.Sprite) {
		type = LR.LevelUtilities.TYPE_SPRITE;
	} else if (_object instanceof LR.Entity.Group) {
		type = LR.LevelUtilities.TYPE_GROUP;
	} else if (_object instanceof Phaser.World) {
		type = "Phaser.World";
	}

	return type;
};