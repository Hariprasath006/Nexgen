const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

items: [Object],   // allow full cart item object

totalPrice: Number,

address: {
firstName:String,
lastName:String,
email:String,
street:String,
city:String,
state:String,
zip:String,
country:String,
phone:String
},

payment:String,

status:{
type:String,
default:"Order Placed"
}

},{
timestamps:true
});

module.exports = mongoose.model("Order",orderSchema);