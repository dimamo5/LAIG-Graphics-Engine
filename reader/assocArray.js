function assocArray() {

    this.array[];
}


assocArray.prototype.add = function(id,val) {

    var content = null;
    
    if(this.array[id] != undefined){

        content = this.array[id];
    }
    
    this.array['id'] = val;

    /* Retorna valor (antigo) correspondente à id passada ou null caso o array nao tenha um vlaor definido para o id */
    return content; 
}

assocArray.prototype.remove = function(id){
       
   var retArray = this.array.splice(id,1);
   return retArray.length();
}

assocArray.prototype.get = function(id){

    return this.array[id];    
}


assocArray.prototype.size = function(){

    return this.array.length;    
}