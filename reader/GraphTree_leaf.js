function GraphTree_leaf(id,type, args) {

    this.id = id;
    this.type = type;
    this.args = args;
}

/* 
retorna 1 array do tipo : { tipo de primitiva, arg1, arg2 ...}
*/
GraphTree_leaf.prototype.parseArgs = function() {
    var array = [];

    switch(this.type){        
       
        case "triangle":                
            array.push(this.type);
            var str_splited = this.args.split(" "); //original: ["arg1 arg2 arg3 ..."] > split > { "arg1","arg2","arg3",...}
            
            for(var i = 0; i < 9 ; i++){
                array.push( parseFloat( str_splited[i]) ); //converte elementos da string e carrega-os para o array a ser retornado
            }
            break;     
        
        case "rectangle":            
            array.push(this.type);
            var str_splited = this.args.split(" ");    
                     
            for(var i = 0; i < 4 ; i++){
                array.push( parseFloat( str_splited[i]) ); 
            }
            break;             

        case "circle":
            return "no circle parseArgs case yet defined";
            break;

        case "cylinder":            
            array.push(this.type);
            var str_splited = this.args.split(" ");    
            
            var i;        
            for(i=0; i < 3 ; i++){
                array.push( parseFloat( str_splited[i]) ); 
            }

            for(; i < 5;i++){
                array.push( parseInt( str_splited[i],10) ); //parseInt("string",numeric_base) 
            }
            break;              
       
        case "sphere":
            array.push(this.type);
            var str_splited = this.args.split(" ");    
                                
            for(var i=0; i < 3 ; i++){
               if(i == 0) 
                array.push( parseFloat( str_splited[i]) ); 
               else
                array.push( parseInt( str_splited[i],10) ); 
            }                        
            break;

        default: 
            return "parseArgs() -> no acceptable primitive type found ";
    }
    
    return array;
}
