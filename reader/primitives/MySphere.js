/**
 * MyLamp
 * @constructor
 */
 function MySphere(scene, radius,slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;
	this.radius=radius;

 	this.initBuffers();
 };

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

	for(var i=0; i <= this.stacks; i++){
		for(var vert = 0; vert <= this.slices; vert++){

			x = raio*Math.sin(vert*teta)*Math.cos(i*phi); //x = rsin0cosf			
			y = raio*Math.sin(vert*teta)*Math.sin(i*phi); //y = rsin0sinf			
			z = raio*Math.cos(vert*teta); // z
			
			this.vertices.push(z); //x
			this.vertices.push(x); //y
			this.vertices.push(y); //z na realidade, abs corrige em z

			this.texCoords.push(stepS,stepT);

			this.normals.push(z,x,y); //correccao em z, elimina semi esfera extra(bug)
		
			stepS+=1/this.slices;
		}
		
		stepS = 0;
		stepT+= 1/this.stacks;
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