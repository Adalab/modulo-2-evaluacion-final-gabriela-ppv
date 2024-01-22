"use strict";

const replacementUrl = "https://placehold.co/250x350/0000ff/ffff00/Anime";
const buttonSearch = document.querySelector(".js-buttonsearch");
const buttonReset = document.querySelector(".js-buttonreset");
const listFavorites = document.querySelector(".js-favoriteslist");
const listResults = document.querySelector(".js-resultslist");
const inputSearch = document.querySelector(".js-input");
const titleSearch = document.querySelector(".js-title-result");
let seriessearch = "";
let arraySeries = [];
let arrayFavorites = [];

// funcion que pide la informacion a Api

function dataApi() {
  fetch(`https://api.jikan.moe/v4/anime?q=${seriessearch}`)
    .then((response) => response.json())
    .then((info) => {
      arraySeries = info.data;

      renderResultAnime();
    });
}
// funcion manejadora  evento click busqueda
function handleclickSearch(event) {
  event.preventDefault();
  seriessearch = inputSearch.value;
  if (seriessearch !== "") {
    dataApi();
  }
  listResults.innerHTML = "";
}

buttonSearch.addEventListener("click", handleclickSearch);

// funcion que filtra favoritos
function handleAddFavorites(event) {
  const idAnime = parseInt(event.currentTarget.id);
  const findAnime = arraySeries.find(
    (animeSelect) => parseInt(animeSelect.mal_id) === idAnime
  );

  const indexAnimeFav = arrayFavorites.findIndex(
    (animeSelect) => idAnime === parseInt(animeSelect.mal_id)
  );
  if (indexAnimeFav === -1) {
    arrayFavorites.push(findAnime);
    localStorage.setItem("animesFav", JSON.stringify(arrayFavorites));
  }

  renderFavAnime();
}
// funcion que escucha el evento click de cada anime
function listenerAnime() {
  const allAnime = document.querySelectorAll(".js-anime");
  for (const oneAnime of allAnime) {
    oneAnime.addEventListener("click", handleAddFavorites);
  }
}
// funcion que renderiza los resultados de la busqueda
function renderResultAnime() {
  listResults.innerHTML = "";

  inputSearch.value === ""
    ? titleSearch.classList.add("hidden")
    : titleSearch.classList.remove("hidden");

  for (const animes of arraySeries) {
    let imageUrl = animes.images.webp.image_url;
    if (
      imageUrl ===
      "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png"
    ) {
      imageUrl = replacementUrl;
    }

    const indexFavoritosIn = arrayFavorites.findIndex(
      (animeFavorite) => animeFavorite.mal_id === animes.mal_id
    );
    const classFavorites = indexFavoritosIn !== -1 ? "favchange" : "";

    listResults.innerHTML += `<li class =" anime js-anime ${classFavorites}" id="${animes.mal_id}">
       <h5 class ="title_anime">${animes.title}</h5>
      <img src="${imageUrl}" alt="foto portada Anime">
      </li>`;
  }

  listenerAnime();
}
// funcion que renderiza los resultados de lista favoritos
function renderFavAnime() {
  listFavorites.innerHTML = "";

  for (const animes of arrayFavorites) {
    let imageUrl = animes.images.webp.image_url;
    if (
      imageUrl ===
      "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png"
    ) {
      imageUrl = replacementUrl;
    }

    listFavorites.innerHTML += `<li class =" anime js-anime" id="${animes.mal_id}">
         <h5 class ="title_anime">${animes.title}</h5>
          <img src="${imageUrl}" alt="foto portada Anime">
          <button class=" btn__css js-remov">Eliminar</button>
          </li>`;
  }

  listenerButtonRemoveFav();
}
// funcion que borra los favoritos de la lista fav.
function handleDeleteFav(event) {
  const btnClicked = event.target;
  const clickedParent = btnClicked.parentNode;
  const idBtnRemoveFav = clickedParent.id;

  const findremoveId = arrayFavorites.findIndex(
    (favRemove) => parseInt(favRemove.mal_id) === parseInt(idBtnRemoveFav)
  );

  if (findremoveId !== -1) {
    arrayFavorites.splice(findremoveId, 1);
    localStorage.setItem("animesFav", JSON.stringify(arrayFavorites));

    renderFavAnime();
  }
}
// funcion que escucha el evento click de boton removerfav
function listenerButtonRemoveFav() {
  const allBtnRemoveFav = document.querySelectorAll(".js-remov");
  for (const onebtn of allBtnRemoveFav) {
    onebtn.addEventListener("click", handleDeleteFav);
  }
}
// funcion manejadora boton reset
function handleReset(event) {
  event.preventDefault();
  seriessearch = "";
  arraySeries = [];
  arrayFavorites = [];
  listFavorites.innerHTML = "";
  listResults.innerHTML = "";
  inputSearch.value = "";
  titleSearch.classList.add("hidden");
  localStorage.setItem("animesFav", JSON.stringify([]));
}

buttonReset.addEventListener("click", handleReset);

// funcion que guarda favoritos en localStorage
function getDataFavoritesLocal() {
  const favoriteAnimeLocal = JSON.parse(localStorage.getItem("animesFav"));

  if (favoriteAnimeLocal != null) {
    arrayFavorites = favoriteAnimeLocal;
    renderFavAnime();
  } else {
    dataApi();
  }
}

getDataFavoritesLocal();
