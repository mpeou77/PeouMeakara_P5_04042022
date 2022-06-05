/********************************************     affichage de la page panier    ****************************************/
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let panier = JSON.parse(localStorage.getItem("produit")); // Json.parse(null)
if (panier == null) {
  panier = [];
}
let prixTotal = 0; // somme=0 au départ
let items = document.getElementById("cart__items");
let quantitéGlobale = 0; // quantitéGlobale=0 au départ; 
let qteSpan = document.getElementById("totalQuantity");
let totalSpan = document.getElementById("totalPrice");

//affichage des canapés dans la page web
for (i= 0; i < panier.length; i++) {
  const request = async () => {
    let index = i;
    const resp = await fetch("http://localhost:3000/api/products/"+panier[index].id);
    let produit = await resp.json();
    let child = document.createElement("article");
    child.setAttribute("class",'cart__item');
    child.setAttribute("data-id", produit._id);
    child.setAttribute("data-colors", panier[index].colors);
    child.setAttribute("data-price", produit.price);
    child.innerHTML = '<div class="cart__item__img">'+
    '<img src="'+produit.imageUrl+'" alt="'+produit.altTxt+'" />'+
    '</div>'+
    '<div class="cart__item__content">'+
    '<div class="cart__item__content__description">'+
      '<h2>'+produit.name+'</h2>'+
      '<p>'+panier[index].colors+'</p>'+
      '<p>'+produit.price+' €</p>'+
    '</div>'+
    '<div class="cart__item__content__settings">'+
    '<div class="cart__item__content__settings__quantity">'+
        '<p>Qté : </p>'+
        '<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="'+panier[index].quantity+'">'+
      '</div>'+
    '<div class="cart__item__content__settings__delete">'+
        '<p class="deleteItem">Supprimer</p>'+
    '</div>'+
    '</div>';
    items.appendChild(child);

    // calcule la somme des prix de tous les canapés
    prixTotal += parseInt(produit.price)*parseInt(panier[index].quantity);
    document.getElementById("totalPrice").innerHTML = prixTotal;
    
    //calcule le nombre global des canapés
    quantitéGlobale += parseInt(panier[index].quantity); // parseInt pour avoir un nombre et non un string
    document.getElementById("totalQuantity").innerHTML = quantitéGlobale; 
    
    // supprime un canapé de la page web
    var supprime = document.getElementsByClassName('deleteItem');
    for(i=0;i<supprime.length;i++){
      supprime[i].addEventListener('click',function(e){
        let target=e.target;
        let art=target.closest("article");
        deleteProduct(art);
      });
    }
    //changement de quantité pour un modèle de canapé et de même couleur
    var els = document.getElementsByClassName('itemQuantity');
    for(i=0;i<els.length;i++){
      els[i].addEventListener('change',function(e){
        let target=e.target;
        let art=target.closest("article");
        updateProduct(art,target.value);
      });

      els[i].addEventListener('keydown',function(e){
        e.preventDefault();
        alert("saisie interdite");
      });
    }
  }
  request();
}

//modification de la quantité d'un produit dans le panier
function updateProduct(art,value){
  for(i=0;i<panier.length;i++){
    if(panier[i].id==art.dataset.id && panier[i].colors==art.dataset.colors){
      quantitéGlobale-=panier[i].quantity;
      quantitéGlobale+=parseInt(value);
      prixTotal-=panier[i].quantity*art.dataset.price;
      prixTotal+=parseInt(value)*parseInt(art.dataset.price);
      panier[i].quantity=value;
      qteSpan.innerHTML=quantitéGlobale;
      totalSpan.innerHTML=parseInt(prixTotal);
      break;
    }
  } 
  localStorage.setItem("produit", JSON.stringify(panier));
}
  
