const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
document.getElementById('orderId').innerHTML = urlParams.get('orderId');
localStorage.clear();