function CircularAnimation(scene,id, type, span, center, radius, startAng, rotAng) {
    Animation.call(this, scene, id, type, span);
    
    this.center = center;
    this.radius = radius;
    this.startAng = startAng;
    this.currAng = 0;
    this.rotAng = rotAng;
    this.endAng = rotAng;
    this.velocity;
    this.initialMatrix;
    this.ups = 50;
    this.timeDelta;
    
    this.lastMatrix;
    //this.init();
}

CircularAnimation.prototype.constructor = CircularAnimation;
CircularAnimation.prototype = Object.create(Animation.prototype);

CircularAnimation.prototype.init = function() {
    this.calcVelocity();
    this.initMatrix();
    this.timeDelta = 1000 / this.ups;
}

CircularAnimation.prototype.initMatrix = function() {
    
    this.initMatrix = mat4.create();
    mat4.identity(this.initMatrix);
    
   // mat4.translate(this.initMatrix, this.initMatrix, this.center);
    mat4.rotateY(this.initMatrix, this.initMatrix, degToRad(this.startAng));
    mat4.translate(this.initMatrix, this.initMatrix, vec3.fromValues(0, 0, this.radius));
    
    this.lastMatrix = this.initMatrix;
}


CircularAnimation.prototype.calcVelocity = function() {
    this.velocity = this.rotAng / (this.span * 1000);
}


CircularAnimation.prototype.getMatrix = function() {
                
    if (this.frameTime >= this.timeDelta && this.currAng < this.endAng && !this.done) {
        
        this.frameTime -= this.timeDelta;
        this.currAng += this.velocity * this.timeDelta;
      
        this.lastMatrix = this.rotate(this.currAng);
    }
    
    if (this.currAng >= this.endAng) {
        this.done = true;  //>>>>>>>>>>>>>>>>>>>>>>>>>>apagar linhas abaixo se houverem problemas
        this.currAng = 0;
        this.setInactive();
        this.scene.currentAnimation++;
    }
    
    return this.lastMatrix;
}

CircularAnimation.prototype.rotate = function(angle) {    
    var rotMatrix = mat4.create();
    mat4.identity(rotMatrix);
        
    mat4.translate(rotMatrix, rotMatrix, this.center);    
    mat4.rotateY(rotMatrix, rotMatrix, degToRad(angle));

    //puxa centro para origem
    mat4.translate(rotMatrix, rotMatrix,vec3.fromValues(-this.center[0],-this.center[1],-this.center[2]));

    mat4.multiply(rotMatrix, rotMatrix, this.initMatrix);
    
    return rotMatrix;
}
