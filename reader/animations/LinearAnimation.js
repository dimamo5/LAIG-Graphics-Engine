function LinearAnimation(id, type,span){
	Animation.call(this,id, type,span);
	this.controlPoint=[];
	this.currentControlPoint=0;
	this.timeControlPoint=(span/this.controlPoint.length)*1000; //Time do reach each control point in miliseconds
	this.totalDistance=0;
	
}
LinearAnimation.prototype.constructor=LinearAnimation;
LinearAnimation.prototype=Object.create(Animation.prototype);

LinearAnimation.prototype.addControlPoint = function(x,y,z){
	this.controlPoint.push(vec3.fromValues(x,y,z));
}

LinearAnimation.prototype.getMatrix=function(){
	var matrix=mat4.create();
	mat4.identity(matrix);
	mat4.traslate(matrix,matrix,vec3.fromValues(x*this.timeFrame/this.timeControlPoint,y*this.timeFrame/this.timeControlPoint,z*this.timeFrame/this.timeControlPoint));

	return mat4;
}

LinearAnimation.prototype.calcDistance=function(){
	for(var i=0;i< this.controlPoint.length;i++){
		if(i==0){
			this.totalDistance+=vec3.distance(vec3.fromValues(0,0,0),this.controlPoint[i]);
		}else{
			this.totalDistance+=vec3.distance(this.controlPoint[i-1],this.controlPoint[i]);
		}
	}
}