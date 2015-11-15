/**
 * Represents a scene graph
 * @constructor 
 * @param {string} filename - scene's graph file name
 * @param {object} scene
 */
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
	// File reading 
	this.reader = new CGFXMLreader();
	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);  
}

 
/**
 * Callback to be executed after successful reading
 * @param {object} rootElement - root node
 */
MySceneGraph.prototype.verifyError = function(error){

	if (error !== null || error !== undefined) {
		this.onXMLError(error);
		return;
	}	
};


/**
 * Verifies if the main tags of the xml file are in the expected order
 * @param {object} rootElement - root node
 */
MySceneGraph.prototype.checkOrder=function(rootElement){
	var order =["INITIALS", "ILLUMINATION", "LIGHTS", "TEXTURES", "MATERIALS","animations", "LEAVES", "NODES"];
	for(var i =0;i<rootElement.children.length;i++){
		if(rootElement.children[i].nodeName!=order[i]){
			console.warn(rootElement.children[i].nodeName+" is in the wrong place!\t");
		}
	}
}

/* >>>>>>>>>>>>>>>>>>>>>>>>  Elements parser  <<<<<<<<<<<<<<<<<<<<<<<<< */

/**
 * Parser of the initials's nodes
 * @param {object} rootElement - root node
 */
MySceneGraph.prototype.parseInitials = function(rootElement){

	var elems =  rootElement.getElementsByTagName('INITIALS');
	
	if (elems === null) {
		return "initials element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'INITIALS' element found.";
	}
	
	//frustum
	var frustum = elems[0].getElementsByTagName('frustum');
	if (frustum === null || frustum[0] === undefined || frustum.length != 1) {
		return "frustum element is missing or there are more than one element found.";
	}

	this.scene.frustum = { near : this.reader.getFloat(frustum[0],"near",true),
	           		 	   far : this.reader.getFloat(frustum[0],"far",true) };
	
	//translate
	var translate = elems[0].getElementsByTagName('translation');

	if(translate[0] === null || translate.length != 1) {
		return "translate element is missing or there are more than one element found.";
	}

	var translation = { x : this.reader.getFloat(translate[0],"x",true),
					   y : this.reader.getFloat(translate[0],"y",true),
					   z : this.reader.getFloat(translate[0],"z",true) };

	//rotation (expect 3 elements)
	var rotation = elems[0].getElementsByTagName('rotation');
	if(rotation === null) {
		return "rotation element is missing";
	}
	
	var nrot = rotation.length;
	if(nrot != 3){
		return "the number of rotation elements is diferent than expected";
	}

	var rotationX_angle,rotationY_angle,rotationZ_angle;

	for(var i=0; i < nrot; i++){

		var e = rotation[i];
		var axis = this.reader.getString(e,"axis",true);

		switch (axis)	{
			case "x":
				rotationX_angle = this.reader.getFloat(e,"angle",true);
				break;

			case "y":			
				rotationY_angle = this.reader.getFloat(e,"angle",true);
				break;			

			case "z":
				rotationZ_angle = this.reader.getFloat(e,"angle",true);
				break;	

			default:
				return "error on axis value";
		}
	}

	//verifica se algum dos eixos ficou por preencher
	if(rotationX_angle === undefined ||rotationY_angle === undefined ||rotationZ_angle === undefined)
		return "error defining axis";

	
	//scale
	var scale = elems[0].getElementsByTagName('scale');
	if(scale[0] === null || scale.length != 1) {
		return "scale element is missing or there are more than one element found.";
	}

	var scale_initial = { sx : this.reader.getFloat(scale[0],"sx",true),
								 sy : this.reader.getFloat(scale[0],"sy",true),
								 sz : this.reader.getFloat(scale[0],"sz",true) };


	var matrix =mat4.create();

	mat4.translate(matrix,matrix,vec3.fromValues(translation.x,translation.y,translation.z));
	mat4.rotateX(matrix,matrix,degToRad(rotationX_angle));
	mat4.rotateY(matrix,matrix,degToRad(rotationY_angle));
	mat4.rotateZ(matrix,matrix,degToRad(rotationZ_angle));
	mat4.scale(matrix,matrix,vec3.fromValues(scale_initial.sx,scale_initial.sy,scale_initial.sz));

	this.scene.initialTransformation=matrix;

	//reference
	var reference = elems[0].getElementsByTagName('reference');
	if ( reference[0] === null || reference.length != 1 ) {
		return "reference element is missing or there are more than one element found.";
	}

	this.scene.axis_length = this.reader.getFloat(reference[0],"length",true);
};


