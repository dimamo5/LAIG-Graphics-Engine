function XMLscene() {
    CGFscene.call(this);
	
    graph_tree = new GraphTree();  //cria arvore (grafo) que aramazena nodes/leafs
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();
    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);	
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
	
	this.enableTextures(true);
	
	this.materialDefault = new CGFappearance(this);

	this.tableAppearance = new CGFappearance(this);
	this.tableAppearance.setAmbient(0.2,0.2,0.2,1);
	this.tableAppearance.setDiffuse(0.8,0.8,0.8,1);
	this.tableAppearance.setSpecular(0.1,0.1,0.1,1);
	this.tableAppearance.loadTexture("../resources/doge.png");
	this.tableAppearance.setShininess(120);

	this.materialMetal = new CGFappearance(this);
	this.materialMetal.setAmbient(0.73,0.75,0.8,1);
	this.materialMetal.setDiffuse(0.73,0.75,0.8,1);
	this.materialMetal.setSpecular(1,1,1,1);
	this.materialMetal.setShininess(120);
	
	this.trig=new MyTriangle(this,0,0.5,0,-0.5,-0.5,0, 0.5,-0.5,0,1,1);
	this.rect =new MyRectangle(this,0,1,1,0,1,1);
	this.cs = new MyCylinderSurface(this,3,1,1,5,7);
	this.bola=new MySphere(this,1,40,40);
	
	this.axis=new CGFaxis(this);
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
	//this.camera = new CGFcamera(0.4, this.frustum.near, this.frustum.far, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
	this.axis = new CGFaxis(this,this.axis_length);
	this.gl.clearColor(this.background.r,this.background.g, this.background.b, this.background.a);
	
};

XMLscene.prototype.updateLights = function() {
	
	for (var j = 0; j < this.lights.length; j++){
		this.lights[j].update();
	}
}

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

	if (this.graph.loadedOk == true)
	{
		//console.log("load fixe");
		this.updateLights();
	};	


	//chamar super funcao recursiva !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/*
	this.pushMatrix();
		this.tableAppearance.apply();
		this.trig.display();
	this.popMatrix(); */

    this.shader.unbind();
};

