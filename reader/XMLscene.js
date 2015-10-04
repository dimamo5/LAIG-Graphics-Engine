
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0); //usar atributos da cena

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
	this.tableAppearance.loadTexture("../resources/table.png");
	this.tableAppearance.setShininess(120);

	this.materialMetal = new CGFappearance(this);
	this.materialMetal.setAmbient(0.73,0.75,0.8,1);
	this.materialMetal.setDiffuse(0.73,0.75,0.8,1);
	this.materialMetal.setSpecular(1,1,1,1);
	this.materialMetal.setShininess(120);
	
	this.trig=new MyTriangle(this,0,0,0,5,0,0,0,2.5,0,1,1);
	this.rect =new MyRectangle(this,0,1,1,0,1,1);
	this.circle =new MyCircle(this,20);
	this.cs = new MyCylinderSurface(this,1,1,1,20,20);

	//this.cs = new MyCylinder(this,1,2,0,20,20);
	this.bola=new MySphere(this,1,40,40);
	
	this.axis=new CGFaxis(this);
};

XMLscene.prototype.initLights = function () {
	this.setGlobalAmbientLight(0,0,0,1.0);

	this.shader.bind();
	
	// Positions for four lights
	this.lights[0].setPosition(0, 2, 0, 1);
	this.lights[1].setPosition(10.5, 6.0, 1.0, 1.0);
	this.lights[2].setPosition(0, -2, 0, 1.0);
	this.lights[3].setPosition(4, 6.0, 5.0, 1.0);


	this.lights[0].setAmbient(0, 0, 0, 1);
	this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[0].setSpecular(1.0,1.0,1.0,1.0);
	this.lights[0].setVisible( true);
	this.lights[0].enable();

	this.lights[1].setAmbient(0, 0, 0, 1);
	this.lights[1].setDiffuse(1.0, 1.0, 1.0, 1.0);
	//this.lights[1].enable();

	this.lights[2].setAmbient(0, 0, 0, 1);
	this.lights[2].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[2].setSpecular(1.0, 1.0, 1.0, 1.0);
	this.lights[2].setConstantAttenuation(0);
	this.lights[2].setLinearAttenuation(1);
	this.lights[2].setQuadraticAttenuation(0);
	this.lights[2].setVisible( true);
	this.lights[2].enable();
	
	this.lights[3].setAmbient(0, 0, 0, 1);
	this.lights[3].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[3].setSpecular(1.0,1.0,0,1.0);
	this.lights[3].setConstantAttenuation(0);
	this.lights[3].setLinearAttenuation(0);
	this.lights[3].setQuadraticAttenuation(1);
	//this.lights[3].enable();

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
	this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
	this.lights[0].setVisible(true);
    this.lights[0].enable();
};

XMLscene.prototype.updateLights = function() {
	for (i = 0; i < this.lights.length; i++)
		this.lights[i].update();
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

	this.updateLights();

	// Draw axis
	this.axis.display();

	this.materialDefault.apply();
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	/*if (this.graph.loadedOk)
	{
		this.lights[0].update();
	};	*/

	
	
	this.pushMatrix();
		this.bola.display();
	this.popMatrix();

    this.shader.unbind();
};

