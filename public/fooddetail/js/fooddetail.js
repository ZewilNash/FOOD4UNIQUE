window.onload = () => {

  let user = JSON.parse(localStorage.getItem("user"));

    document.querySelector("#fav_nav").setAttribute("href" , `/favourites/${user.user._id}`);

  if (!user) {
    window.location.href = "/loginpage";
  }

  if(user && user.user.role === "admin"){
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
}

// alsolike-container

const foods = [
  {
    "name": "Nasi goreng pedas cabe 5",
    "photo": "./images/food4unique.png",
    "price": 9000,
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
  },


  {
    "name": "Mie Jawa Godhog",
    "photo": "./images/food4unique.png",
    "price": 15000,
    "description": "Proin ultricies sem at turpis elementum commodo"
  },

  {
    "name": "Es Susu Jahe",
    "photo": "./images/food4unique.png",
    "price": 7000,
    "description": "Campuran susu asli dengan jahe disajikan dingin"
  },

  {
    "name": "Teh Panas",
    "photo": "./images/food.jpg",
    "price": 5000,
    "description": "Teh segar disajikan panas, cocok diminum pada cuaca dingin"
  }
]


let alsolike = document.querySelector(".alsolike-container");

// let HTML = "";

// foods.forEach(food => {
//   HTML += `
      
//     `;

//   alsolike.innerHTML = HTML;
// });

document.querySelector("#logout").addEventListener("click" , () => logout());

function logout() {
  localStorage.removeItem('user');
  window.location.href = '/loginpage';
}


document.querySelectorAll("#product-img").forEach(img => {
  img.addEventListener("click" , (e) => {

    e.target.style.border = "4px solid #FFA458";

    let src = e.target.getAttribute("src");

    document.querySelector("#main-product-image").setAttribute("src" , src);

    setTimeout(() => {
      e.target.style.border = "";
    } , 1000)

  })
})

let user = JSON.parse(localStorage.getItem("user"));

document.querySelectorAll("#fav_btn").forEach(b => {
  b.addEventListener("click" , (e) => {
    e.stopPropagation();
    
    let {foodId}  = e.target.dataset;
    let userId = user.user._id;
    
    // console.log(foodId);
    // logic add to vafourite
    let URL = document.URL.split("fooddetail")[0];

    console.log(user.token);
    

  
    axios.patch(URL + `api/v1/products/addToFav/${foodId}/${userId}` , {} ,  {
      headers: {
          Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
      }
  }).then(res => {
      console.log(res);
      const msg_data = res.data.msg;

      document.querySelector(".success").innerText = `${msg_data}`;

      setTimeout(() => {
        document.querySelector(".success").innerText = ``;
      },2000);
      
    }).catch(err => {
      const msg = err.response.data.msg;

      // do something
      document.querySelector(".error").innerText = `${msg}`;

      setTimeout(() => {
        document.querySelector(".error").innerText = ``;
      },2000);
      
      
    });
    
  })
})