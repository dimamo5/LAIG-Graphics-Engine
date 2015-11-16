/**
 * Represents an abstract animation
 * @constructor 
 * @param {object} scene
 * @param {string} id - linear animation's id  
 * @param {string} type - animation's type
 * @param {int} span - animation's duration 
 */
function Animation(scene, id, type, span){
	this.scene = scene;
	this.id=id;
	this.type=type;
	this.span=span;
	this.active = false;
	this.frameTime=0;
	this.currentTime;
	this.done = false;	
}

Animation.prototype.constructor = Animation;

/**
 * Updates frametime with the given value
 * @param {int} nexTime - fraction to be added
 */
Animation.prototype.updateFrameTime = function(nextTime){
	this.frameTime+=nextTime;
}

/**
 * Updates frametime with the given value
 * @param {int} nexTime - fraction to be added
 */
Animation.prototype.addTime=function(currTime){
	
	if(this.currentTime !== undefined)
		this.frameTime += (currTime-this.currentTime);
	this.currentTime=currTime;
}

/**
* Set animation as active.
*/
Animation.prototype.setActive = function(){
	this.active = true;
}

/**
* Set animation as inactive.
*/
Animation.prototype.setInactive = function(){
	this.active = false;
	this.done = false;
	this.frameTime = 0; 
	this.currentTime = undefined;
}
