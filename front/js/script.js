/**********************************       Affichage de tous les canapés sur la page d'accueil ******************************/
    
// on récupère toutes les données dans l'api
fetch("http://localhost:3000/api/products")
  .then (resp => {
    if (resp.ok) {
      return resp.json();
    }
  })
  .then(produit => {
  // affichage des données de l'api sur la page d'accueil
  let items=document.getElementById("items");
  produit.forEach(item => {
    let child=document.createElement("a");
    child.href="./product.html?id="+item._id;    // pour pouvoir être rediriger sur la page "fiche produit"
    child.innerHTML='<article><img src="'+item.imageUrl+'" alt="'+item.altTxt+'" />'+
    '<h3 class="productName">'+item.name+'</h3>'+
    '<p class="productDescription">'+item.description+'</p>'+
    '</article>';
    items.appendChild(child); // on affiche tous les canapés grâce l'ajout d'un noeud à l'élément "items" du DOM
    });
  })

  // retourne une erreur si on ne récupère pas les données de l'API
  .catch(err => {
    alert( "problème de chargement");
  });
