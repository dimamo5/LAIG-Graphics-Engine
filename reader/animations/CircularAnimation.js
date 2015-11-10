function CircularAnimation(id, type, span, center, radius, startAng, rotAng){
	Animation.call(id,type,span); //super
	//this.centerX=centerX;
	//this.centerY=centerY;
	this.centerZ=centerZ;
	this.radius=radius;
	this.startAng=startAng; //medido em relação à direção positiva do eixo XX
	this.rotAngl=rotAng;
	
}
CircularAnimation.prototype.constructor=CircularAnimation;
CircularAnimation.prototype = Object.create(Animation.prototype);

CircularAnimation.prototype.getMatrix= function(){
}