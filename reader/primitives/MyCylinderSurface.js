function MyCylinderSurface(scene,height, bRadius, tRadius, stacks, slices) {
 	CGFobject.call(this,scene);
	
	this.slices=slices;
	this.stacks=stacks;
	this.height= height;

	this.bRadius = bRadius;
	this.tRadius = tRadius;

 	this.initBuffers();
};

MyCylinderSurface.prototype = Object.create(CGFobject.prototype);
MyCylinderSurface.prototype.constructor = MyCylinderSurface;

//
MyCylinderSurface.prototype.initBuffers = function() {
    
    var angulo_circ = 2*Math.PI/this.slices;
    var angulo_incl = Math.atan((this.bRadius - this.tRadius)/this.height);
	var decremento = (this.tRadius - this.bRadius) / this.stacks;
	var raio_actual;

	var s=0,t=0;

	this.vertices=[];
 	this.normals=[];
 	this.texCoords=[];

 	for(i = 0; i <= this.stacks;i++){
 		for(j = 0; j <= this.slices;j++){
			raio_actual = i * decremento + this.bRadius;
			
			var x = Math.cos(j*angulo_circ);
			var y = Math.sin(j*angulo_circ);

 			this.vertices.push(raio_actual * x,
 							   raio_actual * y,
 							  (this.height/this.stacks)*i);

			var x_normal = raio_actual * x * Math.cos(angulo_incl);  // x = r*cos(teta)*cos(alpha)   CMAT OP
			var y_normal = raio_actual * y * Math.cos(angulo_incl);	 // y = r*sin(teta)*cos(alpha)
			var z_normal = raio_actual * Math.sin(angulo_incl);		 // z = r*sin(alpha)
					
 			this.normals.push(x_normal,y_normal,z_normal);

 			this.texCoords.push(s,t);
 			s+=1/this.slices;
 		}
 		s=0;
 		t += 1/this.stacks;
 	}

 	this.indices=[];

	/*for(i=0; i < this.stacks;i++){
		for(j=0; j < this.slices;j++){
			this.indices.push(i*this.slices+j,i*this.slices+((j+1)%this.slices),(i+1)*this.slices+(j+1)%this.slices);
			this.indices.push(i*this.slices+j,(i+1)*this.slices+((j+1)%this.slices),(i+1)*this.slices+j);
		}
	}*/

	for(var i=0; i < this.stacks;i++){
		for(var k = 0; k < this.slices ; k++){
			
				this.indices.push(i*(this.slices+1) + k, i*(this.slices+1)+(k+1) ,(i+1)*(this.slices+1)+k+1);
				this.indices.push(i*(this.slices+1)+k,(i+1)*(this.slices+1) +k+1, (i+1)*(this.slices+1) + k);
		}
	}

	console.log(this.vertices.length/3);

    this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
 };