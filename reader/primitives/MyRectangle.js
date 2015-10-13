
function MyRectangle(scene, x1,y1,x2,y2){
    CGFobject.call(this,scene);

    this.x1 = x1;
    this.y1 = y1;
    
    this.x2 = x2;
    this.y2 = y2;

    this.width = this.x2-this.x1;
	this.height = this.y2 -this.y1;

    this.initBuffers();
}

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor = MyRectangle;

MyRectangle.prototype.initBuffers = function() {

	

    this.vertices = [
        this.x1,this.y1,0,
        this.x2,this.y1,0,
        this.x1,this.y2,0,
        this.x2,this.y2,0
    ];

    this.indices = [
        1,0,2,
        1,2,3
    ];


	this.normals = [
			0,0,1,
			0,0,1,
			0,0,1,
			0,0,1
    ]

   this.texCoords = [
		0.0, 1.0 * this.height,
	 	1.0 * this.width, 1.0 * this.height,
      	0.0, 0.0,
      	1.0 * this.width, 0.0
     ];



    this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
}

MyRectangle.prototype.updateTexCoords=function(s, t){
	
    this.texCoords= [
    	0.0, 1.0 * this.height /t,
	 	1.0 * this.width /s, 1.0 * this.height /t,
      	0.0, 0.0,
      	1.0 * this.width /s, 0.0 ];

 
    this.updateTexCoordsGLBuffers();
}