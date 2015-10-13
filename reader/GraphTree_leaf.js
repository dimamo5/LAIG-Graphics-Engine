function GraphTree_leaf(id,type, args) {

    this.id = id;
    this.type = type;
    this.args = args;
    this.object;
}

GraphTree_leaf.prototype.constructor = GraphTree_leaf;
/* 
retorna 1 array do tipo : { tipo de primitiva, arg1, arg2 ...}
*/
GraphTree_leaf.prototype.createObject = function(scene) {
    var array = [];

    var str_splited = this.args.split(" "); //original: ["arg1 arg2 arg3 ..."] > split > { "arg1","arg2","arg3",...}
            for(var i=0;i<str_splited.length;i++){
                if(str_splited[i]==""){
                    str_splited.splice(i,1);
                }
            }

    switch(this.type){        
       
        case "triangle":                
            for(var i = 0; i < 9 ; i++){
                array.push( parseFloat( str_splited[i]) ); //converte elementos da string e carrega-os para o array a ser retornado
            }
            this.object=new MyTriangle(scene,array[0],array[1],array[2],array[3],array[4],array[5],array[6],array[7],array[8]);
            
            break;     
        
        case "rectangle":            
            for(var i = 0; i < 4 ; i++){
                array.push( parseFloat( str_splited[i]) ); 
            }
            this.object=new MyRectangle(scene,array[0],array[1],array[2],array[3]);
            break;             

        case "cylinder":                            
            var i;        
            for(i=0; i < 3 ; i++){
                array.push( parseFloat( str_splited[i]) ); 
            }

            for(; i < 5;i++){
                array.push( parseInt( str_splited[i],10) ); //parseInt("string",numeric_base) 
            }
            this.object=new MyCylinderSurface(scene,array[0],array[1],array[2],array[3],array[4]);
            break;              
       
        case "sphere":                                   
            for(var i=0; i < 3 ; i++){
               if(i == 0) 
                array.push( parseFloat( str_splited[i]) ); 
               else
                array.push( parseInt( str_splited[i],10) ); 
            }
            this.object=new MySphere(scene,array[0],array[1],array[2]);                        
            break;

        default: 
            return "parseArgs() -> no acceptable primitive type found ";
    }
}


