
function MyRectangle(scene, x1,y1,x2,y2,s,t){
    CGFobject.call(this,scene);

    this.x1 = x1;
    this.y1 = y1;
    
    this.x2 = x2;
    this.y2 = y2;

    this.s=s;
    this.t=t;

    this.initBuffers();
}

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor = MyRectangle;

MyRectangle.prototype.initBuffers = function() {

	var width = this.x2-this.x1;
	var height = this.y2 -this.y1;

    this.vertices = [
        this.x1,this.y1,0,
        this.x1,this.y2,0,
        this.x2,this.y1,0,
        this.x2,this.y2,0
    ];

    this.indices = [
        0,1,2,
        2,1,3
    ];


	this.normals = [
			0,0,1,
			0,0,1,
			0,0,1,
			0,0,1
    ]

   this.texCoords = [
		0.0, 1.0 * height / this.t,
	 	1.0 * width / this.s, 1.0 * height / this.t,
      	0.0, 0.0,
      	1.0 * width / this.s, 0.0
     ];



    this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
}