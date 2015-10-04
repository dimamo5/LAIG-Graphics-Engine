function assocArray() {

    this.associative_array = {};
}

assocArray.prototype.add = function(id,val) {

    var content = null;
    
    if(this.array[id] != undefined){

        content = this.associative_array[id];
    }
    
    this.associative_array[id] = val;

    /* Retorna valor (antigo) correspondente à id passada ou null caso o array nao tenha um vlaor definido para o id */
    return content; 
}

assocArray.prototype.remove = function(id){
       
   delete this.associative_array[id];
}

assocArray.prototype.get = function(id){

    return this.associative_array[id];    
}
