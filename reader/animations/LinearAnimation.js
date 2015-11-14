function LinearAnimation(id, type, span) {
    Animation.call(this, id, type, span);
    //super
    this.controlPoint = [];
    this.currentControlPoint = 1;
    this.velocity;
    this.totalDistance = 0;
    this.deslocationVector;

}
LinearAnimation.prototype.constructor = LinearAnimation;
LinearAnimation.prototype = Object.create(Animation.prototype);

LinearAnimation.prototype.init = function() {
    this.calcDistance();
    this.calcVelocity();
    this.deslocationVector = this.getDeslocationVector();
}


LinearAnimation.prototype.addControlPoint = function(x, y, z) {
    this.controlPoint.push(vec3.fromValues(x, y, z));
    //cria vector com os 3 argumentos
}

LinearAnimation.prototype.getDeslocationVector = function() {
    var vector = vec3.create();
    return vec3.subtract(vector, this.controlPoint[this.currentControlPoint], this.controlPoint[this.currentControlPoint - 1]);
}


LinearAnimation.prototype.getMatrix = function() {
    var timeControlPoint = vec3.length(this.deslocationVector) / this.velocity;
        
   //console.log(this.velocity, timeControlPoint, this.frameTime);
        
    if (this.frameTime > timeControlPoint && this.currentControlPoint <= (this.controlPoint.length) && !this.done) {
        
        this.currentControlPoint++;
        this.frameTime -= timeControlPoint;
        
        if (this.currentControlPoint == this.controlPoint.length) {
            this.deslocationVector = vec3.fromValues(0, 0, 0);
        } else {
            this.deslocationVector = this.getDeslocationVector();
        }
    }
    
    if (this.currentControlPoint == this.controlPoint.length) {
        this.done = true;
        timeControlPoint = 1;
    }
    
    var matrix = mat4.create();
    mat4.identity(matrix);
    
    mat4.translate(matrix, matrix, vec3.fromValues(
    this.deslocationVector[0] * this.frameTime / timeControlPoint + this.controlPoint[this.currentControlPoint -1][0], 
    this.deslocationVector[1] * this.frameTime / timeControlPoint + this.controlPoint[this.currentControlPoint -1][1], 
    this.deslocationVector[2] * this.frameTime / timeControlPoint + this.controlPoint[this.currentControlPoint -1][2]));
      
    if (this.done == true) {  //mantem posicao final        
        var vector = vec3.create();
        vec3.subtract(vector, this.controlPoint[this.currentControlPoint - 1], this.controlPoint[this.currentControlPoint - 2]);
        mat4.rotateY(matrix, matrix, this.calcRotation(vector));
    } 
    else {
        mat4.rotateY(matrix, matrix, this.calcRotation(this.deslocationVector));
    }

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
}

LinearAnimation.prototype.calcVelocity = function() {
    this.velocity = this.totalDistance / (this.span * 1000);
}


LinearAnimation.prototype.calcRotation = function(deslocationVector) {
    return Math.atan2(deslocationVector[0], deslocationVector[2]);
}


LinearAnimation.prototype.linearInterpolation = function(point1, point2, delta) {
    //delta [0,1]
    var interpolatedPoint = [3];
    
    for (var i = 0; i < 3; i++) {
        interpolatedPoint[i] = (1 - delta) * point1[i] + delta * point2[i];
    }
    
    return interpolatedPoint;
}
