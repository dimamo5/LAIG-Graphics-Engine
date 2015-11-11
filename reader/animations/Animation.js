function Animation(id, span, type){
	this.id=id;
	this.type=type;
	this.span=span;

	this.frameTime=0;
	this.currentTime;
	this.done = false;	
}

Animation.prototype.constructor=Animation;

Animation.prototype.updateFrameTime = function(nextTime){
	this.frameTime+=nextTime;
}

Animation.prototype.getMatrix= function(){
}

Animation.prototype.addTime=function(currTime){
	
	if(this.currentTime !== undefined)
		this.frameTime+=(currTime-this.currentTime);
	this.currentTime=currTime;
}