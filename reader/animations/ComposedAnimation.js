function ComposedAnimation(){
    
   this.animationsIDs = [];
}

ComposedAnimation.prototype.constructor = ComposedAnimation;

ComposedAnimation.prototype.addAnimation = function(id){
    this.animationsIDs.push(id);
}

ComposedAnimation.prototype.getAnim = function(indice){
    return indice < this.animationsIDs.length ? this.animationsIDs[indice] : "Composed Animation: trying to access outside of array";
}
