"use strict";
/**
* Plugin class that sends input messages to the binded object according to the state of the game
* It's basically used to call different methods, bound to a key, according to the state of the game (in game, paused , menu, etc...)
* It also allows you to change quickly an action key for all the game input
*
* How to use it:
* game.plugins.add(Phaser.Plugin.InputManager);
*
* Common usage :
* 1. Create Keys Data :
*	 var keysData = {"valid" : Phaser.Keyboard.SPACEBAR, "cancel" : Phaser.Keyboard.C };
* 2. Init 
*	 game.inputManager.init(keysData);
* 3. Bind a Key to an Action 
*	 game.inputManager.bindKeyPress("valid",callback,context);
*
* Warning: this class is a singleton.
* @class InputManager
* @constructor
*/
Phaser.Plugin.InputManager = function(_game, _parent) {

	if (Phaser.Plugin.InputManager.INSTANCE == null) {
		Phaser.Plugin.call(this, _game, _parent);

		this.router = new Object();

		Phaser.Plugin.InputManager.INSTANCE = this;
		_game.inputManager = Phaser.Plugin.InputManager.INSTANCE;
	}

	this.keysData = new Object();
	this.eventsTarget = new Object();

	this.mouseEventsTargets = new Object();

	return Phaser.Plugin.InputManager.INSTANCE;
};

Phaser.Plugin.InputManager.prototype = Object.create(Phaser.Plugin);
Phaser.Plugin.InputManager.prototype.constructor = Phaser.Plugin.InputManager;

Phaser.Plugin.InputManager.INSTANCE = null;

//
// Creates Keys Data
//
Phaser.Plugin.InputManager.prototype.init = function(){

	this.game.input.onDown.add(this.onMouseDown,this);	
	this.mouseEventsTargets["justPressed"] = new Array();

	//Go through all input keys of the game
	for( var keyName in InputSettings.keys ){
		console.log(keyName);
		//the data of the key
		var data = new Object();
		data.id = InputSettings.keys[keyName];
		data.onDown = this.onValidDown; // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		//add a listener in the game for this key
		data.key = this.game.input.keyboard.addKey(data.id);
		//and add our callback
		data.key.onDown.add( data.onDown,this);
		//also create an object for events that we'll be forwarded
		data.eventsPress = new Array();
		data.eventsRelease = new Array();

		this.keysData[keyName] = data;
	}
}

Phaser.Plugin.InputManager.prototype.onMouseDown = function(){
	var array = this.mouseEventsTargets["justPressed"];
	for( var i=0; i < array.length ; i++ ){
		array[i].callback.call(array[i].context);
	}
}

Phaser.Plugin.InputManager.prototype.onValidDown = function(){
	for(var i=0; i < this.keysData["valid"].eventsPress.length; i++){
		var dataEvent = this.keysData["valid"].eventsPress[0];
		dataEvent.callback.call(dataEvent.context);
		//console.log(this.keysData["valid"].eventsPress[0]);
	}
}


Phaser.Plugin.InputManager.prototype.bindKeyPress = function(_actionInputName,_functionBinded,_objectTarget,_active,_priority){
	if(this.keysData[_actionInputName] == null ){
		console.log(_actionInputName + " key not found");
		return;
	}
	//this is the data for the key
	var data = this.keysData[_actionInputName];
	if( data != null ){
		//push the event
		data.eventsPress.push({
				callback : _functionBinded,
				context : _objectTarget,
				active : true,
				priority : 0
				}
			);
	}
}

Phaser.Plugin.InputManager.prototype.bindMousePress = function(_callback,_context){
	this.mouseEventsTargets["justPressed"].push({ callback : _callback , context : _context } );
}
