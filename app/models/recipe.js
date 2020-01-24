var mongoose = require('mongoose');
var recipeSchema = new mongoose.Schema({
    recipeName : {type: String},
    recipeDesc : {type: Array},
    recipeImage: {type: String},
    recipeAuthor: {type: String},
    recipeLike : {type: Number} 
});

module.exports = mongoose.model("Recipe", recipeSchema);
