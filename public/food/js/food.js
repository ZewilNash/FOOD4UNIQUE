window.onload = () => {

  let user = JSON.parse(localStorage.getItem("user"));

  document.querySelector("#my_cart_link").setAttribute("href" , `/cart/${user.user._id}`);

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

  let URL = document.URL.split("food/")[0];
  axios.get(URL + `api/v1/auth/cart/${user.user._id}` ,  {
      headers: {
          Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
      }
  }).then(res => {
      document.querySelector("#cart_length").innerText = `${res.data.cartLength}`
  }).catch(err => {
      console.log(err);
      
  })
}


const foods = [
  {
    "name": "Nasi goreng pedas cabe 5",
    "photo": "./images/food4unique.png",
    "price": 9000,
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
  },
  {
    "name": "Nasi goreng telur plus",
    "photo": "./images/food4unique.png",
    "price": 10000,
    "description": "Nullam eget euismod nisl. Quisque felis mauris, mollis vit"
  },
  {
    "name": "Nasi goreng jamur",
    "photo": "./images/food4unique.png",
    "price": 13500,
    "description": "Nullam a lacus bibendum quam sollicitudin malesuada"
  },
  {
    "name": "Mie Jawa goreng",
    "photo": "./images/food4unique.png",
    "price": 14000,
    "description": "In diam mi, scelerisque id purus at, sollicitudin sagittis mi"
  },
  {
    "name": "Mie Jawa Godhog",
    "photo": "./images/food4unique.png",
    "price": 15000,
    "description": "Proin ultricies sem at turpis elementum commodo"
  },
  {
    "name": "Es Teh Tarik",
    "photo": "./images/food4unique.png",
    "price": 3000,
    "description": "teh melati campur susu segar disajikan dengan dingin"
  },
  {
    "name": "Es Susu Jahe",
    "photo": "./images/food4unique.png",
    "price": 7000,
    "description": "Campuran susu asli dengan jahe disajikan dingin"
  },
  {
    "name": "Es Jeruk nipis madu",
    "photo": "./images/food4unique.png",
    "price": 6000,
    "description": "Minuman segar berasa asam manis khas jeruk"
  },
  {
    "name": "Teh Panas",
    "photo": "./images/food.jpg",
    "price": 5000,
    "description": "Teh segar disajikan panas, cocok diminum pada cuaca dingin"
  }
]


let foodContainer = document.querySelector(".food-container");

/*
<a href="#" class="col-md-4 mt-5 food-item">
            <img src="${food.photo}" />
            <p>${food.name}</p>
            <span>$${food.price}</span>
            <div class="footer">
            <i class="fa-solid fa-heart"></i>

            <i class="fa-solid fa-plus"></i>

            </div>
        </a>

*/

// let HTML = "";

// foods.forEach(food => {
//   HTML += `
        
//     `;

//   foodContainer.innerHTML = HTML;
// });

document.querySelector("#logout").addEventListener("click" , () => logout());

function logout() {
  localStorage.removeItem('user');
  window.location.href = '/loginpage';
}

const user = JSON.parse(localStorage.getItem("user"));

document.querySelectorAll("#fav_btn").forEach(b => {
  b.addEventListener("click" , (e) => {
    e.stopPropagation();
    
    let {foodId}  = e.target.dataset;
    let userId = user.user._id;
    
    // console.log(foodId);
    // logic add to vafourite
    let URL = document.URL.split("food/")[0];

    console.log(user.token);
    

  
    axios.patch(URL + `api/v1/products/addToFav/${foodId}/${userId}` , {} ,  {
      headers: {
          Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
      }
  }).then(res => {
      console.log(res);
      const msg_data = res.data.msg;

      document.querySelector(".success").innerText = `${msg_data}`;

      e.target.style.color = "red";

        setTimeout(() => {
          e.target.style.color = "#000";
        },2000);

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


document.querySelectorAll("#add_to_cart_btn").forEach(btn => {
  btn.addEventListener("click" , (e) => {
    // logic
    let {foodId,foodName} = e.target.dataset;
    let userId = user.user._id;

    let qty = document.querySelector(`input[data-food-name="${foodName}"]`).value;

    console.log(qty);
    

    if(!qty){
      alert("Please Provide Quantity To Add To Cart");
    }else {
      let URL = document.URL.split("food/")[0];
      // logic of add cart to user
      axios.post(URL + `api/v1/products/cart/${userId}/${foodId}` , {qty:qty} ,  {
        headers: {
            Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
        }
    }).then(res => {
        console.log(res);
        const msg_data = res.data.msg;
  
        document.querySelector(".success").innerText = `${msg_data}`;

        e.target.style.color = "green";

        setTimeout(() => {
          e.target.style.color = "#000";
        },2000);
       
  
        setTimeout(() => {
          document.querySelector(".success").innerText = ``;
        },2000);

        window.location.reload();
        
      }).catch(err => {
        const msg = err.response.data.msg;
  
        // do something
        document.querySelector(".error").innerText = `${msg}`;
  
        setTimeout(() => {
          document.querySelector(".error").innerText = ``;
        },2000);
        
        
      });
    }
    
  })
});