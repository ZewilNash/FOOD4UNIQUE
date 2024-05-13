window.onload = () => {

  const user = JSON.parse(localStorage.getItem("user"));

  
  if (!user) {
    console.log("hello");
    
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

      let URL = document.URL.split("findfood")[0];
      axios.get(URL + `api/v1/auth/cart/${user.user._id}` ,  {
          headers: {
              Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
          }
      }).then(res => {
          document.querySelector("#cart_length").innerText = `${res.data.cartLength}`
      }).catch(err => {
          console.log(err);
          
      })

      // let URL = document.URL.split("findfood")[0];
      axios.get(URL + `api/v1/auth/get_user_orders/${user.user._id}` ,  {
          headers: {
              Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
          }
      }).then(res => {
          let userOrders = res.data.userOrders;
          console.log(userOrders);
  
          if(userOrders.length > 0){
              document.querySelector("#track_orders").setAttribute("href" , `/user_orders/${user.user._id}`);
              document.querySelector("#track_orders").innerText = "Track Your Orders Status"
              document.querySelector(".track").classList.toggle("hide")
          }
          
      }).catch(err => {
          console.log(err);
          
      })
}

let user = JSON.parse(localStorage.getItem("user"));

document.querySelectorAll("#fav_btn").forEach(b => {
  b.addEventListener("click" , (e) => {
    e.stopPropagation();
    
    let {foodId}  = e.target.dataset;
    let userId = user.user._id;
    
    // console.log(foodId);
    // logic add to vafourite
    let URL = document.URL.split("findfood")[0];

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

document.querySelector("#logout").addEventListener("click" , () => logout());

function logout() {
  localStorage.removeItem('user');
  window.location.href = '/loginpage';
}

document.querySelectorAll("#add_to_cart_btn").forEach(btn => {
    btn.addEventListener("click" , (e) => {
      // logic
      let {foodId,foodName} = e.target.dataset;
      console.log(foodId);
      
      let userId = user.user._id;
  
      let qty = document.querySelector(`input[data-food-name="${foodName}"]`).value;
  
      console.log(qty);
      
  
      if(!qty){
        const myPopup = new Popup({
          id: "my-popup",
          title: "FOOD4UNIQUE",
          content: `
          THE MINIMUM TO ADD TO CART IS 1`,
              showImmediately: true,
              textColor:"red"
      });
    
    
    
        // document.querySelector(".error").innerText = `Please Provide Your Missing Order Details!!`;
        myPopup.show();
      }else {
        let URL = document.URL.split("findfood")[0];
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
          THE MINIMUM TO ADD TO CART IS 1`,
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
          THE MINIMUM TO ADD TO CART IS 1`,
              showImmediately: true,
              textColor:"red"
      });
    
    
    
        // document.querySelector(".error").innerText = `Please Provide Your Missing Order Details!!`;
        myPopup.show();
        e.target.value = ""
      }
    
     
    })
  })