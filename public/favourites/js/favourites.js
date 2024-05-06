window.onload = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    document.querySelector("#my_cart_link").setAttribute("href" , `/cart/${user.user._id}`);

    document.querySelector("#fav_nav").setAttribute("href", `/favourites/${user.user._id}`);


    document.querySelector(".home").style.display = "none";

    setTimeout(() => {
        document.querySelector(".home").style.display = "block";
        document.querySelector(".loader").style.display = "none";
    }, 4000)

    document.querySelector("#login").style.display = user ? "none" : "block";

    document.querySelector("#signup").style.display = user ? "none" : "block";

    document.querySelector("#logout").style.display = user ? "block" : "none";

    let URL = document.URL.split("favourites")[0];
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

document.querySelector("#logout").addEventListener("click", () => logout());

function logout() {
    localStorage.removeItem('user');
    window.location.href = '/loginpage';
}

const user = JSON.parse(localStorage.getItem("user"));


document.querySelectorAll("#del_btn").forEach(btn => {
    btn.addEventListener("click" , (e) => {
        const {foodId} = e.target.dataset;

        let userId = user.user._id;
    
    // console.log(foodId);
    // logic add to vafourite
    let URL = document.URL.split("favourites")[0];

    console.log(user.token);
    

  
    axios.patch(URL + `api/v1/products/removeFromFav/${foodId}/${userId}` , {} ,  {
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

      setTimeout(() => {
        window.location.reload();
      },1000);
      
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
        let URL = document.URL.split("favourites")[0];
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