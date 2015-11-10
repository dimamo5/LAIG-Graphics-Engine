function MyPatch(scene,order nrDivsU,nrDivsV,controlPoint) {
    CGFobject.call(this, scene);
    this.scene = scene;
    this.order=order;
    this.nrDivsU=nrDivsU;
    this.nrDivsV=nrDivsV;
    this.controlPoint=controlPoint;
    
}
;

MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor = MyPatch;

MyPatch.prototype.display = function() {

    var nurbsSurface = new CGFnurbsSurface(this.order,this.order,[0, 1, 0, 1],[0, 1, 0, 1],[[ [-1.0, 0.0, 1.0, 1],[-1.0, 0.0, -1.0, 1]], [[1.0, 0.0, 1.0, 1],[1.0, 0.0, -1.0, 1]]]);
   
     
    getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    }
    ;
    
    var obj = new CGFnurbsObject(this.scene,getSurfacePoint,this.nrDivs,this.nrDivs);
    obj.display();

}
;

MyPatch.prototype.getControlPoints(this.controlPoint,u,v){
    var controlPoints=[];
    for(var s=0;s<=u;s++){
        var temp=[];
        for(var t=0;t<=v;t++){
           temp.push(this.controlPoint[s*t+t]);
        }
        controlPoints.push(temp);
    }
    return controlPoints;
}

//[-1.0, 0.0, 1.0, 1],[-1.0, 0.0, -1.0, 1], [1.0, 0.0, 1.0, 1],[1.0, 0.0, -1.0, 1]

MyPatch.prototype.updateTexCoords = function(s, t) {
}
;
