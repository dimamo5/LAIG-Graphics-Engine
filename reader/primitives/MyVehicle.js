function MyVehicle(scene) {
    CGFobject.call(this, scene);
    this.scene = scene;
    
    //TODO fazer isto com PATCH
    
    var nurbsSurface = new CGFnurbsSurface(2,3,[0, 0, 0, 1, 1, 1],[0, 0, 0, 0, 1, 1, 1, 1],[[[0, 1, 0, 1], [1, 0.9, 0, 1], [0.3, 0.3, 0, 1], [0.1, 0, 0, 1]], 
    [[0, 1, 0, 1], [0.8, 0.9, 0.8, 1], [0.5, 0.3, 0.5, 1], [0.1, 0, 0.1, 1]], 
    [[0, 1, 0, 1], [0, 0.9, 1, 1], [0, 0.3, 0.3, 1], [0, 0, 0.1, 1]]]);
    
    
    getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    }
    ;
    
    this.boxTexture = new CGFtexture(scene,"resources/wood.png");
    this.balaoTexture = new CGFtexture(scene,"resources/rainbow.jpg");
    
    this.ballon = new CGFnurbsObject(this.scene,getSurfacePoint,10,10);
    this.box = new MyCylinderSurface(scene,1,1,1,2,10);
    this.base = new MyCylinderSurface(scene,0.01,0,1,2,15);

    //this.initAnimations(); 
}
;

MyVehicle.prototype = Object.create(CGFobject.prototype);
MyVehicle.prototype.constructor = MyVehicle;

MyVehicle.prototype.initAnimations = function() {
    
    var cps = [];
    
    //1ª animacao a executar
    this.scene.animations.push(new LinearAnimation(1,3,"linear"));
    var cp1 = [vec3.fromValues(0, 0.20, 1.5), vec3.fromValues(-0.2, 0.4, 1.8), vec3.fromValues(-0.4, 0.8, 2.2), vec3.fromValues(-0.8, 1.4, 2.8)];
    cps.push(cp1);
    
    //2º animacao a executar     
    this.scene.animations.push(new CircularAnimation(3,8,"circular","000",2.8,0,360));        //TODO ACTUALIZAR CONSTRUTOR CONVENIENTEMENTE

    //3º animacao a executar  
    this.scene.animations.push(new LinearAnimation(2,3,"linear"));
    var cp2 = cp1.slice().reverse();     //inverte ordem dos control point para fazer movimento reverso (aterrar)
    cps.push(cp2);

    console.log(cps);
    //adiciona controlpoints a animacao respectiva   
    for (var i = 0, k=0; i < 3; i+=2, k++) {
        for (var j = 0; j < cps[k].length; j++) {         
            this.scene.animations[i].addControlPoint(cps[k][j][0], cps[k][j][1], cps[k][j][2]);      // x, y, z  
        }
    }
}


MyVehicle.prototype.display = function() {
    
    this.scene.pushMatrix();
    this.scene.translate(1, 0.15, 1.5);
    this.scene.popMatrix();
    
    this.scene.pushMatrix();
    this.scene.scale(0.1, 0.1, 0.1);
    this.scene.translate(0, -2, 0);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.boxTexture.bind();
    this.box.display();
    this.base.display();
    this.scene.popMatrix();
    
    this.scene.pushMatrix();
    this.scene.translate(0, -0.09, 0);
    this.scene.scale(0.1, 1, 0.1);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.base.display();
    this.scene.popMatrix();
    
    this.scene.pushMatrix();
    this.balaoTexture.bind();
    this.ballon.display();
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.ballon.display();
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.ballon.display();
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.ballon.display();
    this.scene.popMatrix();
}
;

MyVehicle.prototype.updateTexCoords = function(s, t) {
}
;
