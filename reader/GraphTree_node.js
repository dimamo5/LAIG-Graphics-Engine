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
        if(this.transformations[i][0]=="TRANSLATION"){
            mat4.translate(matrix,matrix,[this.transformations[i][1],this.transformations[i][2],this.transformations[i][3]]);
        }else if(this.transformations[i][0]=="ROTATION"){
            mat4.rotate(matrix,matrix,degToRad(this.transformations[i][2]),this.transformations[i][1]);
        }else if(this.transformations[i][0]=="SCALE"){
            mat4.scale(matrix, matrix, vec3.fromValues(this.transformations[i][1],this.transformations[i][2],this.transformations[i][3]));
        }
    }

    return matrix;
    
}

function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }

