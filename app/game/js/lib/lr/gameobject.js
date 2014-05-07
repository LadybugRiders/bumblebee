"use strict";
/**
* Base object 
*
* @namespace LR
* @class GameObject
* @constructor
* @param {LR.Sprite | LR.Group | LR.TileSprite} LR entity
*/
LR.GameObject = function(_entity) {
	/*
	* LR entity
	* 
	* @property entity
	* @type {LR.Sprite | LR.Group | LR.TileSprite}
	* @default null
	*/
	this.entity = _entity;

	/**
	* The collision layer index used to filter collisions
	* @property layer
	* @type {string}
	* @default "default"
	*/
	this.layer = "default";
	
	/**
	* The behaviours attached to the gameobject
	* @property behaviours
	* @type {Array}
	* @default array
	*/
	this.behaviours = new Array();

	/**
	* A reference to the current CollisionManager. Set when the GameObject is added to the CollisionManager
	* @property collisionManager
	* @type {CollisionManager}
	* @default null
	*/
	this.collisionManager = null;

	/*
	* If this is enabled, the gameobject will send contact events to its behaviours. Use enableEvents().
	* @property enableContactEvents
	* @type {boolean}
	* @default false
	*/
	this.enableContactEvents = false;

	this.debugBounds = false;

	if( _entity != null ){
		/**
		* Reference to the game
		*
		* @property game
		* @type Phaser.Game
		* @default null
		*/
		this.game = _entity.game;
		this.entity.gameobject = this;
	}

	//broadphase
	this.broadphaseListened = false;
	this.postBroadphaseCallback = null;
	this.postBroadphaseContext = null;
};

LR.GameObject.prototype.constructor = LR.GameObject;

// Called when the scene is launching. All objects are created then.
LR.GameObject.prototype.start = function() {
	if (this.entity.exists && this.behaviours) {
		for(var i=0; i < this.behaviours.length; i++){
			if( this.behaviours[i].start != null && this.behaviours[i].enabled )
				this.behaviours[i].start();
		}
	}
};

LR.GameObject.prototype.update = function() {
	if (this.entity.exists && this.behaviours) {
		for(var i=0; i < this.behaviours.length; i++){
			if( this.behaviours[i].update != null && this.behaviours[i].enabled  )
				this.behaviours[i].update();
		}
	}
};

LR.GameObject.prototype.render = function() {
	if( this.entity.exists ){
		for(var i=0; i < this.behaviours.length; i++){
			if( this.behaviours[i].render != null && this.behaviours[i].enabled  )
				this.behaviours[i].render();
		}
	}
};

LR.GameObject.prototype.destroy = function() {
	if( this.entity.exists ){
		for(var i=0; i < this.behaviours.length; i++){
			if( this.behaviours[i].destroy != null )
				this.behaviours[i].destroy();
		}
	}
};

//============================================================
//						PHYSICS
//============================================================

/**
* Creates a body and enable physics for the gameobject
* Also creates a variable go in the {P2.Body} body
*
* @method enablePhysics
* @param {number} motionState : pick STATIC, KINEMATIC or DYNAMIC from Phaser.Physics.P2.Body. Default is DYNAMIC
* @param {string} layer : the layer of collision. null will let it to "default".
* @param {number} <optional> width : new width of the body rectangle. Won't do anything without height.
* @param {number} <optional> height : new height of the body rectangle
*/
LR.GameObject.prototype.enablePhysics = function(_motionState,_layer,_width,_height){
	if( this.body == null){
		this.game.physics.p2.enable(this.entity);
		this.body = this.entity.body;
	}
	this.body.go = this;
	this.body.debug = this.debugBounds;
	// Set Motion State
	this.setMotionState(_motionState);
	//LAYER
	if( _layer != null )
		this.layer = _layer;
	//Set Rectangle
	if( _width != null && _height != null ){
		this.body.setRectangle(_width,_height,0,0,0);
	}
	return this.entity.body;
}

/**
* Enables the behaviours of the gameobject to receive the contact events
* Without that, onBeginContact and onEndContact are never called
* @method enableEvents 
*/
LR.GameObject.prototype.enableEvents = function(){
	this.enableContactEvents = true;
	if( this.body != null ){
		this.body.onBeginContact.add(this.onBeginContact, this);
		this.body.onEndContact.add(this.onEndContact, this);
	}
}

