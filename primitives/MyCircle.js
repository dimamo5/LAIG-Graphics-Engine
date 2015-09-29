function MyCircle(scene, slices) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;

 	this.initBuffers();
 };

 MyCircle.prototype = Object.create(CGFobject.prototype);
 MyCircle.prototype.constructor = MyCircle;

 MyCircle.prototype.initBuffers = function() {
 
  	this.vertices = []; 	
 	this.indices = [];
 	this.normals = [];
	this.texCoords = [];

	var ang = 2*Math.PI/this.slices; //ang radians
    var z_cord = 0;


    //(slices + 1) vertices
    this.vertices.push(0,0,z_cord); //centro do circulo
    this.texCoords.push(0.5,0.5);
    this.normals.push(0,0,1);

	for(var vert = 0; vert < this.slices; vert++){

        this.vertices.push(Math.cos(ang*vert));
        this.vertices.push(Math.sin(ang*vert));
        this.vertices.push(z_cord);

        this.normals.push(0,0,1); //0,0,1 visto que o circulo esta perpedicular a z
        this.texCoords.push(Math.cos(-ang*vert)/2 + 0.5, Math.sin(-ang*vert)/2 + 0.5);
	}
 
	for(var k = 0; k < this.slices ; k++){ 

	   if(k+1 == this.slices)       
	       this.indices.push(k+1, 1,0);  
	   else 
	       this.indices.push(k+1,k+2,0);
	}


 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };