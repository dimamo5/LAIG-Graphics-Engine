function MyTexture(scene, url, amplif_s, amplif_t, id ) {
    CGFtexture.call(this,scene,url);
    
    this.file_path = url;
    this.amplif_s = amplif_s;
    this.amplif_t = amplif_t;
    this.id = id;
}

MyTexture.prototype = Object.create(CGFtexture.prototype);
MyTexture.prototype.constructor = MyTexture;

