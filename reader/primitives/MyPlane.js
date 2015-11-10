function MyPlane(scene, nrDivs) {
    CGFobject.call(this, scene);
    this.scene = scene;
    
    // nrDivs = 1 if not provided
    nrDivs = typeof nrDivs !== 'undefined' ? nrDivs : 1;
    
    this.nrDivs = nrDivs;
}
;

MyPlane.prototype = Object.create(CGFobject.prototype);
MyPlane.prototype.constructor = MyPlane;

MyPlane.prototype.display = function() {
    
    
    
    
    var nurbsSurface = new CGFnurbsSurface(1,1,[0, 1, 0, 1],[0, 1, 0, 1],[[ [-1.0, 0.0, 1.0, 1],[-1.0, 0.0, -1.0, 1]], [[1.0, 0.0, 1.0, 1],[1.0, 0.0, -1.0, 1]]]);
    
    
    getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    }
    ;
    
    var obj = new CGFnurbsObject(this.scene,getSurfacePoint,this.nrDivs,this.nrDivs);
    obj.display();

}
;

MyPlane.prototype.updateTexCoords = function(s, t) {
}
;
