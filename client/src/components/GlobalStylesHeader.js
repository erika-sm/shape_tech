import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`


body {
    font-family: 'Lato', sans-serif;
}

.categories {

 
    position: absolute;
    background-color: #333;
    
    width: 60vw;
   top: 6%;
  left: 50%;
 transform: translateX(-50%);


  }
  
  .categoriesList {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    

  }
  
  .categoriesList a {
    font-weight: 600;
    display: block;
    color: white;
    text-align: center;
    padding: 14px;
    margin-right: 5px;
    text-decoration: none;
  }
  
  .categories a:hover {
    background-color: #111;}

    .categoryTitle :hover {
   
     
        color: transparent;
    }

    @media all and (max-width: 2000px){
  .categories{
    font-size: 18px;
  }
}

@media all and (max-width: 1400px){
  .categories{
    font-size: 15px;
  }
}

@media all and (max-width: 1250px){
  .categories{
    font-size: 14px;
  }
}

@media all and (max-width: 1150px){
  .categories{
    font-size: 13px;
  }
}



@media all and (max-width: 1090px){
  .categories{
    display: none;
  }
}


`;
