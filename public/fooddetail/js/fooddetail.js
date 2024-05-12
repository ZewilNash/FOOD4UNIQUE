window.onload = () => {

  let user = JSON.parse(localStorage.getItem("user"));

  

  if (!user) {
    window.location.href = "/loginpage";
  }

  if(user && user.user.role === "admin"){
    window.location.href = "/4unique-admin"
}

document.querySelector("#my_cart_link").setAttribute("href" , `/cart/${user.user._id}`);

    document.querySelector("#fav_nav").setAttribute("href" , `/favourites/${user.user._id}`);

document.querySelector("#login").style.display = user ? "none" : "block";

document.querySelector("#signup").style.display = user ? "none" : "block";

document.querySelector("#logout").style.display = user ? "block" : "none";

  document.querySelector(".home").style.display = "none";

  setTimeout(() => {
    document.querySelector(".home").style.display = "block";
    document.querySelector(".loader").style.display = "none";
  }, 4000)

  let URL = document.URL.split("fooddetail")[0];
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

const user = JSON.parse(localStorage.getItem("user"));

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

      const myPopup = new Popup({
        id: "my-popup",
        title: "FOOD4UNIQUE",
        content: `${msg_data}`,
            showImmediately: true,
            textColor:"green"
    });
  
  
  
      // document.querySelector(".error").innerText = `Please Provide Your Missing Order Details!!`;
      myPopup.show();
      
    }).catch(err => {
      const msg = err.response.data.msg;

      // do something
      const myPopup = new Popup({
        id: "my-popup",
        title: "FOOD4UNIQUE",
        content: `${msg}`,
            showImmediately: true,
            textColor:"red"
    });
  
  
  
      // document.querySelector(".error").innerText = `Please Provide Your Missing Order Details!!`;
      myPopup.show();
      
    });
    
  })
})

document.querySelectorAll("#add_to_cart_btn").forEach(btn => {
  btn.addEventListener("click" , (e) => {
    // logic
    e.stopPropagation();
    let {foodId,foodName} = e.target.dataset;
    console.log(foodId);
    
    let userId = user.user._id;

    let qty = document.querySelector(`input[data-food-name="${foodName}"]`).value;

    console.log(qty);
    

    if(!qty){
      alert("Please Provide Quantity To Add To Cart");
    }else {
      let URL = document.URL.split("fooddetail")[0];
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


document.querySelectorAll("#food_qty").forEach(btn => {
  btn.addEventListener("input" , (e) => {
    // oninput="this.value = 
  
    console.log(e.target.value);
    
  
    if(Number(e.target.value) === 0){
      const myPopup = new Popup({
        id: "my-popup",
        title: "FOOD4UNIQUE",
        content: `
        ADD NON ZERO & POSITIVE & NOT EMPTY QUANTITY`,
            showImmediately: true,
            textColor:"red"
    });
  
  
  
      // document.querySelector(".error").innerText = `Please Provide Your Missing Order Details!!`;
      myPopup.show();
      e.target.value = ""
    }
  
    if(Number(e.target.value) < 0 || e.target.value.startsWith("-")){
      const myPopup = new Popup({
        id: "my-popup",
        title: "FOOD4UNIQUE",
        content: `
        ADD POSITIVE QUANTITY NUMBER`,
            showImmediately: true,
            textColor:"red"
    });
  
  
  
      // document.querySelector(".error").innerText = `Please Provide Your Missing Order Details!!`;
      myPopup.show();
      e.target.value = ""
    }
  
   
  })
})