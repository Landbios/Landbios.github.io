
const request = new XMLHttpRequest();
let resultword;
let percent = 0;
let normalizedword;

let coincidancecount;

let producttable = [];

//ejecutar la funcion principal
document.querySelector('#loadbtn').addEventListener('click',mainf);
// ordenar por precio
document.querySelector('#orderprice').addEventListener('click',orderByPrice);





//Leer datos de word

function bringdataword(){

    request.open('GET','/json/words.json',true);

    request.send();

    request.onreadystatechange = function loadword (){


        if(this.readyState == 4 && this.status == 200){
            
            let data = JSON.parse(this.responseText);

            for(let words of data){

              if(normalizedword == words.word1){


                normalizedword = words.word2;

                percent = words.percent2;

                break;

                }

                else if( normalizedword == words.word2){


                  normalizedword = words.word1;

                  percent = words.percent1;

                  break;

                }

                else if(normalizedword === ""){

                  alert('ingrese una palabra en el buscador')

                  break;

                }
                             
            } 

          
            bringpdata();
        }
        
        
        
    }
   
}



const removeAccents = (str) => {


  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

} 

//Funcion de leer productos
function bringpdata (){
  
   producttable = [];
   coincidancecount = 0.0;
  
  request.open('GET','/json/products.json',true);

  request.send();

  request.onreadystatechange = function productload (){


    if(this.readyState == 4 && this.status == 200){

      let i = 0;



      let pdata = JSON.parse(this.responseText);

       for (let product of pdata){

        let tempname = product.name.toLowerCase();

        let tempdesc = product.description.toLowerCase();

        if(tempname.indexOf(normalizedword) !==-1 && i <= 20){
          
          coincidancecount = coincidancecount + 0.7;
          producttable.push(product);
          
          producttable[i].coincidance = coincidancecount;

         

          i++


        }

        else if(tempdesc.indexOf(normalizedword) !==-1 && i <= 20){


          coincidancecount = coincidancecount + 0.3;

          producttable.push(product);

          producttable[i].coincidance = coincidancecount;

          

          i++

        }



      }
        
      if(producttable.length === 0){

        alert('no hubieron resultados en tu busqueda');

      }

      else{

        
        filltable();

      }

    }

  }

}


// Funcion de llenado
function filltable(){

  let pcontent = document.querySelector('#tablebody');

  pcontent.innerHTML = '';

  producttable.sort((a,b) => a.coincidance - b.coincidance);

  for(var j=0; j<producttable.length; j++){

    pcontent.innerHTML+=
    `<tr>
      <td>`+producttable[j].name+`</td>
      <td></td>
      <td>`+producttable[j].description+`</td>
      <td></td>
      <td>`+producttable[j].price+`</td>
  
    </tr>`;

    
  }

}

function orderByPrice(){

  let pcontent = document.querySelector('#tablebody');

  pcontent.innerHTML = '';

  producttable.sort((a,b) => a.price - b.price);

  if(producttable.length === 0){

    alert('aun no buscas nada');

  }

  else{
      for(var j=0; j<producttable.length; j++){

        pcontent.innerHTML+=
        `<tr>
          <td>`+producttable[j].name+`</td>
          <td></td>
          <td>`+producttable[j].description+`</td>
          <td></td>
          <td>`+producttable[j].price+`</td>
  
        </tr>`;

    
      }
  }
}

function mainf (){


  //Remover acentos
  resultword = document.querySelector('#search1').value;

  
  normalizedword = removeAccents(resultword);

  
  //Obtener datos del JSON(Words) y (Products) y colocar datos en tabla
    
        
  bringdataword();



} 