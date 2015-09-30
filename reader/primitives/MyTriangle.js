function MyTriangle(scene, x1,y1,z1,x2,y2,z2,x3,y3,z3,s,t){
    CGFobject.call(this,scene);

    //Vertice 1
    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;
    
    //Vertice 2
    this.x2 = x2;
    this.y2 = y2;
    this.z2 = z2;

    //Vertice 3
    this.x3 = x3;
    this.y3 = y3;
    this.z3 = z3;
	
	this.s=s;
	this.t=t;

    this.initBuffers();
}

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor = MyTriangle;

MyTriangle.prototype.initBuffers = function() {

    this.vertices = [
        this.x1,this.y1,this.z1,
        this.x2,this.y2,this.z2,
        this.x3,this.y3,this.z3
    ];

    this.indices = [0,1,2];

	var V1 = [this.x1-this.x2, this.y1-this.y2, this.z1-this.z2];
	var V2 = [this.x1-this.x3, this.y1-this.y3, this.z1-this.z3];
	var N = [V1[1]*V2[2]-V1[2]*V2[1], V1[2]*V2[0]-V1[0]*V2[2], V1[0]*V2[1]-V1[1]*V2[0]];


	this.normals = [
			N[0],N[1],N[2],
			N[0],N[1],N[2],
			N[0],N[1],N[2],
    ]
	
	this.texCoords = [ 
			0,0,
			this.s,this.t,
			this.s/2,0
	]

    this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
}