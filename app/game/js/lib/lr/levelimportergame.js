"use strict";

/**
* Import a level for a game.
*
* @namespace LR
* @class LevelImporterGame
* @constructor
*/
LR.LevelImporterGame = function() {
	LR.LevelImporter.call(this);
};

LR.LevelImporterGame.prototype = Object.create(LR.LevelImporter.prototype);
LR.LevelImporterGame.prototype.constructor = LR.LevelImporterGame;

LR.LevelImporterGame.prototype.doAfterImportObjectsAndBeforePromise = function(_objects, _game) {
	LR.LevelImporter.prototype.doAfterImportObjectsAndBeforePromise.call(this, _objects, _game);

	this.createBehaviours(_game.world);
};

LR.LevelImporterGame.prototype.importObject = function(_object, _game) {
	var cObj = LR.LevelImporter.prototype.importObject.call(this, _object, _game);

	if (cObj.behaviours) {
		if (cObj.behaviours.length > 0) {
			for (var i = 0; i < cObj.behaviours.length; i++) {
				var behaviour = cObj.behaviours[i];
				var behaviourClass = behaviour.classname;

				var Class = (window || this)[behaviourClass];
				if (Class) {
					var args = JSON.parse(behaviour.args);
					var behaviour = new Class(cObj, args);
					cObj.behaviours[i] = behaviour;
				} else {
					console.error(
						"LR.LevelImporterGame - Unkown behaviour: " + behaviourClass);
				}
			};
		}
	}

	// provisoire, en attendant de créer les bodies dans l'editeur
	if (cObj.addToCollisionManager == true) {
		var state = _game.state.getCurrentState();
		state.collisionManager.addEntity(cObj,true);
	}

	return cObj;
}

/**
* Call Behaviour.create for each behaviours.
* Need to be called once when all gameobjects are created.
* (Recursive function)
*
* @method createBehaviours
* @param {object} current importable object
*/
LR.LevelImporterGame.prototype.createBehaviours = function(_object) {
	if (_object.behaviours) {
		for (var i = 0; i < _object.behaviours.length; i++) {
			var behaviour = _object.behaviours[i];
			behaviour.create();
		};
	}

	if (_object.children) {
		for (var i = 0; i < _object.children.length; i++) {
			var child = _object.children[i];
			this.createBehaviours(child);
		};
	}
};