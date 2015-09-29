
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
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseGlobalsExample(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};


/* Elements parser */

//>>> INITIALS PARSER
MySceneGraph.prototype.parseInitials= function(rootElement){

	var elems =  rootElement.getElementsByTagName('INITIALS');
	
	if (elems == null) {
		return "initials element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'INITIALS' element found.";
	}
	
	//frustum
	var frustum = elems.getElementsByTagName('frustum');
	if (frustum[0] == null || frustum.length != 1) {
		return "frustum element is missing or there are more than one element found.";
	}

	this.frustum = { near : frustum[0].attributes.getNamedItem("near").value,
	           		 far : frustum[0].attributes.getNamedItem("far").value };
	
	//translate
	var translate = elems.getElementsByTagName('translate');
	if(translate[0] == null || translate.length != 1) {
		return "translate element is missing or there are more than one element found.";
	}

	this.translate = { x:translate[0].attributes.getNamedItem("x").value,
					   y:translate[0].attributes.getNamedItem("y").value,
					   z:translate[0].attributes.getNamedItem("z").value};

	//rotation (expect 3 elements)
	var rotation = elems.getElementsByTagName('rotation');
	if(rotation == null) {
		return "rotation element is missing";
	}
	
	var nrot = rotation.length;
	if(nrot != 3){
		return "the number of rotation elements is diferent than expected";
	}

	for(var i=0; i < nrot; i++){

		var e = rotation[i];

		//percorre todos os elementos (3)
		this.rotation[i] = { axis : e.getNamedItem("axis").value,
		 					 angle : e.getNamedItem("angle").value};
	}
	
	//scale
	var scale = elems.getElementsByTagName('scale');
	if(scale[0] == null || scale.length != 1) {
		return "scale element is missing or there are more than one element found.";
	}

	this.scale = { sx : scale[0].attributes.getNamedItem("sx").value,
				   sy : scale[0].attributes.getNamedItem("sy").value,
				   sz : scale[0].attributes.getNamedItem("sz").value};
	
	//reference
	var reference = elems.getElementsByTagName('reference');
	if(reference[0] == null || reference.length != 1) {
		return "reference element is missing or there are more than one element found.";
	}

	this.reference = reference[0].attributes.getNamedItem("length").value;
}


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
	var ambient = elems.getElementsByTagName('ambient');
	if (ambient[0] == null || ambient.length != 1) {
		return "ambient element is missing or there are more than one element found.";
	}

	this.ambient = { r:ambient[0].attributes.getNamedItem("r").value,
					 g:ambient[0].attributes.getNamedItem("g").value,
					 b:ambient[0].attributes.getNamedItem("b").value,
					 a:ambient[0].attributes.getNamedItem("a").value };

	//doubleside
	var doubleside = elems.getElementsByTagName('doubleside');
	if (doubleside[0] == null || doubleside.length != 1) {
		return "doubleside element is missing or there are more than one element found.";
	}

	this.doubleside = doubleside[0].attributes.getNamedItem("value").value;

	//background 
	var background = elems.getElementsByTagName('background');
	if (background[0] == null || background.length != 1) {
		return "background element is missing or there are more than one element found.";
	}

	this.background = {	r:background[0].attributes.getNamedItem("r").value,
						g:background[0].attributes.getNamedItem("g").value, 
						b:background[0].attributes.getNamedItem("b").value, 
						a:background[0].attributes.getNamedItem("a").value };
}

