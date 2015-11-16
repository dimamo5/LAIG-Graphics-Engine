function MyPatch(scene, orderU, orderV, nrDivsU, nrDivsV, controlPoint) {
    CGFobject.call(this, scene);
    this.scene = scene;
    this.orderU = orderU;
    this.orderV = orderV;
    this.nrDivsU = nrDivsU;
    this.nrDivsV = nrDivsV;
    this.controlPoint = controlPoint;
    
    var cp = this.getControlPoints();
    var knotU = this.getKnotPointU();
    var knotV = this.getKnotPointV();
    
    var nurbsSurface = new CGFnurbsSurface(this.orderU,this.orderV,knotU,knotV,cp);
    
    
    getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    }
    ;
    
    this.obj = new CGFnurbsObject(this.scene,getSurfacePoint,this.nrDivsU,this.nrDivsV);

}
;

MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor = MyPatch;

MyPatch.prototype.display = function() {
    
    
    this.obj.display();

}
;

MyPatch.prototype.getControlPoints = function() {
    var controlPoints = [];
    var ind = 0;
    for (var s = 0; s <= this.orderU; s++) {
        var temp = [];
        for (var t = 0; t <= this.orderV; t++) {
            temp.push(this.controlPoint[ind]);
            ind++;
        }
        controlPoints.push(temp);
    }
    return controlPoints;
}

MyPatch.prototype.getKnotPointU = function() {
    var antes = Array(this.orderU + 1).fill(0);
    var depois = Array(this.orderU + 1).fill(1);
    return antes.concat(depois);

}

MyPatch.prototype.getKnotPointV = function() {
    var antes = Array(this.orderV + 1).fill(0);
    var depois = Array(this.orderV + 1).fill(1);
    return antes.concat(depois);

}

//[-1.0, 0.0, 1.0, 1],[-1.0, 0.0, -1.0, 1], [1.0, 0.0, 1.0, 1],[1.0, 0.0, -1.0, 1]

MyPatch.prototype.updateTexCoords = function(s, t) {
}
;
