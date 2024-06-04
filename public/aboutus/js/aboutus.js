window.onload = () => {

    let user = JSON.parse(localStorage.getItem("user"));



    if (!user) {
        window.location.href = "/loginpage";
    }

    if (user && user.user.role === "admin") {
        window.location.href = "/4unique-admin"
    }

    document.querySelector("#my_cart_link").setAttribute("href", `/cart/${user.user._id}`);

    // nav sett

    document.querySelector("#fav_nav").setAttribute("href", `/favourites/${user.user._id}`);

    document.querySelector("#login").style.display = user ? "none" : "block";

    document.querySelector("#signup").style.display = user ? "none" : "block";

    document.querySelector("#logout").style.display = user ? "block" : "none";

    document.querySelector(".home").style.display = "none";

    setTimeout(() => {
        document.querySelector(".home").style.display = "block";
        document.querySelector(".loader").style.display = "none";
    }, 4000)

    let URL = document.URL.split("aboutus")[0];
    axios.get(URL + `api/v1/auth/cart/${user.user._id}`, {
        headers: {
            Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
        }
    }).then(res => {
        document.querySelector("#cart_length").innerText = `${res.data.cartLength}`
    }).catch(err => {
        console.log(err);

    })


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
}

document.querySelector("#logout").addEventListener("click", () => logout());

function logout() {
    localStorage.removeItem('user');
    window.location.href = '/loginpage';
}



// language setup
const translations = {
    en: {
        search: "Search Food By Name",
        discover: "DISCOVER ALL",
        categories: "CATEGORIES",
        egyptian: "EGYPTIAN",
        indonesian: "INDONESIAN",
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
        brand: "FOOD4UNIQUE",
        about_1: "WHERE TWO CALTURES MEETS IN ONE PLACE",
        about_2: ",, FOOD IS SYMBOLIC OF LOVE WHEN WORDS ARE INADEQUATE ,,",
        brand_quote: "~FOOD4UNIQUE",
        about_3: "WHO WE ARE?",
        about_4: `WE'RE A COUPLE FROM DIFFRENT CULTURES (AN INDONISIAN WIFE & AN EGYPTIAN HUSBAND) , 
      WE SHARE THE SAME LOVE OF FOOD , SO WE DECIDED TO SHARE THAT WITH YOU`,
        about_5: "OUR MAIN IDEA?",
        about_6: `TO PRESENT OUR CULTURES INTO FOOD THAT MIX THE TASTE OF THE INDONISIAN FOOD AND THE EGYPTIAN ONE IN ONE
      PLACE.`
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
        brand: "FOOD4UNIQUE",
        about_1: "DIMANA DUA KALTUR BERTEMU DALAM SATU TEMPAT",
        about_2: ",, MAKANAN ADALAH SIMBOLIK CINTA KETIKA KATA TIDAK MAMPU,,",
        brand_quote: "~FOOD4UNIQUE",
        about_3: "SIAPA KITA?",
        about_4: `KAMI PASANGAN DARI BUDAYA YANG BERBEDA (ISTRI INDONISIAN DAN SUAMI MESIR), KAMI BERBAGI CINTA MAKANAN YANG SAMA, JADI KAMI MEMUTUSKAN UNTUK BERBAGI DENGAN ANDA`,
        about_5: "IDE UTAMA KAMI?",
        about_6: `
MENGHADIRKAN BUDAYA KITA DALAM MAKANAN YANG MEMPERCAMPURKAN RASA MAKANAN INDONESIA DAN MESIR SATU DALAM SATU
TEMPAT.
      `
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