/**
 * Parser of the ilumination's node
 * @param {object} rootElement - root node
 */
MySceneGraph.prototype.parseIlumination= function(rootElement){

	var elems =  rootElement.getElementsByTagName('ILLUMINATION');	
	if (elems === null) {
		return "ILUMINATION element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one <ILLUMINATION> element found.";
	}
	
	//ambient
	var ambient = elems[0].getElementsByTagName('ambient');
	if (ambient[0] === null || ambient.length != 1) {
		return "ambient element is missing or there are more than one element found.";
	}

	this.scene.ambient = { r: this.reader.getFloat(ambient[0],"r",true),
						   g: this.reader.getFloat(ambient[0],"g",true),
						   b: this.reader.getFloat(ambient[0],"b",true),
						   a: this.reader.getFloat(ambient[0],"a",true) };

	//background 
	var background = elems[0].getElementsByTagName('background');
	if (background[0] === null || background.length != 1) {
		return "background element is missing or there are more than one element found.";
	}

	this.scene.background = { r: this.reader.getFloat(background[0],"r",true),
						g: this.reader.getFloat(background[0],"g",true), 
						b: this.reader.getFloat(background[0],"b",true), 
						a: this.reader.getFloat(background[0],"a",true) };
};

/**
 * Parser of lights's nodes
 * @param {object} rootElement - root node
 */
MySceneGraph.prototype.parseLights= function(rootElement){

	var elems = rootElement.getElementsByTagName('LIGHTS');	
	if (elems === null) {
		return "LIGHTS element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one <LIGHTS> element found.";
	}

	//retorna lista de elementos "LIGHT" abaixo do node "LIGHTS"
	var lightsList = elems[0].getElementsByTagName('LIGHT');
	if(lightsList.length === 0){
		return "no lights found";
	}
	
	//mapeamento do indice(string) da light no xml para indice da mesma luz no array lights
	this.scene.lights_map = new assocMap();

	//carrega todos os elementos "light"
	for(var i = 0; i < lightsList.length; i++){
		
		var light_id = this.reader.getString(lightsList[i],"id",true );

		var enable = lightsList[i].getElementsByTagName('enable');
		if(enable[0] === null || enable.length != 1) {
			return "enable element is missing or there are more than one element found.";
		}

		var enable_val = this.reader.getBoolean(enable[0],"value",true);

		var pos = lightsList[i].getElementsByTagName('position');
		if(pos[0] === null || pos.length != 1) {
			return "position element is missing or there are more than one element found.";
		}

		var positionList = { x : this.reader.getFloat(pos[0],"x",true), 
							 y : this.reader.getFloat(pos[0],"y",true),
							 z : this.reader.getFloat(pos[0],"z",true),
							 w : this.reader.getFloat(pos[0],"w",true) };

		var ambient = lightsList[i].getElementsByTagName('ambient');
		if(ambient[0] === null || ambient.length != 1) {
			return "ambient element is missing or there are more than one element found.";
		}

		var ambientList = { r : this.reader.getFloat(ambient[0],"r",true),
							g : this.reader.getFloat(ambient[0],"g",true),
							b : this.reader.getFloat(ambient[0],"b",true),
							a : this.reader.getFloat(ambient[0],"a",true) };
				
		var diffuse = lightsList[i].getElementsByTagName('diffuse');
		if(diffuse[0] === null || diffuse.length != 1) {
			return "diffuse element is missing or there are more than one element found.";
		}

		var diffuseList = { r : this.reader.getFloat(diffuse[0],"r",true),
							g : this.reader.getFloat(diffuse[0],"g",true),
							b : this.reader.getFloat(diffuse[0],"b",true),
							a : this.reader.getFloat(diffuse[0],"a",true) };

		var specullar = lightsList[i].getElementsByTagName('specular');
		if(specullar[0] === null || specullar.length != 1) {
			return "specullar element is missing or there are more than one element found.";
		}

		var specullarList = { r : this.reader.getFloat(specullar[0],"r",true),
						      g : this.reader.getFloat(specullar[0],"g",true),
							  b : this.reader.getFloat(specullar[0],"b",true),
							  a : this.reader.getFloat(specullar[0],"a",true) };

		this.scene.lights[i].setAmbient(ambientList.r,ambientList.g,ambientList.b,ambientList.a);
		this.scene.lights[i].setDiffuse(diffuseList.r,diffuseList.g,diffuseList.b,diffuseList.a);
		this.scene.lights[i].setSpecular(specullarList.r,specullarList.g,specullarList.b,specullarList.a);
		this.scene.lights[i].setPosition(positionList.x,positionList.y,positionList.z,positionList.w);
		this.scene.lights[i].setVisible(true);

		if(enable_val === true ) //enable_val : T/F
			this.scene.lights[i].enable();
		else 
			this.scene.lights[i].disable();

		this.scene.lights_map.add(i,light_id);
	}
};

