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

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.verifyError = function(error){

	if (error != null) {
		this.onXMLError(error);
		return;
	}	
}

/* Elements parser */


//>>> INITIALS PARSER
MySceneGraph.prototype.parseInitials = function(rootElement){

	var elems =  rootElement.getElementsByTagName('INITIALS');
	
	if (elems == null) {
		return "initials element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'INITIALS' element found.";
	}
	
	//frustum
	var frustum = elems[0].getElementsByTagName('frustum');
	if (frustum == null || frustum[0] == undefined || frustum.length != 1) {
		return "frustum element is missing or there are more than one element found.";
	}

	this.scene.frustum = { near : this.reader.getFloat(frustum[0],"near",true),
	           		 	   far : this.reader.getFloat(frustum[0],"far",true) };
	
	//translate
	var translate = elems[0].getElementsByTagName('translation');
	console.log(translate[0]);
	if(translate[0] == null || translate.length != 1) {
		return "translate element is missing or there are more than one element found.";
	}

	this.scene.translation = { x : this.reader.getFloat(translate[0],"x",true),
					   y : this.reader.getFloat(translate[0],"y",true),
					   z : this.reader.getFloat(translate[0],"z",true) };

	//rotation (expect 3 elements)
	var rotation = elems[0].getElementsByTagName('rotation');
	if(rotation == null) {
		return "rotation element is missing";
	}
	
	var nrot = rotation.length;
	if(nrot != 3){
		return "the number of rotation elements is diferent than expected";
	}

	for(var i=0; i < nrot; i++){

		var e = rotation[i];
		var axis = this.reader.getString(e,"axis",true);

		switch (axis)	{
			case "x":
				this.scene.rotationX_angle = this.reader.getFloat(e,"angle",true);
				break;

			case "y":			
				this.scene.rotationY_angle = this.reader.getFloat(e,"angle",true);
				break;			

			case "z":
				this.scene.rotationZ_angle = this.reader.getFloat(e,"angle",true);
				break;	

			default:
				return "error on axis value";
		}
	}

	//verifica se algum dos eixos ficou por preencher
	if( this.rotationX_angle == 'undefined' | this.rotationY_angle == 'undefined' | this.rotationZ_angle == 'undefined')
		return "error defining axis";

	
	//scale
	var scale = elems[0].getElementsByTagName('scale');
	if(scale[0] == null || scale.length != 1) {
		return "scale element is missing or there are more than one element found.";
	}

	this.scene.scale_initial = { sx : this.reader.getFloat(scale[0],"sx",true),
								 sy : this.reader.getFloat(scale[0],"sy",true),
								 sz : this.reader.getFloat(scale[0],"sz",true) };

	//reference
	var reference = elems[0].getElementsByTagName('reference');
	if ( reference[0] == null || reference.length != 1 ) {
		return "reference element is missing or there are more than one element found.";
	}

	this.scene.axis_length = this.reader.getFloat(reference[0],"length",true);
};


//ILUMINATION
MySceneGraph.prototype.parseIlumination= function(rootElement){

	var elems =  rootElement.getElementsByTagName('ILUMINATION');	
	if (elems == null) {
		return "ILUMINATION element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one <ILUMINATION> element found.";
	}
	
	//ambient
	var ambient = elems[0].getElementsByTagName('ambient');
	if (ambient[0] == null || ambient.length != 1) {
		return "ambient element is missing or there are more than one element found.";
	}

	this.scene.ambient = { r: this.reader.getFloat(ambient[0],"r",true),
						   g: this.reader.getFloat(ambient[0],"g",true),
						   b: this.reader.getFloat(ambient[0],"b",true),
						   a: this.reader.getFloat(ambient[0],"a",true) };

	//background 
	var background = elems[0].getElementsByTagName('background');
	if (background[0] == null || background.length != 1) {
		return "background element is missing or there are more than one element found.";
	}

	this.scene.background = { r: this.reader.getFloat(background[0],"r",true),
						g: this.reader.getFloat(background[0],"g",true), 
						b: this.reader.getFloat(background[0],"b",true), 
						a: this.reader.getFloat(background[0],"a",true) };
};

// LIGHTS  
MySceneGraph.prototype.parseLights= function(rootElement){

	var elems = rootElement.getElementsByTagName('LIGHTS');	
	if (elems == null) {
		return "LIGHTS element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one <LIGHTS> element found.";
	}

	//retorna lista de elementos "LIGHT" abaixo do node "LIGHTS"
	var lightsList = elems[0].getElementsByTagName('LIGHT');
	if(lightsList.length == 0){
		return "no lights found";
	}
	
	//array de lights
	//this.scene.lights = [];

	//carrega todos os elementos "light"
	for(var i = 0; i < lightsList.length; i++){
		
		var id = this.reader.getString(lightsList[i],"id",true );

		var enable = lightsList[i].getElementsByTagName('enable');
		if(enable[0] == null || enable.length != 1) {
			return "enable element is missing or there are more than one element found.";
		}

		var enable_val = this.reader.getBoolean(enable[0],"value",true);

		var pos = lightsList[i].getElementsByTagName('position');
		if(pos[0] == null || pos.length != 1) {
			return "position element is missing or there are more than one element found.";
		}

		var positionList = { x : this.reader.getFloat(pos[0],"x",true), 
							 y : this.reader.getFloat(pos[0],"y",true),
							 z : this.reader.getFloat(pos[0],"z",true),
							 w : this.reader.getFloat(pos[0],"w",true) };

		var ambient = lightsList[i].getElementsByTagName('ambient');
		if(ambient[0] == null || ambient.length != 1) {
			return "ambient element is missing or there are more than one element found.";
		}

		var ambientList = { r : this.reader.getFloat(ambient[0],"r",true),
							g : this.reader.getFloat(ambient[0],"g",true),
							b : this.reader.getFloat(ambient[0],"b",true),
							a : this.reader.getFloat(ambient[0],"a",true) };
				
		var diffuse = lightsList[i].getElementsByTagName('diffuse');
		if(diffuse[0] == null || diffuse.length != 1) {
			return "diffuse element is missing or there are more than one element found.";
		}

		var diffuseList = { r : this.reader.getFloat(diffuse[0],"r",true),
							g : this.reader.getFloat(diffuse[0],"g",true),
							b : this.reader.getFloat(diffuse[0],"b",true),
							a : this.reader.getFloat(diffuse[0],"a",true) };

		var specullar = lightsList[i].getElementsByTagName('specular');
		if(specullar[0] == null || specullar.length != 1) {
			return "specullar element is missing or there are more than one element found.";
		}

		var specullarList = { r : this.reader.getFloat(specullar[0],"r",true),
						      g : this.reader.getFloat(specullar[0],"g",true),
							  b : this.reader.getFloat(specullar[0],"b",true),
							  a : this.reader.getFloat(specullar[0],"a",true) };

		//criacao do objecto light
		//var light_Obj = 
		
		//this.scene.lights[i] = new CGFlight(this.scene,id);


		/*if(enable_val == true ) //enable_val : T/F
			light_Obj.enable();
		else 
			light_Obj.disable();*/

		//sets dos atributos da CGFLight
		/*
		light_Obj.setAmbient(ambientList.r,ambientList.g,ambientList.b,ambientList.a);
		light_Obj.setDiffuse(diffuseList.r,diffuseList.g,diffuseList.b,diffuseList.a);
		light_Obj.setSpecular(specullarList.r,specullarList.g,specullarList.b,specullarList.a);
		light_Obj.setPosition(positionList.x,positionList.y,positionList.z,positionList.w);
		light_Obj.setVisible(true);*/

		this.scene.lights[i].setAmbient(ambientList.r,ambientList.g,ambientList.b,ambientList.a);
		this.scene.lights[i].setDiffuse(diffuseList.r,diffuseList.g,diffuseList.b,diffuseList.a);
		this.scene.lights[i].setSpecular(specullarList.r,specullarList.g,specullarList.b,specullarList.a);
		this.scene.lights[i].setPosition(positionList.x,positionList.y,positionList.z,positionList.w);
		this.scene.lights[i].setVisible(true);

		if(enable_val == true ) //enable_val : T/F
			this.scene.lights[i].enable();
		else 
			this.scene.lights[i].disable();

		
		//this.scene.lights[i] = light_Obj;
	}
};

