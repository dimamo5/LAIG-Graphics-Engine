function SceneGraph_node(id,material_id,texture_id) {

    this.id = id;
    this.material_id = material_id;
    this.texture_id = texture_id;
    
    this.transformations= []; //formato : { ["tipo_transf",val1,val2,...] , [] , ...}
}