/**
 * Parser of the texture's nodes
 * @param {object} rootElement - root node
 */
MySceneGraph.prototype.parseTextures= function(rootElement) {

	var elems = rootElement.getElementsByTagName('TEXTURES');	
	if (elems === null) {
		return "TEXTURES element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one TEXTURES element found.";
	}
	
	var texturesList = elems[0].getElementsByTagName('TEXTURE');
	if(texturesList.length === 0){
		return "no textures found";
	}
	
	this.scene.textures =  new assocMap(); //boa pratica

	//carrega todos os elementos "texture"
	for(var i = 0; i < texturesList.length; i++){
		var id = this.reader.getString(texturesList[i],"id",true);

		var file = texturesList[i].getElementsByTagName('file');
		if(file === null || file.length != 1){
			return "file element is missing or there are more than one element found.";
		}
		var url = this.reader.getString(file[0],"path",true);		

		var amplif_factorList = texturesList[i].getElementsByTagName('amplif_factor');
		if(amplif_factorList === null || amplif_factorList.length != 1){
			return "amplif_factor element is missing or there are more than one element found.";
		}

		var amplif_s = this.reader.getFloat(amplif_factorList[0],"s",true),
			amplif_t = this.reader.getFloat(amplif_factorList[0],"t",true) ;

		this.scene.textures.add(id, new MyTexture(this.scene, url,amplif_s,amplif_t, id)); //carrega elemento "texture" para arraya associativo
	}
};
	
/**
 * Parser of the materials's nodes
 * @param {object} rootElement - root node
 */
