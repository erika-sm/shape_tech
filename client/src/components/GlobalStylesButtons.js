import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
.sidenav{
  
  height: 100vh;
  margin-bottom: 15px;
  display: none;
  padding-top: 20px; 
  transition: 0.5s; 
  
}


.burger{
  width: 35px;
  height: 5px;
  background-color: black;
  margin: 6px 0;
}

.test{
  display:flex;
  flex-direction: column;
}

.dropbtn {
  background-color: #80AAFF;
  border-radius: 5px;
  color: white;
  padding: 5px;
  font-size: 16px;
  border: none;

}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: none;
top: 60%;
  
}


/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #00997a;
  color: black;
  min-width: 200px;
  border-radius: 5px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  text-align: center;
  
  
}

.loginBox{
  display: flex;
  flex-direction: row;
  width: 100px;
  margin-left: 200px;
}

.home{
  text-decoration: none;
  color: black;
}


.cart{
  text-decoration: none;
  position:absolute;
  width:50px;
  left: 50%;
  transform: translateX(1180%);

}

.dropbtn{
  width: 200px;
  height: 30px;
  border-radius: 10px;
}

.dropdown-content a:hover {background-color: #ddd;}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {display: flex;
  flex-direction: column}

/* Change the background color of the dropdown button when the dropdown content is shown */
.dropdown:hover .dropbtn {background-color: #3e8e41;}

.container {
  display: inline-block;
  border: none;
  background-color: white;
  cursor: pointer;
 
}

.bar1, .bar2, .bar3 {
  width: 35px;
  height: 5px;
  background-color: #333;
  margin: 6px 0;
  transition: 0.4s;
}



.links{
  display: flex;
  flex-direction: row;
  text-decoration: none;
  justify-content: center;
}

.name_price{
  font-size:15px;
}

.productImg{
  height: 120px;
}

.zoom{
  cursor: pointer;
  transition: transform .2s; /* Animation */
}

.zoom:hover{
  transform: scale(1.1); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
}

.searchbar{

}

.categorylink{
  text-decoration: none;
}

.addToCart{
    width: 220px;
    height: 25px;
    border: none;
    outline: none;
    color: #fff;
    background: black;
    cursor: pointer;
    position: relative;
    z-index: 0;
    border-radius: 10px;
}

.addToCart:before {
    content: '';
    background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
    position: absolute;
    top: -2px;
    left:-2px;
    background-size: 400%;
    z-index: -1;
    filter: blur(5px);
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    animation: glowing 20s linear infinite;
    opacity: 0;
    transition: opacity .3s ease-in-out;
    border-radius: 10px;
}




.addToCart:after {
    z-index: -1;
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: black;
    left: 0;
    top: 0;
    border-radius: 10px;
}




@keyframes glowing {
    0% { background-position: 0 0; }
    50% { background-position: 400% 0; }
    100% { background-position: 0 0; }
}

@media all and (max-width: 1090px){
.dropdown{
display: inline-block;
}
}



`;
