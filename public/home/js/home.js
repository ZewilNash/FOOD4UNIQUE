window.onload = () => {
    // get_user_orders
    let user = JSON.parse(localStorage.getItem("user"));


    if (!user) {
        window.location.href = "/loginpage";
    }

    if (user && user.user.role === "admin") {
        window.location.href = "/4unique-admin"
    }

    // track user orders track_orders track
    let URL = document.URL.split("home")[0];
    axios.get(URL + `api/v1/auth/get_user_orders/${user.user._id}`, {
        headers: {
            Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
        }
    }).then(res => {
        let userOrders = res.data.userOrders;
        console.log(userOrders);

        if (userOrders.length > 0) {
            
            document.querySelector("#track_orders").setAttribute("href", `/user_orders/${user.user._id}`);

            document.querySelector("#track_orders").setAttribute("data-lang", `track`);


            document.querySelector("#track_orders").innerText = "Track Your Orders Status"
            document.querySelector(".track").classList.toggle("hide")
        }

        const setLanguage = (language) => {
            document.querySelectorAll("[data-lang]").forEach(element => {
              const translationKey = element.getAttribute("data-lang")
          
              if (element.getAttribute('id') === "food_qty") {
                element.placeholder = translations[language][translationKey]
              } else {
                element.innerText = translations[language][translationKey]
              }
            })
          }
          
          const langParams = localStorage.getItem("lang") || "en"
          setLanguage(langParams)

    }).catch(err => {
        console.log(err);

    })


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

    axios.get(URL + `api/v1/auth/cart/${user.user._id}`, {
        headers: {
            Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
        }
    }).then(res => {
        document.querySelector("#cart_length").innerText = `${res.data.cartLength}`
    }).catch(err => {
        console.log(err);

    })

    const setLanguage = (language) => {
        document.querySelectorAll("[data-lang]").forEach(element => {
            const translationKey = element.getAttribute("data-lang")
            
            if(element.getAttribute('id') === "search-food-text"){
                element.placeholder = translations[language][translationKey]
            }else {
                element.innerText = translations[language][translationKey]
            }
        })
    }

    if(localStorage.getItem("lang")){
        setLanguage(localStorage.getItem("lang"))
    }

}

const categories = [

    {
        name: "EGYPTIAN FOOD",
        image: "./images/categories/egyptian.jpg"
    },


    {
        name: "INDONESIAN FOOD",
        image: "./images/categories/indonisian.jpg"
    },

    {
        name: "EGYINDO FOOD",
        image: "./images/categories/egyindo.jpg"
    },

    {
        name: "VIP FOOD",
        image: "./images/categories/vip.jpg"
    },
    // {
    //     name: "BEST FOOD",
    //     image: "./images/categories/best.jpg"
    // },
    {
        name: "DESSERTS",
        image: "./images/categories/dessert.jpg"
    },

]

let categoryContainer = document.querySelector(".cat-con");

let HTML = "";

categories.forEach(cat => {
    HTML += `
        <a style="text-align:center;font-size:17px" href="/food/${cat.name.toLowerCase()}"class="col-md-4 category mt-5">
            <img style="width:100%;height:350px;object-fit-contain" src="${cat.image}" />
            <p data-lang="${cat.name.split(" ")[0].toLowerCase()}">${cat.name === "BEST FOOD" ? "NEW" : cat.name.split(" ")[0]}</p>
        </a>
    `;

    categoryContainer.innerHTML = HTML;
});

document.querySelector("#logout").addEventListener("click", () => logout());

function logout() {
    localStorage.removeItem('user');
    window.location.href = '/loginpage';
}

document.querySelector("#search-btn").addEventListener("click", (e) => {
    e.preventDefault();
    let text = document.querySelector("#search-food-text").value;

    if (text) {
        let URL = document.URL;
        URL = URL.split("home")[0];

        window.location.href = URL + `findfood/${text.toLowerCase()}`

        console.log(text);

    }

})


// const getNoty = async () => {
// const permission = await Notification.requestPermission();
// console.log(permission); // granted or denied
// new Notification("New message");
// }

// getNoty()

const socket = io();

socket.on('statusUpdated', async function (data) {

    console.log(data);
    
    let user = JSON.parse(localStorage.getItem("user"));
  const notify =  new Notification("New message", {
        tag: "FOOD4UNIQUE",
        body: `YOU HAVE AN ORDER COMPLETED ,  ${data.order_num ? "ORDER NUMBER IS " +  data.order_num : ""}, TRACK YOUR ORDERS CLICK TRACK YOUR ORDER STATUS IN THE WEBSITE MENU`,
        icon: "./images/food4unique.png",
        image: "./images/food4unique.png",
        vibrate: 500,
    });

  

  
});

socket.on('foodadded', async function (data) {
    // let user = JSON.parse(localStorage.getItem("user"));
   const notify =  new Notification("New message", {
        tag: "FOOD4UNIQUE",
        body: `WE ADDED NEW FOOD${data.name ? "FOOD NAME IS " + data.name : ""}PLEASE CHECK IT`,
        icon: "./images/food4unique.png",
        image: "./images/food4unique.png",
        vibrate: 500,
    });

    

   
});




var pusher = new Pusher('17c9f46a0256c402a5c8', { cluster: 'eu' });

// retrieve the socket ID once we're connected
pusher.connection.bind('connected', function () {
    // attach the socket ID to all outgoing Axios requests
    axios.defaults.headers.common['X-Socket-Id'] = pusher.connection.socket_id;
});

// request permission to display notifications, if we don't alreay have it
Notification.requestPermission();
pusher.subscribe('notifications')
    .bind('food_added', function (data) {
        console.log(data.food);
        
        // if we're on the home page, show an "Updated" badge
        
        var notification = new Notification("NEW FOOD ADDED" ,  {
            body: data.food.name + "has been added to our food list. Check it out.",
            icon: "./images/food4unique.png",
          });
        notification.onclick = function (event) {
            window.location.href = `/fooddetail/${data.food._id}`
            event.preventDefault();
            notification.close();
        }
});

pusher.subscribe('notifications')
    .bind('order_status', function (data) {
        console.log(data.order);
        
        // if we're on the home page, show an "Updated" badge
        let user = JSON.parse(localStorage.getItem("user"));
        var notification = new Notification("ONE ORDER IS READY" , {
            body:"Order Number" + data.order.order_num + "is ready for you to come & take. check also your order list.",
            icon: "./images/food4unique.png",
        });
        notification.onclick = function (event) {
            window.location.href = `/user_orders/${user._id}`
            event.preventDefault();
            notification.close();
        }
});

// translation section

const translations = {
    en:{
       search:"Search Food By Name",
       discover:"DISCOVER ALL",
       categories:"CATEGORIES",
       egyptian:"EGYPTIAN",
       indonesian:"INSONESIAN",
       egyindo:"EGYINDO",
       vip:"VIP",
       desserts:"DESSERTS",
       about:"ABOUT",
       contact:"CONTACT",
       track:"TRACK YOUR ORDERS STATUS",
       favourites:"MY FAVOURITES",
       quantity:"quantity"
    }, 

    in:{
        search:"Cari Makanan Berdasarkan Nama",
        discover:"TEMUKAN SEMUA",
        categories:"KATEGORI",
        egyptian:"MESIR",
        indonesian:"INDONESIA",
        egyindo:"MESIR&INDONESIA",
        vip:"VIP",
        desserts:"HIDANGAN PENUTUP",
        about:"TENTANG KAMI",
        // HUBUNGI KAMI
        contact:"HUBUNGI KAMI",
        // MELACAK STATUS PESANAN ANDA
        track:"MELACAK STATUS PESANAN ANDA",
        // FAVORIT SAYA
        favourites:"FAVORIT SAYA",
        quantity:"kuantitas"
    }
}

// load the select images
document.querySelector("#country-select").addEventListener("change" , (e) => {
    setLanguage(e.target.value)
    localStorage.setItem("lang" , e.target.value)
  })

const setLanguage = (language) => {
    document.querySelectorAll("[data-lang]").forEach(element => {
        const translationKey = element.getAttribute("data-lang")
        
        if(element.getAttribute('id') === "search-food-text"){
            element.placeholder = translations[language][translationKey]
        }else {
            element.innerText = translations[language][translationKey]
        }
    })
}