MySceneGraph.prototype.parseMaterials = function(rootElement) {

	var elems = rootElement.getElementsByTagName('MATERIALS');	
	if (elems === null) {
		return "MATERIALS element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one MATERIALS element found.";
	}
	
	var materialsList = elems[0].getElementsByTagName('MATERIAL');
	if(materialsList.length === 0){
		return "no materials found";
	}

	this.scene.materials = new assocMap();

	//carrega todos os elementos "materials"
	for(var i = 0; i < materialsList.length; i++){
		var id = this.reader.getString(materialsList[i],"id",true);

		var shininess = materialsList[i].getElementsByTagName('shininess');
		if(shininess === null || shininess.length != 1){
			return "shininess element is missing or there are more than one element found.";
		}

		var shininess_value = this.reader.getFloat(shininess[0],"value",true);		

		var specullar = materialsList[i].getElementsByTagName('specular');
		if(specullar[0] === null || specullar.length != 1) {
			return "specular element is missing or there are more than one element found.";
		}

		var specullarList = { r : this.reader.getFloat(specullar[0],"r",true),
						      g : this.reader.getFloat(specullar[0],"g",true),
							  b : this.reader.getFloat(specullar[0],"b",true),
							  a : this.reader.getFloat(specullar[0],"a",true) };

		var diffuse = materialsList[i].getElementsByTagName('diffuse');
		if(diffuse[0] === null || diffuse.length != 1) {
			return "diffuse element is missing or there are more than one element found.";
		}

		var diffuseList = { r : this.reader.getFloat(diffuse[0],"r",true),
							g : this.reader.getFloat(diffuse[0],"g",true),
							b : this.reader.getFloat(diffuse[0],"b",true),
							a : this.reader.getFloat(diffuse[0],"a",true) };

		var ambient = materialsList[i].getElementsByTagName('ambient');
		if(ambient[0] === null || ambient.length != 1) {
			return "ambient element is missing or there are more than one element found.";
		}

		var ambientList = { r : this.reader.getFloat(ambient[0],"r",true),
							g : this.reader.getFloat(ambient[0],"g",true),
							b : this.reader.getFloat(ambient[0],"b",true),
							a : this.reader.getFloat(ambient[0],"a",true) };

		var emission = materialsList[i].getElementsByTagName('emission');
		if(emission[0] === null || emission.length != 1) {
			return "emission element is missing or there are more than one element found.";
		}

		var emissionList = { r : this.reader.getFloat(emission[0],"r",true),
							 g : this.reader.getFloat(emission[0],"g",true),
							 b : this.reader.getFloat(emission[0],"b",true),
							 a : this.reader.getFloat(emission[0],"a",true) };


		var material_Obj = new CGFappearance(this.scene);

		//sets dos atributos da CGFAppearance
		material_Obj.setShininess(shininess_value);
		material_Obj.setSpecular(specullarList.r,specullarList.g,specullarList.b,specullarList.a);		
		material_Obj.setDiffuse(diffuseList.r,diffuseList.g,diffuseList.b,diffuseList.a);
		material_Obj.setAmbient(ambientList.r,ambientList.g,ambientList.b,ambientList.a);
		material_Obj.setEmission(emissionList.r,emissionList.g,emissionList.b,emissionList.a);

		this.scene.materials.add(id, material_Obj); //carrega elemento "material" para arraya associativo
	}
};


MySceneGraph.prototype.parseAnimations = function(rootElement) {

	var elems = rootElement.getElementsByTagName('animations');	
	if (elems === null) {
		return "animations element is missing.";
	}
	
	if (elems.length != 1) {
		return "either zero or more than one animations element found.";
	}
	
	var animationList = elems[0].getElementsByTagName('animation');
	if(animationList.length === 0){
		return;
	}

	this.scene.animations=[];

	//carrega todos os elementos "materials"
	for(var i = 0; i < animationList.length; i++){
		var anim;

		var id = this.reader.getString(animationList[i],"id",true);

		var span = this.reader.getFloat(animationList[i],"span",true);

		var type = this.reader.getString(animationList[i],"type",true);		

		if(type !== null && type=="circular") {
						
			var center = this.reader.getString(animationList[i],"center",true);
			var radius=this.reader.getFloat(animationList[i],"radius",true);
			var startang=this.reader.getFloat(animationList[i],"startang",true);
			var rotang=this.reader.getFloat(animationList[i],"rotang",true);
	
			anim = new CircularAnimation(this.scene, id, span, type, center.split(" "), radius, startang, rotang);

		}else if(type !== null && type=="linear") {
				anim = new LinearAnimation(this.scene, id,span,type);

			var controlpoints = animationList[i].getElementsByTagName('CONTROLPOINT');	
			if (controlpoints === null && controlpoints<2) {
				return "Control Points element is missing.";
			}

			for(var cp=0;cp<controlpoints.length;cp++){
				var x=this.reader.getFloat(controlpoints[cp],"xx",true);
				var y=this.reader.getFloat(controlpoints[cp],"yy",true);
				var z=this.reader.getFloat(controlpoints[cp],"zz",true);
				anim.addControlPoint(x,y,z);
			}			
		}

		this.scene.animations.push(anim); 		
	}	
};

