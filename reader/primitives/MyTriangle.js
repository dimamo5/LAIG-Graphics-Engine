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

	this.a = Math.sqrt((x1 - x3) * (x1 - x3) + 
			 		   (y1 - y3) * (y1 - y3) +
			 		   (z1 - z3) * (z1 - z3));

	this.b = Math.sqrt((x2 - x1) * (x2 - x1) + 
			 		   (y2 - y1) * (y2 - y1) +
			 		   (z2 - z1) * (z2 - z1));

	this.c = Math.sqrt((x3 - x2) * (x3 - x2) + 
			 		   (y3 - y2) * (y3 - y2) +
			 		   (z3 - z2) * (z3 - z2));

	this.cosAlpha = (-this.a*this.a + this.b*this.b + this.c * this.c) / (2 * this.b * this.c);
	this.cosBeta =  ( this.a*this.a - this.b*this.b + this.c * this.c) / (2 * this.a * this.c);
	this.cosGamma = ( this.a*this.a + this.b*this.b - this.c * this.c) / (2 * this.a * this.b);

	this.beta = Math.acos(this.cosBeta);
	this.alpha = Math.acos(this.cosAlpha);
	this.gamma = Math.acos(this.cosGamma);
	

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
	  (this.c - this.a * Math.cos(this.beta)), this.a*Math.sin(this.beta),
	  0.0, 0.0,
	  this.c, 0
    ];

    this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
}

MyTriangle.prototype.updateTexCoords = function(s, t) {
	
	this.texCoords = [
	  (this.c - this.a * Math.cos(this.beta))/s, (this.a*Math.sin(this.beta))/t,
	  0.0, 0.0,
	  this.c/s, 0
    ];

	this.updateTexCoordsGLBuffers();
}