window.onload = () => {

  let user = JSON.parse(localStorage.getItem("user"));

  document.querySelector("#my_cart_link").setAttribute("href", `/cart/${user.user._id}`);

  document.querySelector("#fav_nav").setAttribute("href", `/favourites/${user.user._id}`);

  if (!user) {
    window.location.href = "/loginpage";
  }

  if (user && user.user.role === "admin") {
    window.location.href = "/4unique-admin"
  }


  document.querySelector("#login").style.display = user ? "none" : "block";

  document.querySelector("#signup").style.display = user ? "none" : "block";

  document.querySelector("#logout").style.display = user ? "block" : "none";

  document.querySelector(".home").style.display = "none";

  setTimeout(() => {
    document.querySelector(".home").style.display = "block";
    document.querySelector(".loader").style.display = "none";
  }, 4000)

  let URL = document.URL.split("cart")[0];
  axios.get(URL + `api/v1/auth/cart/${user.user._id}`, {
    headers: {
      Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
    }
  }).then(res => {
    document.querySelector("#cart_length").innerText = `${res.data.cartLength}`
  }).catch(err => {
    console.log(err);

  })
}





document.querySelector("#logout").addEventListener("click", () => logout());

function logout() {
  localStorage.removeItem('user');
  window.location.href = '/loginpage';
}

const user = JSON.parse(localStorage.getItem("user"));
document.querySelectorAll("#remove_item").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const userId = user.user._id;
    const { foodId } = e.target.dataset;

    let URL = document.URL.split("cart")[0];
    axios.delete(URL + `api/v1/auth/cart/remove/${userId}/${foodId}`, {
      headers: {
        Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
      }
    }).then(res => {

      const msg_data = res.data.msg;

      document.querySelector(".success").innerText = `${msg_data}`;


      setTimeout(() => {
        document.querySelector(".success").innerText = ``;
      }, 2000);

      window.location.reload();

    }).catch(err => {
      const msg = err.response.data.msg;

      // do something
      document.querySelector(".error").innerText = `${msg}`;

      setTimeout(() => {
        document.querySelector(".error").innerText = ``;
      }, 2000);

    })

  })
})

// const user = JSON.parse(localStorage.getItem("user"));
document.querySelectorAll("#update_qty_container").forEach(elem => {

  let btn = elem.querySelector("#update_item");

  btn.addEventListener("click", (e) => {
    let qty = elem.querySelector("#update_qty").value;

   
    if (!qty) {
      alert("Choose Quantity To Update With!");
    } else {
      const userId = user.user._id;
      const { foodId } = e.target.dataset;
      // update the quantity logic
      let URL = document.URL.split("cart")[0];
    axios.patch(URL + `api/v1/auth/cart/update_qty/${userId}/${foodId}` , {qty:qty} , {
      headers: {
        Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
      }
    }).then(res => {

      const msg_data = res.data.msg;

      document.querySelector(".success").innerText = `${msg_data}`;


      setTimeout(() => {
        document.querySelector(".success").innerText = ``;
      }, 2000);

      window.location.reload();

    }).catch(err => {
      const msg = err.response.data.msg;

      // do something
      document.querySelector(".error").innerText = `${msg}`;

      setTimeout(() => {
        document.querySelector(".error").innerText = ``;
      }, 2000);

    })
    }
  })

})