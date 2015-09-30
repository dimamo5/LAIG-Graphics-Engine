
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
	var error = this.parseInitials(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	//this.scene.onGraphLoaded();
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
	var frustum = elems[0].getElementsByTagName('frustum');
	if (frustum[0] == null || frustum.length != 1) {
		return "frustum element is missing or there are more than one element found.";
	}

	this.scene.frustum = { near : this.reader.getFloat(frustum[0],"near",true),
	           		 far : this.reader.getFloat(frustum[0],"far",true) };
	
	//translate
	var translate = elems[0].getElementsByTagName('translate');
	if(translate[0] == null || translate.length != 1) {
		return "translate element is missing or there are more than one element found.";
	}

	this.scene.translate = { x : this.reader.getFloat(translate[0],"x",true),
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

	this.scene.scale = { sx : this.reader.getFloat(scale[0],"sx",true),
				   sy : this.reader.getFloat(scale[0],"sy",true),
				   sz : this.reader.getFloat(scale[0],"sz",true) };
	
	//reference
	var reference = elems[0].getElementsByTagName('reference');
	if ( reference[0] == null || reference.length != 1 ) {
		return "reference element is missing or there are more than one element found.";
	}

	this.scene.reference = this.reader.getFloat(reference[0],"length",true);
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
	var ambient = elems[0].getElementsByTagName('ambient');
	if (ambient[0] == null || ambient.length != 1) {
		return "ambient element is missing or there are more than one element found.";
	}

	this.scene.ambient = { r: this.reader.getFloat(ambient[0],"r",true),
					 g: this.reader.getFloat(ambient[0],"g",true),
					 b: this.reader.getFloat(ambient[0],"b",true) ,
					 a: this.reader.getFloat(ambient[0],"a",true) };

	//doubleside
	var doubleside = elems[0].getElementsByTagName('doubleside');
	if (doubleside[0] == null || doubleside.length != 1) {
		return "doubleside element is missing or there are more than one element found.";
	}

	this.scene.doubleside = this.reader.getBoolean(doubleside[0],"value",true);

	//background 
	var background = elems[0].getElementsByTagName('background');
	if (background[0] == null || background.length != 1) {
		return "background element is missing or there are more than one element found.";
	}

	this.scene.background = { r: this.reader.getFloat(background[0],"r",true),
						g: this.reader.getFloat(background[0],"g",true), 
						b: this.reader.getFloat(background[0],"b",true), 
						a: this.reader.getFloat(background[0],"a",true) };
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
	var lightsList = elems[0].getElementsByTagName('LIGHT');
	if(lightsList.length == 0){
		return "no lights found";
	}
	
	//array de lights
	this.scene.lights = [];

	//carrega todos os elementos "light"
	for(var i = 0; i < lightsList.length;i++){
		
		var id = this.reader.getString(lightsList[i],"id",true );

		var enable = lightsList[i].getElementsByTagName('enable');
		if(enable[0] == null || enable.length != 1) {
			return "enable element is missing or there are more than one element found.";
		}

		var enable_val = this.reader.Boolean(enable[0],"value",true);

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

		var specullar = lightsList[i].getElementsByTagName('specullar');
		if(specullar[0] == null || specullar.length != 1) {
			return "diffuse element is missing or there are more than one element found.";
		}

		var specullarList = { r : this.reader.getFloat(specullar[0],"r",true),
						      g : this.reader.getFloat(specullar[0],"g",true),
							  b : this.reader.getFloat(specullar[0],"b",true),
							  a : this.reader.getFloat(specullar[0],"a",true) };

		//criacao do objecto light
		var light_Obj = new CGFLight(this.scene,id);

		if(enable_val == true ) //enable_val : T/F
			light_Obj.enable();
		else 
			light_Obj.disable();

		//sets dos atributos da CGFLight
		light_Obj.setAmbient(ambientList.r,ambientList.g,ambientList.b,ambientList.a);
		light_Obj.setDiffuse(diffuseList.r,diffuseList.g,diffuseList.b,diffuseList.a);
		light_Obj.setSpecullar(specullarList.r,specullarList.g,specullarList.b,specullarList.a);
		light_Obj.setPosition(positionList.x,positionList.y,positionList.z,positionList.w);

		this.lights[i] = light_Obj;
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

	
	var texturesList = elems[0].getElementsByTagName('TEXTURE');
	if(texturesList.length == 0){
		return "no textures found";
	}
	
	this.textures = assocArray;

	//carrega todos os elementos "light"
	for(var i = 0; i < texturesList.length; i++){
		
		var id = texturesList[i].attributes.getNamedItem("id").value;

		var file = texturesList[i].getElementsByTagName('file');
		if(file == null || file.length != 1){
			return "file element is missing or there are more than one element found.";
		}

		var amplif_factorList = texturesList[i].attributes.getNamedItem("amplif_factor");
		if(amplif_factor == null || amplif_factor.length != 1){
			return "amplif_factor element is missing or there are more than one element found.";
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


