/**
 * Represents an hashmap (associative array implementation).
 * @constructor
 */
function assocMap() {

    this.associative_map = {};
    this.length=0;
}

/**
 * Add an object to the associative array
 * @param {integer} id - object's id
 * @param {object} val - object 
 */
assocMap.prototype.add = function(id,val) {

    var content = null;
    
    if(this.associative_map[id] !== undefined){

        content = this.associative_map[id];
        this.length--;
    }
    
    this.associative_map[id] = val;

    this.length++;

    /* Retorna valor (antigo) correspondente à id passada ou null caso o array nao tenha um vlaor definido para o id */
    return content; 
};

/**
 * Deletes an object of the associative array
 * @param {integer} id - sobject's id
 */
assocMap.prototype.remove = function(id){
       
   delete this.associative_map[id];
   this.length--;
};

/**
 * Returns the associative array
 * @param {integer} id - object's id
 */
assocMap.prototype.get = function(id){

    return this.associative_map[id];    
};

/**
 * Returns the associative array lenght
 */
assocMap.prototype.length = function(){
    return this.length;
};

