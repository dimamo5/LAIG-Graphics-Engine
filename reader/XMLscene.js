function XMLscene() {
    CGFscene.call(this);
	
    this.graph_tree = new GraphTree();  //cria arvore (grafo) que aramazena nodes/leafs
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

	this.luz1 = true;
	this.luz2 = true;
	this.luz3 = true;

    this.initCameras();
    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);	
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
	
	this.enableTextures(true);
	
	this.materialDefault = new CGFappearance(this);

	this.axis=new CGFaxis(this);

	this.setUpdatePeriod(100);
};

XMLscene.prototype.initLights = function () {
	
	this.setGlobalAmbientLight(0,0,0,1.0);

	this.shader.bind();

	this.shader.unbind();
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	this.setGlobalAmbientLight(this.ambient.r, this.ambient.g, this.ambient.b, this.ambient.a);
	this.camera.near=this.frustum.near;
	this.camera.far=this.frustum.far;
	this.axis = new CGFaxis(this,this.axis_length);
	this.gl.clearColor(this.background.r,this.background.g, this.background.b, this.background.a);

};

XMLscene.prototype.updateLights = function() {
	
	for (var j = 0; j < this.lights.length; j++){
		this.lights[j].update();
	}
};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
    this.shader.bind();
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	this.setDefaultAppearance();

	//this.updateLights();
	
	this.axis.display();		
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it

	if (this.graph.loadedOk === true)
	{
		this.updateLights();
		this.getObjects(this.graph_tree.root_id);
	}

    this.shader.unbind();
};


XMLscene.prototype.getObjects = function (currNodeId,textId,materialId) {
	var currNode=this.graph_tree.graphElements.get(currNodeId);
	var nextTextId, nextMaterialId;


	if(currNode instanceof GraphTree_node){
		
		if(currNode.texture_id=="null"){
			nextTextId=textId;
		}else if(currNode.texture_id=="clear"){
			nextTextId=undefined;
		}else{
			nextTextId=currNode.texture_id;
		}

		if(currNode.material_id=="null"){
			nextMaterialId=materialId;
		}else if(currNode.material_id=="clear"){
			nextMaterialId=undefined;
		}else{
			nextMaterialId=currNode.material_id;
		}
		
		for(var i =0; i<currNode.descendants.length;i++){
			this.pushMatrix();
			this.multMatrix(currNode.getMatrix());

			this.getObjects(currNode.descendants[i],nextTextId,nextMaterialId);
			this.popMatrix();
			
			}
			
	}else if(currNode instanceof GraphTree_leaf){
				var material=this.materials.get(materialId);
				var text=this.textures.get(textId);

				if(material!==undefined){
					material.apply();
				}

				if(text!==undefined){	
				currNode.object.updateTexCoords(text.amplif_s,text.amplif_t);
				text.bind();	
				}
								
				currNode.object.display();
				
				if(material!==undefined){
					this.materialDefault.apply();
				}

				if(text!==undefined){
						text.unbind();	
				}
		}
}

XMLscene.prototype.updateGuiLights = function (){ 
	if(this.luz1){
		this.lights[0].enable();
	}
	else this.lights[0].disable();

	if(this.luz2){
		this.lights[1].enable();
	}
	else this.lights[1].disable();

	if(this.luz3){
		this.lights[2].enable();
	}
	else 
		this.lights[2].disable();
};


XMLscene.prototype.update = function(currTime){
	this.updateGuiLights();
}
