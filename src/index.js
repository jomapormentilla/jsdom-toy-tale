let addToy = false;
const url = "http://localhost:3000/toys"

const toyCollection = document.getElementById("toy-collection")
const form = document.querySelector(".add-toy-form")

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetch(url)
    .then(response => response.json())
    .then(handleData)

  function handleData(data) {
    for( const keys of data ){
      div = document.createElement("div")
      div.dataset["id"] = keys["id"]
      div.classList.add("card")
      renderCard(div, keys)
      toyCollection.append(div)
      div.addEventListener("click", handleCardClick)
    }
  }
});

function renderCard(div, keys) {
  div.innerHTML = `
    <h2>${ keys["name"] }</h2>
    <img src=${ keys["image"] } class="toy-avatar" />
    <p>${ keys["likes"] } Likes </p>
    <button class="like-btn">Like <3</button>
  `
}

form.addEventListener("submit", handleSubmit)

function handleSubmit(e) {
  e.preventDefault()

  const toyInfo = {
    name: e.target["name"].value,
    image: e.target["image"].value,
    likes: 0
  }

  const configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(toyInfo)
  }

  fetch(url, configObj)
    .then(response => response.json())
    .then(addData)

  function addData(data){
    div = document.createElement("div")
    div.id = `toy-${ data["id"] }`
    div.classList.add("card")
    renderCard(div, data)
    toyCollection.append(div)
  }
}

function handleCardClick(e) {
  const likes = e.target.parentElement.querySelector("p")
  const newLikes = parseInt(likes.innerText.split(" ")[0], 10) + 1

  configObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      likes: newLikes
    })
  }

  if ( e.target.innerText === "Like <3") {
    likes.innerText = `${ newLikes } Likes`
    let id = parseInt(e.target.parentElement.dataset["id"], 10)

    fetch(`http://localhost:3000/toys/${ id }`, configObj)
      .then(response => response.json())
      .then(data => { console.log(data) })
  }
}