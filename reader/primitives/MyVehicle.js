function MyVehicle(scene) {
    CGFobject.call(this, scene);
    this.scene = scene;
    
    //TODO fazer isto com PATCH
    
    var nurbsSurface = new CGFnurbsSurface(2,3,[0, 0, 0, 1, 1, 1],[0, 0, 0, 0, 1, 1, 1, 1],[[[0, 1, 0, 1], [1, 0.9, 0, 1], [0.3, 0.3, 0, 1], [0.1, 0, 0, 1]], 
    [[0, 1, 0, 1], [0.8, 0.9, 0.8, 1], [0.5, 0.3, 0.5, 1], [0.1, 0, 0.1, 1]], 
    [[0, 1, 0, 1], [0, 0.9, 1, 1], [0, 0.3, 0.3, 1], [0, 0, 0.1, 1]]]);
    
    this.ballon = new MyPatch(scene,2,3,10,10,[[0, 1, 0, 1], [1, 0.9, 0, 1], [0.3, 0.3, 0, 1], [0.1, 0, 0, 1], 
    [0, 1, 0, 1], [0.8, 0.9, 0.8, 1], [0.5, 0.3, 0.5, 1], [0.1, 0, 0.1, 1], 
    [0, 1, 0, 1], [0, 0.9, 1, 1], [0, 0.3, 0.3, 1], [0, 0, 0.1, 1]]);
    
    getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    }
    ;
    
    this.boxTexture = new CGFtexture(scene,"resources/wood.png");
    this.balaoTexture = new CGFtexture(scene,"resources/rainbow.jpg");
    
    //this.ballon = new CGFnurbsObject(this.scene,getSurfacePoint,10,10);
    this.box = new MyCylinderSurface(scene,1,1,1,2,10);
    this.base = new MyCylinderSurface(scene,0.01,0,1,2,15);

}
;

MyVehicle.prototype = Object.create(CGFobject.prototype);
MyVehicle.prototype.constructor = MyVehicle;


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