//TEXTURES 
MySceneGraph.prototype.parseTextures= function(rootElement) {

	var elems = rootElement.getElementsByTagName('TEXTURES');	
	if (elems == null) {
		return "TEXTURES element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one TEXTURES element found.";
	}
	
	var texturesList = elems[0].getElementsByTagName('TEXTURE');
	if(texturesList.length == 0){
		return "no textures found";
	}
	
	this.textures =  { assocArray }; //boa pratica

	//carrega todos os elementos "texture"
	for(var i = 0; i < texturesList.length; i++){
		var id = this.reader.getString(texturesList[i],"id",true);

		var file = texturesList[i].getElementsByTagName('file');
		if(file == null || file.length != 1){
			return "file element is missing or there are more than one element found.";
		}
		var url = this.reader.getString(file[0],"path",true);		

		var amplif_factorList = texturesList[i].getElementsByTagName('amplif_factor');
		if(amplif_factor == null || amplif_factor.length != 1){
			return "amplif_factor element is missing or there are more than one element found.";
		}

		var amplif_s = this.reader.getFloat(amplif_factor[0],"s",true),
			amplif_t = this.reader.getFloat(amplif_factor[0],"t",true) ;

		this.textures.add(id, new MyTexture(this.scene, url,amplif_s,amplif_t, id)); //carrega elemento "texture" para arraya associativo
	}
};
	
//MATERIALS
MySceneGraph.prototype.parseMaterials = function(rootElement) {

	var elems = rootElement.getElementsByTagName('MATERIALS');	
	if (elems == null) {
		return "MATERIALS element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one MATERIALS element found.";
	}
	
	var materialsList = elems[0].getElementsByTagName('MATERIAL');
	if(materialsList.length == 0){
		return "no materials found";
	}

	this.materials =  {assocArray}; //boa pratica??

	//carrega todos os elementos "materials"
	for(var i = 0; i < materialsList.length; i++){
		var id = this.reader.getString(materialsList[i],"id",true);

		var shininess = materialsList[i].getElementsByTagName('shininess');
		if(shininess == null || shininess.length != 1){
			return "shininess element is missing or there are more than one element found.";
		}

		var shininess_value = this.reader.getFloat(shininess[0],"value",true);		

		var specullar = materialsList[i].getElementsByTagName('specullar');
		if(specullar[0] == null || specullar.length != 1) {
			return "diffuse element is missing or there are more than one element found.";
		}

		var specullarList = { r : this.reader.getFloat(specullar[0],"r",true),
						      g : this.reader.getFloat(specullar[0],"g",true),
							  b : this.reader.getFloat(specullar[0],"b",true),
							  a : this.reader.getFloat(specullar[0],"a",true) };

		var diffuse = materialsList[i].getElementsByTagName('diffuse');
		if(diffuse[0] == null || diffuse.length != 1) {
			return "diffuse element is missing or there are more than one element found.";
		}

		var diffuseList = { r : this.reader.getFloat(diffuse[0],"r",true),
							g : this.reader.getFloat(diffuse[0],"g",true),
							b : this.reader.getFloat(diffuse[0],"b",true),
							a : this.reader.getFloat(diffuse[0],"a",true) };

		var ambient = materialsList[i].getElementsByTagName('ambient');
		if(ambient[0] == null || ambient.length != 1) {
			return "ambient element is missing or there are more than one element found.";
		}

		var ambientList = { r : this.reader.getFloat(ambient[0],"r",true),
							g : this.reader.getFloat(ambient[0],"g",true),
							b : this.reader.getFloat(ambient[0],"b",true),
							a : this.reader.getFloat(ambient[0],"a",true) };

		var emission = materialsList[i].getElementsByTagName('emission');
		if(emission[0] == null || emission.length != 1) {
			return "emission element is missing or there are more than one element found.";
		}

		var emissionList = { r : this.reader.getFloat(emission[0],"r",true),
							 g : this.reader.getFloat(emission[0],"g",true),
							 b : this.reader.getFloat(emission[0],"b",true),
							 a : this.reader.getFloat(emission[0],"a",true) };


		var material_Obj = new CGFAppearance(this.scene);

		//sets dos atributos da CGFAppearance
		material_Obj.setShininess(shininess_value);
		material_Obj.setSpecullar(specullarList.r,specullarList.g,specullarList.b,specullarList.a);		
		material_Obj.setDiffuse(diffuseList.r,diffuseList.g,diffuseList.b,diffuseList.a);
		material_Obj.setAmbient(ambientList.r,ambientList.g,ambientList.b,ambientList.a);
		material_Obj.setEmission(emissionList.r,emissionList.g,emissionList.b,emissionList.a);

		this.materials.add(id, material_Obj); //carrega elemento "material" para arraya associativo
	}
};

