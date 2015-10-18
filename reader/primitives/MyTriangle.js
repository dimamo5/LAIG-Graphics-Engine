function MyTriangle(scene, x1,y1,z1,x2,y2,z2,x3,y3,z3){
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

	this.ac = Math.sqrt((x3 - x1) * (x3 - x1) + 
			 		   (y3 - y1) * (y3 - y1) +
			 		   (z3 - z1) * (z3 - z1));

	this.ab = Math.sqrt((x2 - x1) * (x2 - x1) + 
			 		   (y2 - y1) * (y2 - y1) +
			 		   (z2 - z1) * (z2 - z1));

	this.bc = Math.sqrt((x3 - x2) * (x3 - x2) + 
			 		   (y3 - y2) * (y3 - y2) +
			 		   (z3 - z2) * (z3 - z2));



	this.cosAlpha = (-this.ac*this.ac + this.ab*this.ab + this.bc * this.bc) / (2 * this.ab * this.bc);
	this.cosBeta =  ( this.ac*this.ac - this.ab*this.ab + this.bc * this.bc) / (2 * this.ac * this.bc);
	this.cosGamma = ( this.ac*this.ac + this.ab*this.ab - this.bc * this.bc) / (2 * this.ac * this.ab);

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
    ];
	
	this.texCoords = [
		0.0, 0.0,
	  	this.ab, 0.0,
	  	this.ac*Math.cos(this.alpha), this.bc*Math.sin(this.alpha),	
    ];

    /*console.log(this.ab);
    console.log(this.ac);
    console.log(this.bc);

    console.log("Alpha:"+this.alpha);
    console.log("beta:"+this.beta);
    console.log("gamma:"+this.gamma);*/

    this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MyTriangle.prototype.updateTexCoords = function(s, t) {
	
	this.texCoords = [
	  0.0, 1.0,
	  this.ab/s, 1.0,
	  (this.ab-this.bc*Math.cos(this.gamma))/s,1- (this.bc*Math.sin(this.gamma))/t,	  
    ];

	this.updateTexCoordsGLBuffers();
};