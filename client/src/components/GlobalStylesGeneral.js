import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
 html, body
  {font-family: 'Lato', sans-serif;
        margin: 0;
  
    }



* {
  box-sizing: border-box;
}

.account{

  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  
}

.categorySelectionRender{

}

.tab{

}
.row {
  display: flex;
  -ms-flex-wrap: wrap; 
  flex-wrap: wrap;
  
}

.col-25 {
  -ms-flex: 25%; 
  flex: 25%;
}

.col-50 {
  -ms-flex: 50%; 
  flex: 50%;
}

.col-75 {
  -ms-flex: 75%;
  flex: 75%;
}

.col-25,
.col-50,
.col-75 {
  
}

.containerCheckout {
  background-color: #f2f2f2;
  padding: 5px 20px 15px 20px;
  border-radius: 3px;
}

input.orderForm {
  width: 100%;
  margin-bottom: 20px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

input[type=number].orderFormNum {
  width: 100%;
  margin-bottom: 20px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.location{
    width: 100%;
  margin-bottom: 20px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

label {
  margin-bottom: 10px;
  display: block;
}

.icon-container {
  margin-bottom: 20px;
  padding: 7px 0;
  font-size: 25px;
}

.btn {
  background-color: #04AA6D;
  color: white;
  padding: 12px;
  margin: 10px 0;
  border: none;
  width: 100%;
  border-radius: 3px;
  cursor: pointer;
  font-size: 17px;
}

.btn:hover {
  background-color: #45a049;
}

a {
  color: #2196F3;
}

hr {
  border: 1px solid lightgrey;
}

span.price {
  float: right;
  color: grey;
}

span.quantity{
    float: middle;
    color: grey;
}

button{
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
    margin-top:10px;
}

button:before {
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



button:hover:before {
    opacity: 1;
}

button:after {
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




@media all and (max-width: 2000px){
  .account{

    height: 80vh;
  }
  .tab{

    height: 75vh;
    font-size: 16px;
    width: 50vw;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 20%;

  }

  .sidebar{
   
    width: 50vw;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);

   
  }
}

@media all and (max-width: 750px){
  .account{
   
    height: 8vh;
  }

  .tab{

width: 85vw;
font-size: 14px;

}

.sidebar{ 
width: 85vw;
 }
}


`;