// LIGHTS  <<<<<< checkar 
//É suposto funcionar se nao existirem elementos "LIGHT"?
MySceneGraph.prototype.parseLights= function(rootElement){

	var elems = rootElement.getElementsByTagName('LIGHTS');	
	if (elems == null) {
		return "LIGHTS element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one <LIGHTS> element found.";
	}

	//retorna lista de elementos "LIGHT" abaixo do node "LIGHTS"
	var lightsList = elems.getElementsByTagName('LIGHT');
	if(lightsList.length == 0){
		return "no lights found";
	}
	
	//cria array associativo para elementos "LIGHT"
	this.lights = assocArray;

	//carrega todos os elementos "light"
	for(var i = 0; i < lightsList.length;i++){
		
		var id = lightsList[i].attributes.getNamedItem("id").value;

		var enable = lightsList[i].getElementsByTagName('enable');

		if(enable[0] == null || enable.length != 1) {
			return "enable element is missing or there are more than one element found.";
		}

		var pos = lightsList[i].getElementsByTagName('position');
		if(pos[0] == null || pos.length != 1) {
			return "position element is missing or there are more than one element found.";
		}

		var positionList = { x : pos[0].attributes.getNamedItem("x").value, 
							 y : pos[0].attributes.getNamedItem("y").value,
							 z : pos[0].attributes.getNamedItem("z").value,
							 w : pos[0].attributes.getNamedItem("w").value };

		var ambient = lightsList[i].getElementsByTagName('ambient');
		if(ambient[0] == null || ambient.length != 1) {
			return "ambient element is missing or there are more than one element found.";
		}

		var ambientList = { r : ambient[0].attributes.getNamedItem("r").value,
							g : ambient[0].attributes.getNamedItem("g").value,
							b : ambient[0].attributes.getNamedItem("b").value,
							a : ambient[0].attributes.getNamedItem("a").value };

		var diffuse = lightsList[i].getElementsByTagName('diffuse');
		if(diffuse[0] == null || diffuse.length != 1) {
			return "diffuse element is missing or there are more than one element found.";
		}

		var diffuseList = { r : diffuse[0].attributes.getNamedItem("r").value,
							g : diffuse[0].attributes.getNamedItem("g").value,
							b : diffuse[0].attributes.getNamedItem("b").value,
							a : diffuse[0].attributes.getNamedItem("a").value };

		var specullar = lightsList[i].getElementsByTagName('specullar');
		if(specullar[0] == null || specullar.length != 1) {
			return "diffuse element is missing or there are more than one element found.";
		}

		var specullarList = { r : specullar[0].attributes.getNamedItem("r").value,
						      g : specullar[0].attributes.getNamedItem("g").value,
							  b : specullar[0].attributes.getNamedItem("b").value,
							  a : specullar[0].attributes.getNamedItem("a").value };

		var val = { enable : enable[0].attributes.getNamedItem("value").value,
					position : positionList,
					ambient : ambientList,
					diffuse : diffuseList,
					specullar : specullarList };


		this.lights.add(id,val); //carrega elemento "light" para array associativo
	}
}

//TEXTURES  <<< //É suposto funcionar se nao existirem elementos "TEXTURE"?
MySceneGraph.prototype.parseTextures= function(rootElement) {

	var elems = rootElement.getElementsByTagName('TEXTURES');	
	if (elems == null) {
		return "TEXTURES element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one TEXTURES element found.";
	}

	
	var texturesList = elems.getElementsByTagName('TEXTURE');
	if(texturesList.length == 0){
		return "no textures found";
	}
	
	this.textures = assocArray;

	//carrega todos os elementos "light"
	for(var i = 0; i < texturesList.length; i++){
		
		var id = texturesList[i].attributes.getNamedItem("id").value;

		var file = texturesList[i].getElementsByTagName('file');
		if(file == null || file.length != 1){
			return "file element is missing or there are more than one element found."
		}

		var amplif_factorList = texturesList[i].attributes.getNamedItem("amplif_factor");
		if(amplif_factor == null || amplif_factor.length != 1){
			return "amplif_factor element is missing or there are more than one element found."
		}

		var amplif_factorList = {s : amplif_factor[0].attributes.getNamedItem("s"),
								 t : amplif_factor[0].attributes.getNamedItem("t") };

	
		var val = { file : file[0].attributes.getNamedItem("path").value,
					amplif_factor : amplif_factorList };

		this.textures.add(id,val); //carrega elemento "texture" para array associativo
	}

}
	
//MATERIALS



/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {
	
	var elems =  rootElement.getElementsByTagName('globals');
	if (elems == null) {
		return "globals element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'globals' element found.";
	}

	// various examples of different types of access
	var globals = elems[0];
	this.background = this.reader.getRGBA(globals, 'background');
	this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
	this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
	this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

	console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

	var tempList=rootElement.getElementsByTagName('list');

	if (tempList == null) {
		return "list element is missing.";
	}
	
	this.list=[];
	// iterate over every element
	var nnodes=tempList[0].children.length;
	for (var i=0; i< nnodes; i++)
	{
		var e=tempList[0].children[i];

		// process each element and store its information
		this.list[e.id]=e.attributes.getNamedItem("coords").value;
		console.log("Read list item id "+ e.id+" with value "+this.list[e.id]);
	};

};
	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


