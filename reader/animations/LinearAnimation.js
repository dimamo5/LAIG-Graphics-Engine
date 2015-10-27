function LinearAnimation(id, type, span) {
    Animation.call(this, id, type, span);
    this.controlPoint = [];
    this.currentControlPoint = 0;
    this.velocity;
    this.totalDistance = 0;

}
LinearAnimation.prototype.constructor = LinearAnimation;
LinearAnimation.prototype = Object.create(Animation.prototype);

LinearAnimation.prototype.addControlPoint = function(x, y, z) {
    this.controlPoint.push(vec3.fromValues(x, y, z));
}

LinearAnimation.prototype.getMatrix = function() {
    var vector = this.getDeslocationVector();
    var timeControlPoint = vec3.length(vector) / this.velocity;

    if (this.frameTime > timeControlPoint && this.currentControlPoint < (this.controlPoint.length - 2)) {
        this.currentControlPoint++;
        this.frameTime-=timeControlPoint;

    }
    
    var matrix = mat4.create();
    mat4.identity(matrix);
    //if(this.currentControlPoint<(this.controlPoint.length - 1))
    mat4.translate(matrix, matrix, vec3.fromValues(vector[0] * this.frameTime / timeControlPoint, vector[1] * this.frameTime / timeControlPoint, vector[2] * this.frameTime / timeControlPoint));
    
    return matrix;
}

LinearAnimation.prototype.calcDistance = function() {
    for (var i = 0; i < this.controlPoint.length; i++) {
        if (i == 0) {
            this.totalDistance += vec3.distance(vec3.fromValues(0, 0, 0), this.controlPoint[i]);
        } else {
            this.totalDistance += vec3.distance(this.controlPoint[i - 1], this.controlPoint[i]);
        }
    }
    this.velocity = this.totalDistance / (this.span * 1000);
}

LinearAnimation.prototype.getDeslocationVector = function() {
    var vector = vec3.create();
    return vec3.subtract(vector, this.controlPoint[this.currentControlPoint + 1], this.controlPoint[this.currentControlPoint]);
}

/*LinearAnimation.prototype.addTime=function(currTime){
	if(this.currentTime!==undefined)
		this.frameTime+=(currTime-this.currentTime);
	this.currentTime=currTime;

}*/