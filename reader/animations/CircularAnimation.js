function CircularAnimation(id, type, span, center, radius, startAng, rotAng) {
    Animation.call(this, id, type, span);
    
    this.center = center;
    this.radius = radius;
    this.startAng = startAng;
    this.currAng = startAng;
    this.rotAng = rotAng;
    //medido em relação à direção positiva do eixo XX
    this.endAng = startAng + rotAng;
    this.velocity;
    this.initialMatrix;
}

CircularAnimation.prototype.constructor = CircularAnimation;
CircularAnimation.prototype = Object.create(Animation.prototype);

CircularAnimation.prototype.init = function() {
    this.calcVelocity();
    this.initMatrix();
}

CircularAnimation.prototype.calcVelocity = function() {
    this.velocity = this.rotAng / (this.span * 1000);
}

//inicializa matriz inicial
CircularAnimation.prototype.initMatrix = function() {
    
    this.initMatrix = mat4.create();
    mat4.identity(this.initMatrix);
    
    mat4.translate(this.initMatrix, this.initMatrix, this.center);        
    mat4.rotateY(this.initMatrix, this.initMatrix, degToRad(this.startAng));            
    mat4.translate(this.initMatrix, this.initMatrix, vec3.fromValues(0, 0, this.radius));
}


CircularAnimation.prototype.getMatrix = function() {
    
    var rotMatrix = mat4.create();
    mat4.identity(rotMatrix);
        
    var timeDelta = this.rotAng / this.velocity ;

    console.log(this.velocity,timeDelta, this.frameTime);    

    if (this.frameTime > timeDelta && this.currAng < this.endAng && !this.done) {
        
        this.frameTime -= timeDelta;
        this.currAng += this.velocity;
    } 
    if(this.currAng >= this.endAng) {
        this.done = true;
    }
       
    rotMatrix = this.rotate(this.currAng);
      
    mat4.multiply(rotMatrix, rotMatrix, this.initMatrix);
    
    return rotMatrix;
}

CircularAnimation.prototype.rotate = function(angle) {
    
    var matrix = mat4.create();
    mat4.identity(matrix);
    
    mat4.translate(matrix, matrix, this.center);
    mat4.rotateY(matrix, matrix, degToRad(angle));

    return matrix;
}
