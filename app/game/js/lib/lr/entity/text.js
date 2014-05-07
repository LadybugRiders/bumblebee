"use strict";
/**
* Text class for webfonts
*
* @namespace Entity
* @class Text
* @constructor
* @param {Phaser.Game} game
* @param {number} x
* @param {number} y
* @param {string} _baseText Text to display
* @param {Object} style Style of the text. If null, a default one will be used
* @param {stirng} name Name of the GameObject attached
*/
LR.Entity.Text = function(_game, _x, _y, _baseText, _style, _name) {

	Phaser.Text.call(this, _game, _x, _y, _baseText,_style);

	this.anchor.setTo(0.5, 0.5);
	this.fixedToCamera = true;

	this.go = new LR.GameObject(this);
	if( _name != null ){
		this.go.name = _name;
	}else{
		this.go.name = "Text";
	}

	/**
	* String to apply before the text if bounded to a variable
	*
	* @property prefix
	* @type {string}
	* @default ""
	*/
	this.prefix = "";
	/**
	* String to apply after the text if bounded to a variable
	*
	* @property suffix
	* @type {string}
	* @default ""
	*/
	this.suffix = "";

	/**
	* The context of the bounded variable ( if any )
	*
	* @property boundContext
	* @type {Object}
	* @default null
	*/
	this.boundContext = null;

	/**
	* The name of the variable bound to this entity. 
	* The value of this variable will be displayed in this text, using prefix and suffix if they are set
	*
	* Set to null to stop listening to a variable
	*
	* @property boundVariable
	* @type {string}
	* @default null
	*/
	this.boundVariable = null;

	/**
	* When bound to a variable, defines the fixed count of digit you want
	* ie : with numberPadding == 3 , 6 will be displayed as "006"
	*
	* a value of 0 deactivates the padding
	* @property numberPadding
	* @type number
	* @default 0
	*/
	this.numberPadding = 0;
};

LR.Entity.Text.prototype = Object.create(Phaser.Text.prototype);
LR.Entity.Text.prototype.constructor = LR.Entity.Text;

// Called when the scene is launching. All objects are created then.
LR.Entity.Text.prototype.start = function() {
	if (this.go) {
		this.go.start();
	}
};

LR.Entity.Text.prototype.update = function() {
	if (this.go) {
		if (this.exists) {
			this.go.update();
		}
	}
	//display bound variable
	if( this.boundVariable != null ){
		var value = this.boundContext[this.boundVariable];

		if( typeof value == "number" && this.numberPadding > 0){
			value = this.pad( value, this.numberPadding );
		}

		this.text = this.prefix + value + this.suffix;
	}
};

LR.Entity.Text.prototype.render = function() {
	if (this.go) {
		this.go.render();
	}
};

LR.Entity.Text.prototype.destroy = function() {
	if (this.go) {
		this.go.destroy();
	}
};

/**
* Tells this text entity to display the specified variable.
* This will be effective even if the variable value changes.
*
* @method bindToVariable
* @param {string} variableName The name of the variable to bind
* @param {Object} context The context holding the variable
* @param {string} prefix String to apply before the variable value
* @param {string} suffix String to apply after the variable value
*/
LR.Entity.Text.prototype.bindToVariable = function(_variableName,_context,_prefix,_suffix) {
	this.boundVariable = _variableName;
	this.boundContext = _context;
	if( _prefix != null )
		this.prefix = _prefix;
	if( _suffix != null )
		this.suffix = _suffix;
	//this.text = this.prefix + this.boundVariable + this.suffix;
};

LR.Entity.Text.prototype.pad = function(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}