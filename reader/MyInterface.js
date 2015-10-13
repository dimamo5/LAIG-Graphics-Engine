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

	var groupAnim=this.gui.addFolder("Animações");
	groupAnim.open();
	
	return true;
};

/**
 * processKeyboard
 * @param event {Event}
 */
MyInterface.prototype.processKeyboard = function(event) {
	// call CGFinterface default code (omit if you want to override)
	CGFinterface.prototype.processKeyboard.call(this,event);
	
	// Check key codes e.g. here: http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
	// or use String.fromCharCode(event.keyCode) to compare chars
	
	// for better cross-browser support, you may also check suggestions on using event.which in http://www.w3schools.com/jsref/event_key_keycode.asp
	/*switch (event.keyCode)
	{
		case (97):	// only works for capital 'A', as it is
			this.scene.robot.moveLeft();
			break;
		case(100):
			this.scene.robot.moveRigth();
			break;
		case(119):
			this.scene.robot.moveUp();
			break;
		case(115):
			this.scene.robot.moveDown();
			break;
			
	};*/
};

