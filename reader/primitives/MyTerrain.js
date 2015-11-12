function MyTerrain(scene, heightImage, dataImage) {
    CGFobject.call(this, scene);
    this.scene = scene;
    
    this.heightMap = new CGFtexture(this.scene,"resources/heightmap_128.jpg");
    this.colorMap = new CGFtexture(this.scene,"resources/terrain.jpg");

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
