import React from "react";

function Help(){

return(

<div className="help-container">

<h1 className="help-title">Help Center</h1>

<input
type="text"
placeholder="Search help..."
className="help-search"
/>

<div className="help-grid">

{/* Account Issues */}

<div className="help-card">

<h3>Account Issues</h3>

<ul>
<li>Reset password</li>
<li>Update profile</li>
<li>Login problems</li>
</ul>

</div>


{/* Orders */}

<div className="help-card">

<h3>Orders</h3>

<ul>
<li>Track order</li>
<li>Cancel order</li>
<li>Refund policy</li>
</ul>

</div>


{/* Payments */}

<div className="help-card">

<h3>Payments</h3>

<ul>
<li>Wallet recharge</li>
<li>Payment issues</li>
<li>Payment methods</li>
</ul>

</div>


{/* Contact */}

<div className="help-card">

<h3>Contact Us</h3>

<p>Email: support@amazonsnacks.com</p>
<p>Phone: +91 9876543210</p>

</div>

</div>

</div>

)

}

export default Help;