/**
* Enables the sensor behaviour of the shapes of the GameObject
* @method enableSensor
* @param {Array} indexes Array of indexes of the shapes with we want to be sensors. If null, all the shapes will be sensors.
*/
LR.GameObject.prototype.enableSensor = function(_indexes){
	if( this.body == null)
		return;
	var shapes = this.body.data.shapes;
	if(_indexes == null){
		for(var i=0 ; i < shapes.length; i++){
			shapes[i].sensor = true;
		}
	}else{
		for(var i=0 ; i < _indexes.length; i++){
			var index = _indexes[i];
			if( index < 0 || index >= shapes.length)
				continue;
			shapes[index].sensor = true;
		}
	}
}

/**
* Disables the sensor behaviour of the shapes of the GameObject
* @method disableSensor
* @param {Array} indexes Array of indexes of the shapes with we want to be physical. If null, all the shapes will be solid.
*/
LR.GameObject.prototype.disableSensor = function(_indexes){
	if( this.body == null)
		return;
	var shapes = this.body.data.shapes;
	if(_indexes == null){
		for(var i=0 ; i < shapes.length; i++){
			shapes[i].sensor = false;
		}
	}else{
		for(var i=0 ; i < _indexes.length; i++){
			var index = _indexes[i];
			if( index < 0 || index >= shapes.length)
				continue;
			shapes[index].sensor = false;
		}
	}
}

/**
* Enable Bounds to be displayed ( if no body is affected yet, this will be effective when one is added )
* @method enableDebugBounds
*/
LR.GameObject.prototype.enableDebugBounds = function(){
	this.debugBounds = true;
	if( this.body == null)
		return;
	this.body.debug = true;
}

/**
* Disable Bounds display( if no body is affected yet, this will be effective when one is added )
* @method disableDebugBounds
*/
LR.GameObject.prototype.disableDebugBounds = function(){
	this.debugBounds = false;
	if( this.body == null)
		return;
	this.body.debug = false;
}

/**
* Changes the motion state of the gameobject body
*
*@method setMotionState
*@param {number} motionState PhysicsSettings.STATIC, PhysicsSettings.KINEMATIC or PhysicsSettings.DYNAMIC
*/
LR.GameObject.prototype.setMotionState = function(_motionState){
	if(_motionState != null){
		this.body.motionState = _motionState;
		if( _motionState == PhysicsSettings.STATIC){
			this.body.mass = 0;
		}else{
			this.body.mass = 1;
		}
	}
}

/**
* Changes the current layer of the object, resetting collisions groups
*
* @method changeLayer
* @param {string} layer
*/
LR.GameObject.prototype.changeLayer = function(_layer){
	if( this.collisionManager != null ){
		this.layer = _layer;
		this.collisionManager.changeGameObjectLayer(this,_layer,this.enableContactEvents);
	}
}

//======================================================================
//					CONTACT CALLBACK
//======================================================================

/**
* Sets the callback for the postbroadphase 
*
* @method setPostBroadPhaseCallback
* @param {method} callback
* @param {Behaviour} context
*/
LR.GameObject.prototype.setPostBroadPhaseCallback = function(_callback, _context){
	this.broadphaseListened = true;
	this.postBroadphaseContext = _context;
	this.postBroadphaseCallback = _callback;
	if( _callback == null || _context == null )
		this.broadphaseListened = false;
}

/**
* Called by the CollisionManager when the body of the GameObject is concerned in the postBroadphase
* Basically, this method is called before a collision with another body will appear.
* You can then decide if you want to let the collision happen 
* 
* First link your callback with setPostBroadPhaseCallback(callback,context)
* The callback method must return true if you want this gameobject to collide with the otherbody, false instead.
*
* NB: This is called BEFORE onBeginContact
*
* @method onPostBroadPhase
* @param {param_type} param_description
*/
LR.GameObject.prototype.onPostBroadPhase = function(_body){
	if( this.postBroadphaseCallback != null){
		return this.postBroadphaseCallback .call(this.postBroadphaseContext,_body);
	}
	return true;
}