//supprime un produit du panier
function deleteProduct(art){
  for(i=0;i<panier.length;i++){
    if(panier[i].id==art.dataset.id && panier[i].colors==art.dataset.colors){
      quantitéGlobale-=panier[i].quantity;
      prixTotal-=panier[i].quantity*art.dataset.price;
      qteSpan.innerHTML=quantitéGlobale;
      totalSpan.innerHTML=prixTotal;
      panier.splice(i,1);
      break;
    }
  }
  localStorage.produit=JSON.stringify(panier);
  let parent = art.parentNode;
  parent.removeChild(art);
}  

/***************************************************   Vérification du formulaire   ***************************************************/
 
const mail_format =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const text_format =/^[a-zA-Z\-_\s]{1,}$/;
const address_format =/^[0-9a-zA-Z\-_\s]{1,}$/;

// vérifie les bons caractères du prénom
let firstName = document.getElementById("firstName");
firstName.addEventListener('change',function(){
  validFirstName(firstName.value); 
  }
);
const validFirstName = function (inputFirstName){
  if ((text_format.test(inputFirstName))) {
    document.getElementById("firstNameErrorMsg").innerHTML = ""; 
    return true;
  }
  document.getElementById("firstNameErrorMsg").innerHTML = "Prénom Non Valide"; 
  return false;
}  
  
// vérifie les bons caractères du nom
let lastName = document.getElementById("lastName");
lastName.addEventListener('change',function(){
  validLastName(lastName.value); 
  }
);
const validLastName = function (inputLastname){
  if((text_format.test(inputLastname))) {
    document.getElementById("lastNameErrorMsg").innerHTML = "";
    return true;
  }
  document.getElementById("lastNameErrorMsg").innerHTML = "Nom Non Valide";
  return false;
}   

// vérifie les bons caractères de l'adresse
let address = document.getElementById("address");
address.addEventListener('change',function(){
  validAddress(address.value); 
  }
);
const validAddress = function (inputAddress){
  if((address_format.test(inputAddress))) {
    document.getElementById("addressErrorMsg").innerHTML = "";
    return true;
  }  
  document.getElementById("addressErrorMsg").innerHTML = "Adresse Non Valide";
  return false;
}

// vérifie les bons caractères de la ville
let city = document.getElementById("city");
city.addEventListener('change',function(){
  validCity(city.value); 
  }
);
const validCity = function (inputCity){
  if((text_format.test(inputCity))) {
    document.getElementById("cityErrorMsg").innerHTML = "";
    return true;
  }  
  document.getElementById("cityErrorMsg").innerHTML = "Ville Non valide";
  return false;
} 

// vérifie les bons caractères du mail
let email = document.getElementById("email");
email.addEventListener('change',function() {
    validEmail(email.value); 
  }
);
const validEmail = function (inputMail){
  if((mail_format.test(inputMail))) {
    document.getElementById("emailErrorMsg").innerHTML = "";
    return true;
  }
  document.getElementById("emailErrorMsg").innerHTML = "Email Non valide";
  return false;   
}

const commande = function() {
  let productIds = [];
  panier.forEach(element => {
    productIds.push(element.id);
  })

  return {
    contact: {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      email: document.getElementById("email").value,
    },
    products: productIds
  };
}

let order = document.getElementById("order");
order.addEventListener('click', function(e) {
  e.preventDefault();
  let data = commande();
  if (panier.length != 0 && validFirstName(data.contact.firstName) && validLastName(data.contact.lastName) && validAddress(data.contact.address) && validCity(data.contact.city)  && validEmail(data.contact.email)) {
   
    fetch("http://localhost:3000/api/products/order", {
	    method: "POST",
	    headers: {  
        'Accept': 'application/json', 
        'Content-Type': 'application/json' 
      },
	    body: JSON.stringify(data)
    })
    .then (resp => {
      if (resp.ok) {
       return resp.json();
      }
    })
    .then(order => {
      window.location.href='confirmation.html?orderId='+order.orderId;
    })
  }
});
