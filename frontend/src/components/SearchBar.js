import React from "react";

function SearchBar({ search, setSearch, category, setCategory }) {

return(

<div className="search-bar">

<input
type="text"
placeholder="Search food..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<select
value={category}
onChange={(e)=>setCategory(e.target.value)}
>

<option value="All">All</option>
<option value="Vegetables">Vegetables</option>
<option value="Fruits">Fruits</option>
<option value="Drinks">Drinks</option>
<option value="Bakery">Bakery</option>

</select>

</div>

)

}

export default SearchBar;