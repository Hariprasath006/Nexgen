import React from "react";
import { useNavigate } from "react-router-dom";

function CartPanel({ cart, removeFromCart, closeCart }) {

const navigate = useNavigate();

const total = cart.reduce((sum,item)=>sum + item.price,0);

return(

<div className="cart-overlay">

<div className="cart-box">

<div className="cart-header">

<h3>Your Cart</h3>

<button onClick={closeCart}>✕</button>

</div>

{cart.length === 0 ? (

<p style={{padding:"20px"}}>Cart is empty</p>

):(cart.map((item,index)=>(

<div className="cart-item" key={index}>

<img src={item.image} alt={item.name}/>

<div className="cart-info">

<p>{item.name}</p>
<p>₹{item.price}</p>

</div>

<button
className="remove-btn"
onClick={()=>removeFromCart(index)}
>
Remove
</button>

</div>

)))}

<div className="cart-footer">

<h4>Total: ₹{total}</h4>

<button
className="checkout-btn"
onClick={()=>navigate("/cart")}
>

Checkout

</button>

</div>

</div>

</div>

)

}

export default CartPanel;