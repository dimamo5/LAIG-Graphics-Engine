function GraphTree_node(id,material_id,texture_id) {

    this.id = id;
    this.material_id = material_id;
    this.texture_id = texture_id;
    this.descendants = [];
    
    this.transformations= []; //formato : { ["tipo_transf",val1,val2,...] , [] , ...}
}

GraphTree_node.prototype.getMatrix=function(){
    var matrix=mat4.create();
    mat4.identity(matrix);
    for(var i=0;i<this.transformations.length;i++){
        if(this.transformations[i]["tipo_transf"]=="TRANSLATION"){
            mat4.translate(matrix,matrix,[this.transformations[i]["x"],this.transformations[i]["y"],this.transformations[i]["z"]]);
        }else if(this.transformations[i]["tipo_transf"]=="ROTATION"){
            mat4.rotateX(matrix,matrix,this.transformations[i]["x"]);
            mat4.rotateY(matrix,matrix,this.transformations[i]["y"]);
            mat4.rotateZ(matrix,matrix,this.transformations[i]["z"]);
        }else if(this.transformations[i]["tipo_transf"]=="SCALE"){
            mat4.scale(matrix, matrix, vec3.fromValues(this.transformations[i]["x"],this.transformations[i]["y"],this.transformations[i]["z"]));
        }
    }
    return matrix;

}

function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }

