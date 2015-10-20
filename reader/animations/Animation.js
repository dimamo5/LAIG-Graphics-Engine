function Animation(id, type,span){
	this.frameTime=0;
	
}
Animation.prototype.constructor=Animation;

Animation.prototype.updateFrameTime= function(nextTime){
	this.frameTime+=nextTime;
}

Animation.prototype.getMatrix= function(){
}