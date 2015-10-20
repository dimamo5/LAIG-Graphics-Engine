function LinearAnimation(id, type,span){
	Animation.call(this,id, type,span);
	this.controlPoint=[];
	
}
LinearAnimation.prototype.constructor=LinearAnimation;
LinearAnimation.prototype=Object.create(Animation.prototype);

LinearAnimation.prototype.addControlPoint = function(x,y,z){
	this.controlPoint.push({x:x,
							y:y,
							z:z});
}

LinearAnimation.prototype.getMatrix(){
	
}