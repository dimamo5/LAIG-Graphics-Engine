function MyCylinder(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;
	
	this.s_ln = 1;
	this.t_ln = 0;

 	this.initBuffers();
 };

 MyCylinder.prototype = Object.create(CGFobject.prototype);
 MyCylinder.prototype.constructor = MyCylinder;

 MyCylinder.prototype.initBuffers = function() {
 
  	this.vertices = []; 	
 	this.indices = [];
 	this.normals = [];
	this.texCoords = [];

	var ang = 2*Math.PI/this.slices; //ang radians
	var comprimento = 1;
	var inc = comprimento/this.stacks; //incremento em z
	var nr_vert_face = 2*this.stacks+2; 

	for(var i=0; i <= this.stacks; i++){
		for(var vert = 0; vert <= this.slices; vert++){

			this.vertices.push(Math.cos(ang*vert));
			this.vertices.push(Math.sin(ang*vert));
			this.vertices.push(i*inc);

			this.normals.push(Math.cos(ang*vert),Math.sin(ang*vert),0);
			this.texCoords.push(this.s_ln,this.t_ln);

			this.s_ln -= 1/this.slices;
		}
		this.s_ln = 1;
		this.t_ln += 1/this.stacks;
	}

	for(var i=0; i < this.stacks;i++){
		for(var k = 0; k < this.slices ; k++){
			
				this.indices.push(i*(this.slices+1) + k, i*(this.slices+1)+(k+1) ,(i+1)*(this.slices+1)+k+1);
				this.indices.push(i*(this.slices+1)+k,(i+1)*(this.slices+1) +k+1, (i+1)*(this.slices+1) + k);
		}
	} 	

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };