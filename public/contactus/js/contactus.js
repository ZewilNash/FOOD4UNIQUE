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

    let URL = document.URL.split("contactus")[0];
    axios.get(URL + `api/v1/auth/cart/${user.user._id}`, {
        headers: {
            Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
        }
    }).then(res => {
        document.querySelector("#cart_length").innerText = `${res.data.cartLength}`
    }).catch(err => {
        console.log(err);

    })

    
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


document.querySelector("#sendReport").addEventListener("click", (e) => {
    let user = JSON.parse(localStorage.getItem("user"));
    e.preventDefault();
    let orderId = document.querySelector("#orderId").value;
    let customerNote = document.querySelector("#customerNote").value;

    // logic for send report /report_us
    let URL = document.URL.split("contactus")[0];
    

    axios.post(URL + `api/v1/auth/report_us` , {orderId:orderId , report:customerNote} , {
      headers: {
        Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
      }
    }).then(res => {
        const msg_data = res.data.msg;

        document.querySelector(".success").innerText = `${msg_data}`;
  
  
        setTimeout(() => {
          document.querySelector(".success").innerText = ``;
        }, 2000);
        
    }).catch(err => {
        const msg = err.response.data.msg;

      // do something
      document.querySelector(".errors").innerText = `${msg}`;

      setTimeout(() => {
        document.querySelector(".errors").innerText = ``;
      }, 2000);
        
    })
    
})