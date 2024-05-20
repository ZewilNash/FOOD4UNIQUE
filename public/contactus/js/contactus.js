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

            document.querySelector("#track_orders").setAttribute("data-lang" , `track`);

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
        
        window.location.reload()

    }).catch(err => {
        const msg = err.response.data.msg;

      // do something
      document.querySelector(".errors").innerText = `${msg}`;

      setTimeout(() => {
        document.querySelector(".errors").innerText = ``;
      }, 2000);
        
    })
    
})

// language setup
const translations = {
    en: {
      search: "Search Food By Name",
      discover: "DISCOVER ALL",
      categories: "CATEGORIES",
      egyptian: "EGYPTIAN",
      indonesian: "INSONESIAN",
      egyindo: "EGYINDO",
      vip: "VIP",
      desserts: "DESSERTS",
      about: "ABOUT",
      contact: "CONTACT",
      track: "TRACK YOUR ORDERS STATUS",
      favourites: "MY FAVOURITES",
      quantity: "quantity",
      alsoLike: "YOU MAY ALSO LIKE",
      reviewTile: "SOME OF OUR CUSTOMERS REVIEWS",
      contact_1:"ORDER ID",
      contact_2:"HOW WE CAN HELP YOU?",
      contact_3:"Please provide all the information about your issue.",
      contact_4:"Whatsapp us",
      contact_5:"Before You Whatsapp us please keep your order id,we will ask you about before you apply your report",
      contact_6:"SUBMIT"
    },
  
    in: {
      search: "Cari Makanan Berdasarkan Nama",
      discover: "TEMUKAN SEMUA",
      categories: "KATEGORI",
      egyptian: "MESIR",
      indonesian: "INDONESIA",
      egyindo: "MESIR&INDONESIA",
      vip: "VIP",
      desserts: "HIDANGAN PENUTUP",
      about: "TENTANG KAMI",
      // HUBUNGI KAMI
      contact: "HUBUNGI KAMI",
      // MELACAK STATUS PESANAN ANDA
      track: "MELACAK STATUS PESANAN ANDA",
      // FAVORIT SAYA
      favourites: "FAVORIT SAYA",
      quantity: "kuantitas",
      alsoLike: "ANDA MUNGKIN JUGA SUKA",
      reviewTile: "BEBERAPA ULASAN PELANGGAN",
      contact_1:"ID PEMESANAN",
      contact_2:"BAGAIMANA KAMI DAPAT MEMBANTU ANDA?",
      contact_3:"Harap berikan semua informasi tentang masalah Anda.",
      contact_4:"Whatsapp kami",
      contact_5:"Sebelum Anda Whatsapp kami, harap simpan id pesanan Anda, kami akan menanyakannya kepada Anda sebelum Anda menerapkan laporan Anda",
      contact_6:"KIRIM"
    }
  }
  
  // load the select images
  
  
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