LR.GameObject.prototype.onBeginContact = function(_otherBody, _otherShape, _myShape, _equation){
	for(var i=0; i < this.behaviours.length; i++){
		if( this.behaviours[i].onBeginContact != null && this.behaviours[i].enabled )
			this.behaviours[i].onBeginContact(_otherBody, _otherShape, _myShape, _equation);
	}
}

LR.GameObject.prototype.onContact = function(_body2){
	//console.log("contact!");
	for(var i=0; i < this.behaviours.length; i++){
		if( this.behaviours[i].onContact != null && this.behaviours[i].enabled )
			this.behaviours[i].onContact(_body2);
	}
}

LR.GameObject.prototype.onEndContact = function(_otherBody, _otherShape, _myShape){
	//console.log("===collision ends from " + this.name);
	//console.log("onBody : " + _otherBody.sprite.go.name);
	for(var i=0; i < this.behaviours.length; i++){
		if( this.behaviours[i].onEndContact != null && this.behaviours[i].enabled )
			this.behaviours[i].onEndContact(_otherBody, _otherShape, _myShape);
	}
}

//============================================================
//					BEHAVIOURS
//============================================================

/**
* Adds a behaviour to the gameobject
* @method addBehaviour
* @param {Behaviour} behaviour Behaviour instance
* @return the behaviour 
*/
LR.GameObject.prototype.addBehaviour = function(_behaviour) {
	this.behaviours.push(_behaviour);
	return _behaviour;
}

/**
* Returns the requested behaviour. If more than one is attaced, the first one is return. Use getBehaviours if you need them all
* This could be expensive. Do not do this at every frame. 
* @method getBehaviour
* @param {Behaviour} behaviour The behaviour class
* @returns {Behaviour} the behaviour, or null if not found
*/
LR.GameObject.prototype.getBehaviour = function( _script ){
	for(var i = 0 ; i < this.behaviours.length; i++){
		if(this.behaviours[i] instanceof _script)
			return this.behaviours[i];
	}
	return null;
}

/**
* Returns all the requested behaviours attached to the object. 
* This could be expensive. Do not do this at every frame. 
* @method getBehaviour
* @param {Behaviour} behaviour The behaviour class
* @returns {Array} the behaviours in an array (might be empty)
*/
LR.GameObject.prototype.getBehaviours = function( _script ){
	var array = new Array();
	for(var i = 0 ; i < this.behaviours.length; i++){
		if(this.behaviours[i] instanceof _script)
			return array.push( this.behaviours[i] );
	}
	return array;
}

/**
* Try to call the function on every behaviour attached to this GameObject 
* @method sendMessage
* @param {string} functionName
* @param {Object} messageObject : You might want to pass an object for the parameter of the function
*/
LR.GameObject.prototype.sendMessage = function(_functionName, _messageObject){
	var BH;
	for(var i=0; i < this.behaviours.length; i++){
		BH = this.behaviours[i];
		if( BH[_functionName]){
			BH[_functionName](_messageObject);
		}
	}
}

//============================================================
//						SETTERS
//============================================================
/**
* Sets the position of the GameObject. Takes the body in account
*
* @method setPosition
* @param {number} x
* @param {number} y
*/
LR.GameObject.prototype.setPosition = function(_x, _y){
	if( this.entity.body != null ){
		this.entity.body.x = _x;
		this.entity.body.y = _y;
	}else{
		this.entity.x = _x;
		this.entity.y = _y;
	}
}

//============================================================
//						GLOBALS
//============================================================

/**
* Find a gameobject by its name
*
* @method FindByName
* @param {Phaser.World | Phaser.Group | Phaser.Sprite} root Root of the search
* @param {string} name Gameobject's name
* @param {Phaser.World | Phaser.Group | Phaser.Sprite} Found gameobject
*/
LR.GameObject.FindByName = function(_root, _name) {
	var gameobject = null;

	if (_root.name === _name) {
		gameobject = _root;
	} else {
		if (_root.children) {
			var i = 0;
			while (i < _root.children.length && gameobject == null) {
				var child = _root.children[i];
				if (GameObject.FindByName(child, _name)) {
					gameobject = child;
				}

				i++;
			};
		}
	}

	return gameobject;
};