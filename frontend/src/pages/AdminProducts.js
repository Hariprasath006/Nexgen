import {useEffect,useState} from "react";
import axios from "axios";

function AdminProducts(){

const [products,setProducts] = useState([]);

useEffect(()=>{

fetchProducts();

},[]);

const fetchProducts = async()=>{

const res = await axios.get("http://localhost:5000/api/foods");

setProducts(res.data);

};

const deleteProduct = async(id)=>{

await axios.delete("http://localhost:5000/api/foods/"+id);

fetchProducts();

};

return(

<div>

<h2>Product List</h2>

{products.map(p=>(

<div key={p._id} style={{border:"1px solid #ddd",padding:"10px",margin:"10px"}}>

<h3>{p.name}</h3>

<p>${p.price}</p>

<button onClick={()=>deleteProduct(p._id)}>
Delete
</button>

</div>

))}

</div>

)

}

export default AdminProducts;