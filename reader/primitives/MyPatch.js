function MyPatch(scene,order, nrDivsU,nrDivsV,controlPoint) {
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

    var cp =this.getControlPoints();
    var knot =this.getKnotPoint();
    
    var nurbsSurface = new CGFnurbsSurface(this.order,this.order,knot,knot,cp);
   
     
    getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    }
    ;
    
    var obj = new CGFnurbsObject(this.scene,getSurfacePoint,this.nrDivsU,this.nrDivsV);
    obj.display();

}
;

MyPatch.prototype.getControlPoints=function(){
    var controlPoints=[];
    var ind=0;
    for(var s=0;s<=this.order;s++){
        var temp=[];
        for(var t=0;t<=this.order;t++){
           temp.push(this.controlPoint[ind]);
           ind++;
        }
        controlPoints.push(temp);
    }
    return controlPoints;
}

MyPatch.prototype.getKnotPoint = function(){
    var antes=Array(this.order+1).fill(0);
    var depois =Array(this.order+1).fill(1);
    return antes.concat(depois);

}

//[-1.0, 0.0, 1.0, 1],[-1.0, 0.0, -1.0, 1], [1.0, 0.0, 1.0, 1],[1.0, 0.0, -1.0, 1]

MyPatch.prototype.updateTexCoords = function(s, t) {
}
;
