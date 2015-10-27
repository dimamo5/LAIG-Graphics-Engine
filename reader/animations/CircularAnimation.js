function CircularAnimation(id, type,span,center,radius,startAng,rotAng){
	Animation.call(id,type,span);
	//this.centerX=centerX;
	//this.centerY=centerY;
	this.centerZ=centerZ;
	this.radius=radius;
	this.startAng=startAng;
	this.rotAngl=rotAng;
	
}
CircularAnimation.prototype.constructor=CircularAnimation;
CircularAnimation.prototype=Object.create(Animation.prototype);

CircularAnimation.prototype.getMatrix= function(){
}