/**
 * Parses the leafs
 * @param {object} rootElement - root node
 */
MySceneGraph.prototype.parseLeaves = function(rootElement){

	var elems = rootElement.getElementsByTagName('LEAVES');	
	if (elems === null) {
		return "LEAVES element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one LEAVES element found.";
	}

	var leavesList = elems[0].getElementsByTagName('LEAF');
	if(leavesList.length === 0){
		return "no leaves found";
	}

	for(var i= 0; i < leavesList.length; i++){

		var id = this.reader.getString(leavesList[i],"id",true);		
		var type = this.reader.getString(leavesList[i],"type",true);
		var leaf_Obj = new GraphTree_leaf(id,type);


		if(type=="triangle"||type=="rectangle"||type=="cylinder"||type=="sphere"){
			var args = this.reader.getString(leavesList[i],"args",true);
			leaf_Obj.createSimpleObjects(this.scene,args);
		}

		if(type=="plane"){
			var parts = this.reader.getInteger(leavesList[i],"parts",true);
			leaf_Obj.createPlaneObject(this.scene,parts);
		}

		if(type=="patch"){
			var order = this.reader.getInteger(leavesList[i],"order",true);
			var partsU = this.reader.getInteger(leavesList[i],"partsU",true);
			var partsV = this.reader.getInteger(leavesList[i],"partsV",true);
			var controlpoints=[];

			for(var cp=0;cp<leavesList[i].children.length;cp++){
				if(leavesList[i].children[cp].nodeName=="controlpoint"){
					var x=this.reader.getFloat(leavesList[i].children[cp],"xx",true);
					var y=this.reader.getFloat(leavesList[i].children[cp],"yy",true);
					var z=this.reader.getFloat(leavesList[i].children[cp],"zz",true);
				}
				controlpoints.push([x,y,z,1]);
			}

			leaf_Obj.createPatchObject(this.scene,order,partsU,partsV,controlpoints);
		}

		if(type=="vehicle"){
			leaf_Obj.createVehicleObject(this.scene);
		}

		if(type=="terrain"){
			var texture = this.reader.getString(leavesList[i],"texture",true);
			var heightmap = this.reader.getString(leavesList[i],"heightmap",true);
			
			leaf_Obj.createTerrainObject(this.scene,heightmap,texture);
		}
		

		this.scene.graph_tree.graphElements.add(id,leaf_Obj); 
	}
};


/**
 * Nodes's parser.
 * @param {object} rootElement - root node
 */
