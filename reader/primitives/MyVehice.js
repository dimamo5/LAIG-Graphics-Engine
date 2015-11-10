function MyVehicle(scene) {
    CGFobject.call(this, scene);
    this.scene = scene;
    
}
;

MyVehicle.prototype = Object.create(CGFobject.prototype);
MyVehicle.prototype.constructor = MyVehicle;

MyVehicle.prototype.display = function() {
    
       //TODO Fazer cenas
}
;

MyVehicle.prototype.updateTexCoords = function(s, t) {
}
;
