/**
 * Represents a terrain according to height/color map
 * @constructor
 * @param {object} scene  
 * @param {object} heightImage 
 * @param {object} dataImage 
 */
function MyTerrain(scene, heightImage, dataImage) {
    CGFobject.call(this, scene);
    this.scene = scene;
    
    this.heightMap = new CGFtexture(this.scene,heightImage);
    this.colorMap = new CGFtexture(this.scene,dataImage);

    this.testShader = new CGFshader(this.scene.gl,"shaders/terrain.vert","shaders/terrain.frag");
    
    this.testShader.setUniformsValues({
        heightMap: 1,
        colorMap:2
    });
    
    this.plane=new MyPlane(scene,128);
}
;

MyTerrain.prototype = Object.create(CGFobject.prototype);
MyTerrain.prototype.constructor = MyTerrain;


/**
* MyTerrain display method
*/
MyTerrain.prototype.display = function() {
    
    
    this.scene.setActiveShader(this.testShader);

        this.heightMap.bind(1);
        this.colorMap.bind(2);
        this.plane.display();

    this.scene.setActiveShader(this.scene.defaultShader);

}
;

MyTerrain.prototype.updateTexCoords = function(s, t) {
}
;
