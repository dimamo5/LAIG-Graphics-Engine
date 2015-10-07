function assocMap() {

    this.associative_map = {};
}

assocMap.prototype.add = function(id,val) {

    var content = null;
    
    if(this.associative_map[id] != undefined){

        content = this.associative_map[id];
    }
    
    this.associative_map[id] = val;

    /* Retorna valor (antigo) correspondente à id passada ou null caso o array nao tenha um vlaor definido para o id */
    return content; 
}

assocMap.prototype.remove = function(id){
       
   delete this.associative_map[id];
}

assocMap.prototype.get = function(id){

    return this.associative_map[id];    
}
