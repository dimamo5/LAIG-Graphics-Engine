/**
 * Represents a composed animation
 * @constructor
 */
function ComposedAnimation(){
    
   this.animationsIDs = [];
}

ComposedAnimation.prototype.constructor = ComposedAnimation;

/**
 * Stores an animation id
 * @param {string} id - animation id
 */
ComposedAnimation.prototype.addAnimation = function(id){
    this.animationsIDs.push(id);
}

/**
 * Returns an animation id
 * @param {int} indice - animations index 
 */
ComposedAnimation.prototype.getAnim = function(indice){
    return indice < this.animationsIDs.length ? this.animationsIDs[indice] : "Composed Animation: trying to access outside of array";
}
