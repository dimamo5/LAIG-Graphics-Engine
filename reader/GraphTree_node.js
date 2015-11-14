/**
 * Represents a graph tree node
 * @constructor
 * @param {integer} id - texture's id
 * @param {integer} material_id - material's id
 * @param {integer} texture_id - texture's id
 */
function GraphTree_node(id,material_id,texture_id, animation_id) {

    this.id = id;
    this.material_id = material_id;
    this.texture_id = texture_id;
    this.animation_id = animation_id;
    this.descendants = [];
    
    this.transformations= []; //formato : { ["tipo_transf",val1,val2,...] , [] , ...}
}


/** Creates transformations's matrix */
GraphTree_node.prototype.getMatrix=function(){
    var matrix=mat4.create(); //gera matriz
    mat4.identity(matrix);

	//aplica transformacoes a matriz
    for(var i=0;i<this.transformations.length;i++){
        if(this.transformations[i][0]=="TRANSLATION"){
            mat4.translate(matrix,matrix,vec3.fromValues(this.transformations[i][1],this.transformations[i][2],this.transformations[i][3]));
        }else if(this.transformations[i][0]=="ROTATION"){
            mat4.rotate(matrix,matrix,degToRad(this.transformations[i][2]),vec3.fromValues(this.transformations[i][1][0],this.transformations[i][1][1],this.transformations[i][1][2]));
        }else if(this.transformations[i][0]=="SCALE"){
            mat4.scale(matrix, matrix, vec3.fromValues(this.transformations[i][1],this.transformations[i][2],this.transformations[i][3]));
        }
    }

    return matrix;    
};

/**
 * Converts degrees to radians
 * @param {integer} degrees - degrees value to be converted
 */
function degToRad(degrees) {
        return degrees * Math.PI / 180;
}

