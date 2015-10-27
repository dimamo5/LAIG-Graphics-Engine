function Animation(id, type,span){
	this.frameTime=0;
	this.currentTime;
	
}
Animation.prototype.constructor=Animation;

Animation.prototype.updateFrameTime= function(nextTime){
	this.frameTime+=nextTime;
}

Animation.prototype.getMatrix= function(){
}

Animation.prototype.addTime=function(currTime){
	if(this.currentTime!==undefined)
		this.frameTime+=(currTime-this.currentTime);
	this.currentTime=currTime;
}