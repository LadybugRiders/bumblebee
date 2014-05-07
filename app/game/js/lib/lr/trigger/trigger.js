"use strict";

/**
* Class Trigger.
* When colliding with a valid body, it calls the function callbackName on the gameobject, with messageObject as a parameter.
*
* @namespace Behaviour
* @class Trigger
* @constructor
* @param {GameObject} gameobject
*/
LR.Behaviour.Trigger = function(_gameobject){
	LR.Behaviour.call(this,_gameobject);
	_gameobject.enableDebugBounds();
	_gameobject.enableEvents();

	/**
	* Interactive Layers that will trigger this behaviour to call the die() method onto.
	*
	* @property interactives
	* @type {Array}
	* @default Array
	*/
	this.interactives = new Array();

	/**
	* Function that will be called onto the colliding object
	*
	* @property callbackName
	* @type {string}
	* @default onTrigger
	*/
	this.callbackName = "die";

	/**
	* The message data we want to attach when we notify the gameobject it has hit the trigger.
	*
	* @property messageObject
	* @type {TriggerMessageObject}
	* @default Object instance
	*/
	this.messageObject = new LR.Misc.TriggerMessageObject();

}

LR.Behaviour.Trigger.prototype = Object.create(LR.Behaviour.prototype);
LR.Behaviour.Trigger.prototype.constructor = LR.Behaviour.Trigger;


LR.Behaviour.Trigger.prototype.create = function(_data){
	if( _data == null )
		return;

	if( _data.messageObject){
		this.messageObject = _data.messageObject;
	}
	this.callbackName = _data.callbackName;
	if( _data.interactives )
		this.interactives = _data.interactives;
}

LR.Behaviour.Trigger.prototype.onBeginContact = function(_otherBody, _myShape, _otherShape, _equation){

	//check if the colliding body is an hostile one 
	for( var i=0; i < this.interactives.length ; i++){
		//if so, send "die" message to the gameobject
		if(this.interactives[i] == _otherBody.go.layer){
			//Creates data to send
			this.messageObject.sender = this.go;
			this.messageObject.senderShape = _myShape;
			this.messageObject.collShape = _otherShape;
			this.messageObject.equation = _equation;

			_otherBody.go.sendMessage(this.callbackName,this.messageObject);
		}
	}
}