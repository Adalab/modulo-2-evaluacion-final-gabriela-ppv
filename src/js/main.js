"use strict";
const replacementUrl =
  "https://www.shutterstock.com/es/image-vector/fantasy-anime-girl-exploring-mystical-forest-2324079729";
const buttonSearch = document.querySelector(".js-buttonsearch");
const buttonReset = document.querySelector(".js-buttonreset");
const listFavorites = document.querySelector(".js-favoriteslist");
const listResults = document.querySelector(".js-resultslist");
const inputSearch = document.querySelector(".js-input");
let seriessearch = "";
let arraySeries = [];
let arrayFavorites = [];

// funcion que hace la peticion de los datos a API
function dataApi() {
  fetch(`https://api.jikan.moe/v4/anime?q=${seriessearch}`)
    .then((response) => response.json())
    .then((info) => {
      arraySeries = info.data;
      console.log(info.data);

      renderAnime(arraySeries, listResults); // aqui las mete al array,con el parametro y pinta los resultados
    });
}
// funcion manejadora del evento click de la busqueda general
function handleclickSearch(event) {
  event.preventDefault();
  seriessearch = inputSearch.value;
  dataApi();
}
//evento busqueda boton
buttonSearch.addEventListener("click", handleclickSearch);

function handleAddFavorites(event) {
  //funcion manejadora evento click favoritos
  event.preventDefault();
  console.log(event.currentTarget.id);
  const idAnime = event.currentTarget.id;
  const findAnime = arraySeries.find(
    (animeSelect) => parseInt(animeSelect.mal_id) === parseInt(idAnime)
  ); 

  const indexAnimeFav = arrayFavorites.findIndex(
    (animeSelect) => parseInt(idAnime) === parseInt(animeSelect.mal_id)
  );
  if (indexAnimeFav === -1) {
    arrayFavorites.push(findAnime);
    console.log(arrayFavorites);
    localStorage.setItem("animesFav", JSON.stringify(arrayFavorites)); // cuando termine de poner los fav, los guarde en el local
  }

  renderAnime(arrayFavorites, listFavorites);
}

function listenerAnime() {
  // funcion que escucha eventos en los anime y se ejecuta en render al terminar render.
  const allAnime = document.querySelectorAll(".js-anime");
  for (const oneAnime of allAnime) {
    oneAnime.addEventListener("click", handleAddFavorites);
  }
}

//funcion que pinta los resultados
function renderAnime(arrayAnimes, urlrender) {
  urlrender.innerHTML = ""; // para que no se me acomularan las busquedas y se vaciara.
  let html = "";

  for (const animes of arrayAnimes) {
    const imageUrl = animes.images
      ? animes.images.jpg.image_url
      : replacementUrl;

    const indexFavoritosIn = arrayFavorites.findIndex(
      (animeFavorite) => animeFavorite.mal_id === animes.mal_id
    );

    const classFavorites = indexFavoritosIn !== -1 && urlrender === listResults ? "favchange" : "";
    

    html += `<li class ="js-anime ${classFavorites}" " id="${animes.mal_id}"> <h5>${animes.title}</h5>
        <img src="${imageUrl}" alt="foto portada Anime">
        </li>`;
  }
  urlrender.innerHTML += html; //le paso el parametro aqui tambien para que cambie de lugar

  listenerAnime();
}

function getDataFavoritesLocal() {
  // funcion que guarda a favoritos en el local o los pide si no estan.

  const favoriteAnimeLocal = JSON.parse(localStorage.getItem("animesFav"));

  if (favoriteAnimeLocal != null) {
    arrayFavorites = favoriteAnimeLocal;
    renderAnime(arrayFavorites, listFavorites);
    console.log(arrayFavorites);
  } else {
    dataApi();
  }
}

getDataFavoritesLocal();
