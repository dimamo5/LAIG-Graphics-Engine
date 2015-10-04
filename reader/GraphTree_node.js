function SceneGraph_node(id,material_id,texture_id) {

    this.id = id;
    this.material_id = material_id;
    this.texture_id = texture_id;
    this.rotation = [] ;
    this.scale = [];
    this.translation = [];
}

SceneGraph_node.prototype.setRotation = function(rot){
    this.rotation= rot;
}

SceneGraph_node.prototype.setTranslation = function(trans){
    this.translation = trans;
}

SceneGraph_node.prototype.setScale = function(scale){
    this.scale = scale;
}
