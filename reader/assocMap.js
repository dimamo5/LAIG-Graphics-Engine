function assocMap() {

    this.associative_map = {};
    this.length=0;
}

assocMap.prototype.add = function(id,val) {

    var content = null;
    
    if(this.associative_map[id] != undefined){

        content = this.associative_map[id];
        this.length--;
    }
    
    this.associative_map[id] = val;

    this.length++;

    /* Retorna valor (antigo) correspondente à id passada ou null caso o array nao tenha um vlaor definido para o id */
    return content; 
}

assocMap.prototype.remove = function(id){
       
   delete this.associative_map[id];
   this.length--;
}

assocMap.prototype.get = function(id){

    return this.associative_map[id];    
}

assocMap.prototype.length = function(){
    return this.length
}

