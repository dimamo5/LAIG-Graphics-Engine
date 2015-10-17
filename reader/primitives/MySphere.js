/**
 * MySphere
 * @constructor
 */
 
 function MySphere(scene, radius, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;
	this.radius=radius;

 	this.initBuffers();
 }

 MySphere.prototype = Object.create(CGFobject.prototype);
 MySphere.prototype.constructor = MySphere;

 MySphere.prototype.initBuffers = function() {

this.vertices = []; 	
 	this.indices = [];
 	this.normals = [];
 	this.texCoords=[];
	
	
	var teta = (Math.PI)/this.stacks; //phi radians
	var phi = 2*Math.PI/this.slices; //teta radians
	var comprimento = 1;
	var raio = 1;
	var inc = comprimento/this.stacks; //incremento em z
	var x,y,z;

	var stepS=0;
	var stepT=0;

	for(var stack=0; stack <= this.stacks; stack++){
		for(var slice = 0; slice <= this.slices; slice++){

			x = this.radius*Math.sin(stack*teta)*Math.cos(slice*phi); //x = rsin0cosf			
			y = this.radius*Math.sin(stack*teta)*Math.sin(slice*phi); //y = rsin0sinf			
			z = this.radius*Math.cos(stack*teta); // z
			
			stepS=slice/(this.slices);
			stepT= stack/(this.stacks);

			this.vertices.push(x); //x
			this.vertices.push(y); //y
			this.vertices.push(z); //z 

			this.texCoords.push(stepS,stepT);

			this.normals.push(x,y,z);

		}
		
	}


	for(var i=0; i < this.stacks;i++){
		for(var k = 0; k < this.slices ; k++){
			
				this.indices.push(i*(this.slices+1) + k,(i+1)*(this.slices+1) + k  ,(i+1)*(this.slices+1)+k+1);
				this.indices.push(i*(this.slices+1) + k,(i+1)*(this.slices+1) + k+1, i*(this.slices+1) + k+1);
		}
	}


 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

MySphere.prototype.updateTexCoords = function(s, t) {
};