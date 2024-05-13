window.onload = () => {

 
  

  let user = JSON.parse(localStorage.getItem("user"));

 
  if (!user) {
    window.location.href = "/loginpage";
  }

  if (user && user.user.role === "admin") {
    window.location.href = "/4unique-admin"
  }

  document.querySelector("#my_cart_link").setAttribute("href", `/cart/${user.user._id}`);

  document.querySelector("#fav_nav").setAttribute("href", `/favourites/${user.user._id}`);

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

  // let URL = document.URL.split("cart")[0];
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


document.querySelector("#order_btn").addEventListener("click" , (e) => {
  document.querySelector("#order_page").style.display = "block";
  document.querySelector("#cart_page").style.display = "none";
});

document.querySelector("#back-to-cart").addEventListener("click" , (e) => {
  document.querySelector("#order_page").style.display = "none";
  document.querySelector("#cart_page").style.display = "block";
});

// https://geocode.maps.co/reverse?lat=latitude&lon=longitude&api_key=65b701bc4459c825070634awd0b43ca



document.querySelector("#auto_fill_btn").addEventListener("click" , (e) => {
  e.target.innerText = "WAIT A MOMENT..."
  e.target.disabled = true;


  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      
      axios.get(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=65b701bc4459c825070634awd0b43ca`).then(res => {
        let country = res.data.address.country;
        let state = res.data.address.state;
        let village = res.data.address.village;
        let road = res.data.address.road;
        let postcode = res.data.address.postcode;
        let display_name = res.data.display_name;
        let leisure = res.data.address.leisure;

        setTimeout(() => {
         
          document.querySelector("#order_state").value = state ? state : "";
        document.querySelector("#order_country").value = country ? country : "";
        document.querySelector("#order_zip_code").value = postcode ? postcode : "";
        document.querySelector("#order_address").value = display_name ? display_name : "";
        document.querySelector("#order_road").value = road ? road : "";
        document.querySelector("#order_village").value = village ? village : "";
        document.querySelector("#order_leisure").value = leisure ? leisure : "";
        document.querySelector("#order_email").value = user.user.email;
        document.querySelector("#order_name").value = user.user.fullname;
        e.target.innerText = "Wait 10 minutes to use it again"
        },1500)

        setTimeout(() => {
          e.target.innerText = "Fill Most Of Info Automatically"
          e.target.disabled = false;
        } , 600000)

        
      }).catch(err => {
        const myPopup = new Popup({
          id: "my-popup",
          title: "FOOD4UNIQUE",
          content: `AUTOMATIC SERVICE IS NOT WORKING , TRY AGAIN LATER!`,
              showImmediately: true,
              textColor:"red"
      });
    
    
    
        // document.querySelector(".error").innerText = `Please Provide Your Missing Order Details!!`;
        myPopup.show();
      })

    });
  } else {
    const myPopup = new Popup({
      id: "my-popup",
      title: "FOOD4UNIQUE",
      content: `Geolocation is not supported by this Device.`,
          showImmediately: true,
          textColor:"red"
  });



    // document.querySelector(".error").innerText = `Please Provide Your Missing Order Details!!`;
    myPopup.show();
    
  }
})

 /*

    cart
user
name
email
phone
address
state
country
zip_code
road
village
leisure
status
isPaid

    */

  

function BOOKOrder(user_id , name , email , phone , time , date , isPaid){
  let URL = document.URL.split("cart")[0];

  axios.get(URL + `api/v1/auth/get_cart/${user_id}` , {
    headers: {
      Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
    }
  }).then(res => {
    
    let cart_obj = res.data.cart;
    
   
    let URL = document.URL.split("cart")[0];
 axios.post(URL + `api/v1/auth/book_order` , {cart:cart_obj,user:user_id,name,email,phone, time,date, isPaid} , {
   headers: {
     Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
   }
 }).then(res => {

     // delete_cart
     deleteCart();
     const order_id = res.data.order._id
     // redicrect to success page
     window.location.href = `/book_order_success/${order_id}`
     
 }).catch(err => {
   console.log(err);
 })
  
  }).catch(err => console.log(err)
  )
}



function makeOrder(user_id,name,email,phone,address,zip_code,state,country,road="",village="",leisure="",status , isPaid){

  
  // const user = JSON.parse(localStorage.getItem("user"));
  let URL = document.URL.split("cart")[0];

  axios.get(URL + `api/v1/auth/get_cart/${user_id}` , {
    headers: {
      Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
    }
  }).then(res => {
    
    let cart_obj = res.data.cart;
    
   
    let URL = document.URL.split("cart")[0];
 axios.post(URL + `api/v1/auth/order` , {cart:cart_obj,user:user_id,name,email,phone,address,state,country,zip_code,road,village,leisure,status , isPaid} , {
   headers: {
     Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
   }
 }).then(res => {

     // delete_cart
     deleteCart();
     const order_id = res.data.order._id
     // redicrect to success page
     window.location.href = `/order_success/${order_id}`
     
 }).catch(err => {
   console.log(err);
 })
  
  }).catch(err => console.log(err)
  )

  
}


// payment implementations

// get token
let transaction_token = "";
let amount = document.querySelector("#amount").value

let email = user.user.email;

let first_name = user.user.fullname.split(" ")[0];

let phone = document.querySelector("#order_phone").value

let last_name = user.user.fullname.split(" ")[1];


let URL = document.URL.split("cart")[0];
axios.post(URL + `api/v1/products/order_prepare` , {amount:Number(amount) , first_name,last_name,email,phone} , {
  headers: {
    Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
  }
}).then(res => {
  transaction_token = res.data.token;
  
}).catch(err => {
  console.log(err);
})

var payButton = document.getElementById('pay-button');
payButton.addEventListener('click', function () {
  // Trigger snap popup. @TODO: Replace TRANSACTION_TOKEN_HERE with your transaction token

  let state = document.querySelector("#order_state").value;
    let country = document.querySelector("#order_country").value
    let zip_code =   document.querySelector("#order_zip_code").value
    let address =  document.querySelector("#order_address").value
     let road =   document.querySelector("#order_road").value
     let village =   document.querySelector("#order_village").value 
     let leisure =   document.querySelector("#order_leisure").value
       let email =  user.user.email;
       let name =  user.user.fullname;
       let user_id = user.user._id;
       let phone = document.querySelector("#order_phone").value 

  if(state&&country&&zip_code&&address&&email&&name&&user_id&&phone){
    
  window.snap.pay(`${transaction_token}`, {
    onSuccess: function(result){
      /* You may add your own implementation here */
       /* You may add your own implementation here */
      //  make an order here

    /*

    cart
user
name
email
phone
address
state
country
zip_code
road
village
leisure
status
isPaid

    */

     makeOrder(user.user._id,name,email,phone,address,zip_code,state,country,road,village,leisure,"pending" , true);
    },
    onPending: function(result){
      /* You may add your own implementation here */
      const myPopup = new Popup({
        id: "my-popup",
        title: "FOOD4UNIQUE",
        content: `
       Waiting Your Payment`,
            showImmediately: true,
            textColor:"red"
    });
  
  
  
      // document.querySelector(".error").innerText = `Please Provide Your Missing Order Details!!`;
      myPopup.show();
    },
    onError: function(result){
      /* You may add your own implementation here */
      const myPopup = new Popup({
        id: "my-popup",
        title: "FOOD4UNIQUE",
        content: `
       Payment Failed`,
            showImmediately: true,
            textColor:"red"
    });
  
  
  
      // document.querySelector(".error").innerText = `Please Provide Your Missing Order Details!!`;
      myPopup.show();
    },
    onClose: function(){
      /* You may add your own implementation here */
      const myPopup = new Popup({
        id: "my-popup",
        title: "FOOD4UNIQUE",
        content: `
        you closed the popup without finishing the payment!`,
            showImmediately: true,
            textColor:"red"
    });
  
  
  
      // document.querySelector(".error").innerText = `Please Provide Your Missing Order Details!!`;
      myPopup.show();
      
    }
  })
  }else {

    const myPopup = new Popup({
      id: "my-popup",
      title: "FOOD4UNIQUE",
      content: `
      Please Provide Your Missing Order Details First!!`,
          showImmediately: true,
          textColor:"red"
  });



    // document.querySelector(".error").innerText = `Please Provide Your Missing Order Details!!`;
    myPopup.show();

    setTimeout(() => {
      document.querySelector(".error").innerText = ``;
    }, 2000);
  }

});


 

//  getting cart /get_cart/




/*
cart
user
name
email
phone
address
state
country
zip_code
road
village
status
isPaid

*/

function deleteCart(){
  let user_ob = JSON.parse(localStorage.getItem("user"));
  let URL = document.URL.split("cart")[0];
  axios.delete(URL + `api/v1/auth/delete_cart/${user_ob.user._id}` , {
    headers: {
      Authorization: 'Bearer ' + user_ob.token //the token is a variable which holds the token
    }
  }).then(res => {
      console.log("hello");
      
  }).catch(err => console.log(err))
}


// add auto fill address

// https://alamat.thecloudalert.com/api/cari/index/?keyword=Soreang

/*
"negara": "Indonesia",
      "provinsi": "Jawa Barat",
      "kabkota": "Kabupaten Bandung",
      "kecamatan": "Soreang",
      "desakel": "Bukit Harapan"
*/

document.querySelector("#order_address").addEventListener("input" , (e) => {
  console.log(e.target.value);
  
  let url = `https://alamat.thecloudalert.com/api/cari/index/?keyword=${e.target.value}` 
  axios.get(url).then(res => {
    let data_arr = res.data.result;

    if(data_arr.length > 0){
      document.querySelector("#address").classList.remove("hide");
    }else {
      document.querySelector("#address").classList.add("hide");
    }


    for (let i = 0 ; i < data_arr.length;i++){
      let option = document.createElement("option");
      option.innerText = `${data_arr[i].negara},${data_arr[i].provinsi},${data_arr[i].kabkota},${data_arr[i].kecamatan},
      ${data_arr[i].desakel}`;
      option.value = `${data_arr[i].negara},${data_arr[i].provinsi},${data_arr[i].kabkota},${data_arr[i].kecamatan},
      ${data_arr[i].desakel}`;

      

      document.querySelector("#address").appendChild(option);

      document.querySelector("#address").addEventListener("change" , (e) => {

        document.querySelector("#order_address").value = e.target.value;
        document.querySelector("#order_state").value = e.target.value.split(",")[1];
        document.querySelector("#order_country").value = e.target.value.split(",")[0];;
      })

    }

    

    
  }).catch(err => console.log(err)
  )

})


document.querySelector("#pay-button_book").addEventListener("click" , (e) => {
    e.preventDefault();
    let phone = document.querySelector("#order_phone").value;
    let email =  user.user.email;
    let name =  user.user.fullname;
    let user_id = user.user._id;

    var [h, m] = document.getElementById('book_food_time').value.split(":");

    let date = document.querySelector("#book_food_date").value;
    let time = h >= 12 ? document.getElementById('book_food_time').value +  ' PM' : document.getElementById('book_food_time').value +  ' AM'

    if(!phone){
      
     
      const myPopup = new Popup({
        id: "my-popup",
        title: "FOOD4UNIQUE",
        content: `YOUR PHONE NUMBER FIELD IS REQUIRED!!`,
            showImmediately: true,
            textColor:"red"
    });



  
  
  
      // document.querySelector(".error").innerText = `Please Provide Your Missing Order Details!!`;
      myPopup.show();
    }else{
      window.snap.pay(`${transaction_token}`, {
        onSuccess: function(result){
          /* You may add your own implementation here */
           /* You may add your own implementation here */
          //  make an order here
    
        /*
    
        cart
    user
    name
    email
    phone
    address
    state
    country
    zip_code
    road
    village
    leisure
    status
    isPaid
    
        */
    
         BOOKOrder(user_id,name,email,phone, time,date,true);

        },
        onPending: function(result){
          /* You may add your own implementation here */
          const myPopup = new Popup({
            id: "my-popup",
            title: "FOOD4UNIQUE",
            content: `
           Waiting Your Payment`,
                showImmediately: true,
                textColor:"red"
        });
      
      
      
          // document.querySelector(".error").innerText = `Please Provide Your Missing Order Details!!`;
          myPopup.show();
        },
        onError: function(result){
          /* You may add your own implementation here */
          const myPopup = new Popup({
            id: "my-popup",
            title: "FOOD4UNIQUE",
            content: `
           Payment Failed`,
                showImmediately: true,
                textColor:"red"
        });
      
      
      
          // document.querySelector(".error").innerText = `Please Provide Your Missing Order Details!!`;
          myPopup.show();
        },
        onClose: function(){
          /* You may add your own implementation here */
          const myPopup = new Popup({
            id: "my-popup",
            title: "FOOD4UNIQUE",
            content: `
            you closed the popup without finishing the payment!`,
                showImmediately: true,
                textColor:"red"
        });
      
      
      
          // document.querySelector(".error").innerText = `Please Provide Your Missing Order Details!!`;
          myPopup.show();
          
        }
      })
    }
    


})