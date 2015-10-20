function CircularAnimation(this,id, type,span,centerX,centerY,centerZ,radious,startAng,rotAng){
	Animation.call(id,type,span);
	this.centerX=centerX;
	this.centerY=centerY;
	this.centerZ=centerZ;
	this.radious=radious;
	this.startAng=startAng;
	this.rotAngl=rotAng;
	
}
CircularAnimation.prototype.constructor=CircularAnimation;
CircularAnimation.prototype=Object.create(Animation.prototype);

CircularAnimation.prototype.getMatrix= function(){
}