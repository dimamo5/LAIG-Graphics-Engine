/**
 * MyInterface
 * @constructor
 */
  
function MyInterface() {
	//call CGFinterface constructor 
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);
	
	// init GUI. For more information on the methods, check:
	//  http://workshop.chromeexperiments.com/examples/gui
	
	this.gui = new dat.GUI();
	
	var group = this.gui.addFolder("Luzes");
	group.open();
	
	console.log("interface");

	group.add(this.scene, 'luz1');
	group.add(this.scene, 'luz2');
	group.add(this.scene, 'luz3');


	
	return true;
};