MySceneGraph.prototype.parseNodes = function(rootElement){


	var elems = rootElement.getElementsByTagName('NODES');	
	if (elems === null) {
		return "NODES element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one NODES element found.";
	}

	var root = elems[0].getElementsByTagName('ROOT');
	if(root[0] === null || root.length != 1) {
		return "root element is missing or there are more than one element found in lsx.";
	}

	var root_id = this.reader.getString(root[0],"id",true);
	this.scene.graph_tree.root_id = root_id;

	var nodeslist = elems[0].getElementsByTagName('NODE');
	if(nodeslist.length === 0){
		return "no nodes found";
	}
	
	
	//leitura dos nodes
	for(var i = 0; i < nodeslist.length; i++){

		var node_id = this.reader.getString(nodeslist[i],"id",true);

		var material = nodeslist[i].getElementsByTagName('MATERIAL');	
		if(material === null || material === undefined || material.length != 1)
			return "node MATERIAL  not found or more that one found";

		var material_id = this.reader.getString(material[0], "id",true);

		var texture = nodeslist[i].getElementsByTagName('TEXTURE');	
		if(texture === null || texture === undefined || texture.length != 1)
			return "node TEXTURE not found or more that one found";

		var texture_id = this.reader.getString(texture[0], "id",true);

		var animation = nodeslist[i].getElementsByTagName('animationref');
		
		//instanciação do node
		var node_Obj = new GraphTree_node(node_id, material_id, texture_id);
		
		//add dos ids das animacoes
		for(var l = 0; l < animation.length ; l++){
			node_Obj.addAnimation(this.reader.getString(animation[l], "id",true));
		}
		
		//tamanho da lista dos filhos do node (texture,material,translation...)
		var childList_length = nodeslist[i].childNodes.length;
		var child = nodeslist[i].firstChild;
		 
		//leitura das transformacoes para array devido 
		for(var j = 0; j < childList_length; j++){
			
			var transf = [];
		
			if(child.nodeName == "TRANSLATION" ){				
				transf.push(child.nodeName); 		//tipo da transformacao
				transf.push(this.reader.getFloat(child,"x",true));
				transf.push(this.reader.getFloat(child,"y",true));
				transf.push(this.reader.getFloat(child,"z",true));

				node_Obj.transformations.push(transf); 

			}else if(child.nodeName == "ROTATION" ){				
				transf.push(child.nodeName);		//tipo da transformacao

				var axis=this.reader.getString(child,"axis",true);
				switch(axis){
					case("x"):
						transf.push([1,0,0]);
					break;

					case("y"):
						transf.push([0,1,0]);
					break;

					case("z"):
						transf.push([0,0,1]);
					break;
					default:
						return "Undefined axis in node rotation";
				}
				transf.push(this.reader.getFloat(child,"angle",true));

				node_Obj.transformations.push(transf); 

			}else if(child.nodeName == "SCALE" ){				
				transf.push(child.nodeName);		//tipo da transformacao	
				transf.push(this.reader.getFloat(child,"sx",true));
				transf.push(this.reader.getFloat(child,"sy",true));
				transf.push(this.reader.getFloat(child,"sz",true));

				node_Obj.transformations.push(transf); 

			}else if (child.noName == "DESCENDANTS")  //no more transformations
					break;

			child = child.nextSibling;
		}  		
		
		//tratar dos descendants
		var descendants_elems = nodeslist[i].getElementsByTagName('DESCENDANTS');
		if(descendants_elems.length === 0){
			return "no descendants found";
		}

		var descendantsList = descendants_elems[0].getElementsByTagName('DESCENDANT');

		for(var j = 0; j < descendantsList.length; j++){
			var id = this.reader.getString(descendantsList[j],"id",true);
			node_Obj.descendants.push(id);
		}

		//adiciona node ao graphTree da cena		
		this.scene.graph_tree.graphElements.add(node_id, node_Obj);
	}
};

	
/**
 * Runs the parsing of the XML file and call's error's handler if needed
 * @param {object} rootElement - root node
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;

	// Here should go the calls for different functions to parse the various blocks
	var error;
	var parser = [ this.checkOrder,this.parseInitials, this.parseIlumination, this.parseLights, this.parseTextures,
				   this.parseMaterials,this.parseAnimations, this.parseLeaves,	this.parseNodes ];
				  
	//executa as chamadas aos parsers e verifica a ocorrencia de erros
	for(var i = 0; i < parser.length; i++){
		error = parser[i].call(this,rootElement);
		
		if (error !== null && error !== undefined) {
			this.onXMLError(error);
		return;
		}
	}
	

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};


 /**
 * Callback to be executed on any read error
 * @param {object} rootElement - root node
 */
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};