//parse LEAVES
MySceneGraph.prototype.parseLeaves = function(rootElement){

	var elems = rootElement.getElementsByTagName('LEAVES');	
	if (elems == null) {
		return "LEAVES element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one LEAVES element found.";
	}

	var leavesList = elems[0].getElementsByTagName('LEAF');
	if(leavesList.length == 0){
		return "no leaves found";
	}

	for(var i= 0; i < leavesList.length; i++){

		var id = this.reader.getString(leavesList[i],"id",true);		
		var type = this.reader.getString(leavesList[i],"type",true);
		var args = this.reader.getString(leavesList[i],"args",true);

		var leaf_Obj = new GraphTree_leaf(id,type,args);

		this.scene.graph_tree.graphElements.add(id,leaf_Obj); 
	}
};

//Parse NODES

MySceneGraph.prototype.parseNodes = function(){

	var elems = rootElement.getElementsByTagName('NODES');	
	if (elems == null) {
		return "NODES element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one NODES element found.";
	}

	var root = elems[0].getElementsByTagName('ROOT');
	if(root[0] == null || root.length != 1) {
		return "root element is missing or there are more than one element found in lsx.";
	}

	var root_id = this.reader.getString(root[0],"id",true);
	this.scene.graph_tree.root_id = root_id;

	var nodeslist = elems[0].getElementsByTagName('NODE');
	if(nodeslist.length == 0){
		return "no nodes found";
	}

	//leitura dos nodes
	for(var i= 0; i < nodeslist.length; i++){

		var node_id = this.reader.getString(nodeslist[i],"id",true);

		var material = nodeslist[i].getElementsByTagName('MATERIAL');	
		if(material == null || material == undefined || material.length != 1)
			return "node MATERIAL  not found or more that one found";

		var material_id = this.reader.getString(material[0], "id",true);

		var texture = nodeslist[i].getElementsByTagName('TEXTURE');	
		if(texture == null || texture == undefined || texture.length != 1)
			return "node TEXTURE not found or more that one found";

		var texture_id = this.reader.getString(texture[0], "id",true);

		//instanciação do node
		var node_Obj = new GraphTree_node(node_id, material_id, texture_id);

		//tamanho da lista dos filhos do node (texture,material,translation...)
		var childList_length = nodeslist[i].childNodes.length;
		var child = nodeslist[i].firstChild;
		 
		//leitura das transformacoes para array devido 
		for(var j = 0; j < childList_length; j++){
			
			var transf = [];
			
			if(child.nodeName == "TRANSLATION" ){				
				transf.push(child.nodeName); 		//tipo da transformacao
				transf.push(child.getAttributeNode("x").nodeValue);
				transf.push(child.getAttributeNode("y").nodeValue);
				transf.push(child.getAttributeNode("z").nodeValue);

				node_Obj.transformations.push(tranf); 

			}else if(child.nodeName == "ROTATION" ){				
				transf.push(child.nodeName);		//tipo da transformacao
				transf.push(child.getAttributeNode("axis").nodeValue);  //eixo da rotacao
				transf.push(child.getAttributeNode("angle").nodeValue);

				node_Obj.transformations.push(tranf); 

			}else if(child.nodeName == "SCALE" ){				
				transf.push(child.nodeName);		//tipo da transformacao	
				transf.push(child.getAttributeNode("sx").nodeValue);
				transf.push(child.getAttributeNode("sy").nodeValue);
				transf.push(child.getAttributeNode("sz").nodeValue);

				node_Obj.transformations.push(tranf); 

			}else if (child.noName == "DESCENDANTS")  //no more transformations
					break;

			child = child.nextSibling;
		}  		
		
		//tratar dos descendants
		var descendantsList = nodeslist[i].getElementsByTagName('DESCENDANTS');
		if(descendantsList.length == 0){
			return "no descendants found";
		}

		for(var j = 0; j < descendantsList.length; j++){

			var id = this.reader.getString(descendantsList[i],"id",true);
			node_Obj.descendants.push(id);
		}
		
		//adiciona node ao graphTree da cena		
		this.scene.graph_tree.graph_elements.add(node_id, node_Obj);
	}
};

	

MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;

	// Here should go the calls for different functions to parse the various blocks
	var error;
	var parser = [ this.parseInitials, this.parseIlumination, this.parseLights, this.parseTextures,
				   this.parseMaterials, this.parseLeaves,	this.parseNodes ];
				  
	//executa as chamadas aos parsers e verifica a ocorrencia de erros
	for(var i = 0; i < 3; i++){
		error = parser[i].call(this,rootElement);
		this.verifyError(error);
	}
	if(error==undefined){
	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
	}
};


/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


