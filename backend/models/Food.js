const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({

name:{
type:String,
required:true
},

price:{
type:Number,
required:true
},

offerPrice:{
type:Number,
default:0
},

category:{
type:String,
required:true
},

description:{
type:String,
default:""
},

  image:{
    type: [String]
  },

  rating: {
    type: Number,
    default: 0
  },

  numReviews: {
    type: Number,
    default: 0
  },

  stock: {
    type: Number,
    default: 50
  }

},{
timestamps:true
});

module.exports = mongoose.model("Food",foodSchema);