let userInp = document.querySelector("#user-inp");
let passInp = document.querySelector("#pass-inp");
let uniqeInp = document.querySelector("#uniqe-inp");
let adminInp = document.querySelector("#admin-inp");
let btnInp = document.querySelector(".btn-inp");

function initStorage() {
  if (!localStorage.getItem("user-data")) {
    localStorage.setItem("user-data", "[]");
  }
}
initStorage();

function setLocalToStorage(users) {
  localStorage.setItem("user-data", JSON.stringify(users));
}
function getLocalFromStorage() {
  let users = JSON.parse(localStorage.getItem("user-data"));
  return users;
}

function createUser(e) {
  // e.preventDefalut();
  let users = getLocalFromStorage();
  if (
    passInp.value == uniqeInp.value &&
    userInp.value !== "" &&
    passInp.value !== "" &&
    uniqeInp !== ""
  ) {
    let userObj = {
      id: Date.now(),
      username: userInp.value,
      password: passInp.value,
      admin: adminInp.value,
      isAdmin: false,
    };
    if (adminInp.value == "ok") {
      userObj.isAdmin = true;
    }
    if (getLocalFromStorage().some((item) => item.username == userInp.value)) {
      return alert("User already exsist!");
    }
    users.push(userObj);
    setLocalToStorage(users);
  } else {
    let conf = confirm("Passwords do not match");
    return conf;
  }

  userInp.value = "";
  passInp.value = "";
  uniqeInp.value = "";
}

btnInp.addEventListener("click", createUser);
let userProduct = document.querySelector("#product-user-input");
let passProduct = document.querySelector("#product-pass-input");

let imgProduct = document.querySelector("#url-product");
let titleProduct = document.querySelector("#title-product");
let priceProduct = document.querySelector("#price-product");
let btnProduct = document.querySelector(".add-product-btn");

function createProduct() {
  if (
    getLocalFromStorage().some(
      (item) => item.username == userProduct.value && item.isAdmin == true
    )
  ) {
    let productObj = {
      id: Date.now(),
      url: imgProduct.value,
      title: titleProduct.value,
      price: priceProduct.value,
      author: userProduct.value,
    };
    fetch("http://localhost:8000/product", {
      method: "POST",
      body: JSON.stringify(productObj),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    imgProduct.value = "";
    titleProduct.value = "";
    priceProduct.value = "";
    userProduct.value = "";
    passProduct.value = "";

    let btnClose = document.querySelector(".btn-close");
    btnClose.click();
  } else {
    return alert("This User is not defined");
  }

  render();
}
btnProduct.addEventListener("click", createProduct);
let readPost = document.querySelector(".readPost");
readPost.addEventListener("click", readProducts);
document.addEventListener("DOMContentLoaded", readProducts);

function render() {
  let res = fetch("http://localhost:8000/product");
  res
    .then((result) => result.json())
    .then((data) => {
      list.innerHTML = "";
      data.forEach((item) => {
        list.innerHTML += `
        <div class="card" width:"18rem" id="${item.id}";">
          <img src="${item.url}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text">Price: ${item.price}</p>
            <p class="card-text">Author: ${item.author}</p>
            <button id="update-btn">Update</button>
            <button id="delete-btn">Delete</button>
          </div>
        </div>
        `;
      });
      addUpdEvent();
      addDeleteEvent();
    });
}

let list = document.querySelector("#card-content");
function readProducts() {
  let res = fetch("http://localhost:8000/product");
  res
    .then((result) => result.json())
    .then((data) => {
      list.innerHTML = "";
      data.forEach((item) => {
        list.innerHTML += `
        <div class="card" width:"18rem" id="${item.id}";">
          <img src="${item.url}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text">Price: ${item.price}</p>
            <p class="card-text">Author: ${item.author}</p>
            <button id="update-btn">Update</button>
            <button id="delete-btn">Delete</button>
          </div>
        </div>
        `;
      });
      addUpdEvent();
      addDeleteEvent();
    });
}

// ubdate

let saveBtn = document.querySelector(".save-product");
function addUpdEvent() {
  let updBtns = document.querySelectorAll("#update-btn");
  console.log(updBtns);
  updBtns.forEach((item) => item.addEventListener("click", updateProduct));
}
function updateProduct(e) {
  let productId = e.target.parentNode.parentNode.id;
  console.log(productId);
  let res = fetch("http://localhost:8000/product");
  res
    .then((result) => result.json())
    .then((data) => {
      list.innerHTML = "";
      let productObj = data.find((item) => item.id == productId);

      imgProduct.value = productObj.url;
      titleProduct.value = productObj.title;
      priceProduct.value = productObj.price;
    });

  saveBtn.setAttribute("id", productId);
}
function saveProducts() {
  let productID = saveBtn.id;
  console.log(productID);
  fetch(`http://localhost:8000/product/${productID}`, {
    method: "PATCH",
    body: JSON.stringify({
      url: imgProduct.value,
      title: titleProduct.value,
      price: priceProduct.value,
    }),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  saveBtn.removeAttribute("id");
  imgProduct.value = "";
  titleProduct.value = "";
  priceProduct.value = "";
}
saveBtn.addEventListener("click", saveProducts);

// delete
function addDeleteEvent() {
  let delBtns = document.querySelectorAll("#delete-btn");
  console.log(delBtns);
  delBtns.forEach((item) => item.addEventListener("click", deleteProduct));
}
function deleteProduct(e) {
  let productID = e.target.parentNode.parentNode.id;
  fetch(`http://localhost:8000/product/${productID}`, {
    method: "DELETE",
  });
  render();
}

// delete
// function getProduct() {
//   list.innerHTML = "";
//   let productID = +prompt("Enter ID");
//   let res = fetch(`http://localhost:8000/products/${productID}`);
//   res
//     .then((result) => result.json())
//     .then((data) => {
//       list.innerHTML += `<li style="border-bottom: 2px solid black; width="20%"  >
//       <p>ID: ${data.id}</p>
//       <p>Title:${data.title}</p>
//       <p>Price:${data.price}$</p><li>`;
//     });
// }
