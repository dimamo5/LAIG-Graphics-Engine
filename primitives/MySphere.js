/**
 * MyLamp
 * @constructor
 */
 function MyLamp(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;

 	this.initBuffers();
 };

 MyLamp.prototype = Object.create(CGFobject.prototype);
 MyLamp.prototype.constructor = MyLamp;

 MyLamp.prototype.initBuffers = function() {

 	this.vertices = []; 	
 	this.indices = [];
 	this.normals = [];
 	this.texCoords=[];
	
	 // phi = pi/n_stacks;
	//teta == 360/n_slices
	//(r,teta,phi);
	
	var phi = (Math.PI/2)/this.stacks; //phi radians
	var teta = 2*Math.PI/this.slices; //teta radians
	var comprimento = 1;
	var raio = 1;
	var inc = comprimento/this.stacks; //incremento em z
	var x,y,z;

	var stepS=0;
	var stepT=0;

	for(var i=0; i <= this.stacks; i++){
		for(var vert = 0; vert < this.slices; vert++){

			x = raio*Math.sin(vert*teta)*Math.cos(i*phi); //x = rsin0cosf			
			y = raio*Math.sin(vert*teta)*Math.sin(i*phi); //y = rsin0sinf			
			z = raio*Math.cos(vert*teta); // z
			
			this.vertices.push(z); //x
			this.vertices.push(x); //y
			this.vertices.push(Math.abs(y)); //z na realidade, abs corrige em z

			this.texCoords.push(stepS,stepT);

			this.normals.push(z,x,Math.abs(y)); //correccao em z, elimina semi esfera extra(bug)
		
			stepS+=1/this.slices;
		}
		
		stepS = 0;
		stepT+= 1/this.stacks;
	}

	console.log(this.textCoords);

	//indices
	for(var i=0; i < this.stacks;i++){
		for(var k = 0; k < this.slices ; k++){
			//caso especial ligacao da ultima face de cada stack (conflito de i/k resolvido)
			if(k==this.slices-1){
				this.indices.push(i*this.slices, (i+1)*this.slices ,(i+1)*this.slices+(this.slices-1));
				this.indices.push((i+1)*this.slices+(this.slices-1), i*this.slices + (this.slices-1),i*this.slices );

			}else{
				this.indices.push(i*this.slices + k, i*this.slices+(k+1) ,(i+1)*this.slices+k);
				this.indices.push(i*this.slices+k+1,(i+1)*this.slices +k+1, (i+1)*this.slices + k);
			}
		}
	} 


 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };