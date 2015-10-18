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
	this.scene=application.scene;
		
	return true;
};

/**
 * update
 */
MyInterface.prototype.updateInterface = function(){
    var group = this.gui.addFolder('Luzes');
    group.open();

    var interface = this;
	
	//actualiza as luzes na interface
    for (onOff in this.scene.lightsOn) {
        group.add(this.scene.lightsOn, onOff).onChange(function(enabled) {
            interface.scene.updateGuiLights(this.property, enabled);
        });
    }	
};
