/**
 * Represents a texture, extends CGFtexture
 * @constructor
 * @param {object} scene 
 * @param {string} url - path to texture's file
 * @param {integer} amplif_s - texture's amplifying factor s
 * @param {integer} amplif_t - texture's amplifying factor t
 * @param {integer} id - texture's id
 */
function MyTexture(scene, url, amplif_s, amplif_t, id ) {
    CGFtexture.call(this,scene,url);
    
    this.file_path = url;
    this.amplif_s = amplif_s;
    this.amplif_t = amplif_t;
    this.id = id;
}

MyTexture.prototype = Object.create(CGFtexture.prototype);
MyTexture.prototype.constructor = MyTexture;

