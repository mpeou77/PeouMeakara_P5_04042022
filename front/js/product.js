/***********************      Affichage de la fiche produit d'un canapé sur la page produit   **********************************/

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
// on récupère toutes les  données de l'API
fetch("http://localhost:3000/api/products/"+urlParams.get("id"))
  .then (resp => {
    if (resp.ok) {
      return resp.json();
    }
  })
  
  // on ajoute toutes les données d'un canapé au DOM
  .then(produit => {
    const image = document.getElementsByClassName("item__img")[0];
    image.innerHTML = '<img src="'+produit.imageUrl+'" alt="'+produit.altTxt+'">';
    let url = document.getElementsByClassName("item__img")[0];
    url.setAttribute ("data-url", produit.imageUrl);
    let name = document.getElementById("title");
    name.innerHTML = produit.name;
    name.setAttribute("data-name", produit.name);
    let price = document.getElementById("price");
    price.innerHTML = produit.price;
    price.setAttribute("data-price", parseInt(produit.price));
    let id = document.getElementsByClassName("item__content")[0];
    id.setAttribute ("data-id", produit._id);
    document.getElementById("description").innerHTML = produit.description;
    let colors = produit.colors;
    let colorsHTML = document.getElementById("colors");
    colors.forEach(element => {
      let optionHTML = document.createElement("option");
      optionHTML.innerHTML = element;
      optionHTML.value = element;
      colorsHTML.appendChild(optionHTML);    // affiche la fiche produit 
    });
  })                      
  .catch(err => {
    alert("problème de chargement");
  });

/**********************************   Ajout des choix de canapés de l'utilisateur dans le Panier/localStorage **********************/
 
let panier = [];
document.getElementById("addToCart").onclick = () => {
  if (localStorage.getItem("produit") != null) {         //panier non vide
  panier = JSON.parse(localStorage.getItem("produit"));
  }

  // on récupère les données du canapé pour le stocker dans  l'élément "produit"
  let produit = {};
  produit.id = document.getElementsByClassName("item__content")[0].getAttribute("data-id");
  produit.colors = document.getElementById("colors").value;
  produit.quantity = parseInt(document.getElementById("quantity").value);

  // on vérifie sur la quantité minimal et maximal
  if (produit.quantity == 0 || produit.quantity > 100) {
    alert("Oups, quantité de vente entre 1 et 100");
    return;
  }

  // prévenir l'utilisateur qu'il faut obligatoirement un couleur pour le canapé
  if (produit.colors == "") {
    alert("choisissez d'abord une couleur"); 
    return;           
  }

  // prévenir l'utilisateur qu'il faut obligatoirement un nombre entier
  if(!/^[0-9]+$/.test(produit.quantity)) {
    alert ("Nombre entier SVP!!");
    return;
  }

  // On vérifie pour chaque canapé du panier que le canapé n'est pas déjà dedans 
  for (let i=0; i < panier.length; i++) {
    let element = panier[i]; 
    // si même id et couleur, on rajoute juste la quantité qu'il faut sans rajouter un nouveau canapé
    if ((produit.id == element.id) && (produit.colors == element.colors)) {
      let quantity = parseInt(produit.quantity) + parseInt(element.quantity); //transforme "produit.quantity" en nombre
      element.quantity = quantity;
      localStorage.produit = JSON.stringify(panier);
      return;
    }
  }    
  // on ajoute le canapé dans l'objet "panier" et on met à jour le localStorage
  panier.push(produit);
  localStorage.produit = JSON.stringify(panier);
}

