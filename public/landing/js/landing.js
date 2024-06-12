
window.onload = () => {

  let user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    window.location.href = "/home";
  }

  if (user && user.user.role === "admin") {
    window.location.href = "/4unique-admin"
  }


  document.querySelector(".main").style.display = "none";

  setTimeout(() => {
    document.querySelector(".main").style.display = "block";
    document.querySelector(".loader").style.display = "none";
  }, 4000)
}

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
    land_1: "JOIN US NOW",
    land_2: "DISCOVER & ORDER OUR FOOD",
    land_3: "WE'LL NOT MAKE YOU HUNGRY",
    land_4: `CREATE AN ACCOUNT`,
    land_5: "ONCE YOU CREATE YOUR ACCOUNT YOU CAN ORDER , EXPLORE AND MORE ..",
    land_6: "IF YOU ARE IN A HURRY , LET US AUTO CREATE ACCOUNT FOR YOU",
    land_7: "REGISTER & LOGIN JUST ONE CLICK"
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
    land_1: "BERGABUNGLAH DENGAN KAMI SEKARANG",
    land_2: "TEMUKAN & PESAN MAKANAN KAMI",
    land_3: "KAMI TIDAK AKAN MEMBUAT ANDA LAPAR",
    land_4: `BUAT SEBUAH AKUN`,
    land_5: "SETELAH ANDA MEMBUAT AKUN, ANDA DAPAT MEMESAN, MENJELAJAHI, DAN LEBIH BANYAK..",
    land_6: "JIKA ANDA TERBURU-BURU, BIARKAN KAMI BUAT AKUN OTOMATIS UNTUK ANDA",
    land_7: "DAFTAR & LOGIN HANYA SATU KLIK"
  }
}

// load the select images
document.querySelector("#country-select").addEventListener("change", (e) => {
  setLanguage(e.target.value)
  localStorage.setItem("lang", e.target.value)
})

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


async function ip_local() {

  // localIp
  let url = document.URL;

  url = url.split("landing")[0];

  const data = await fetch(url + `api/v1/auth/localIp`);

  const json_data = await data.json();
 
  
  return json_data.ip;

}


// /api/v1/auth
async function createUser(fullname, email, password) {

  let url = document.URL;

  url = url.split("landing")[0];

  // const api = await fetch('https://api.ipify.org?format=json')

  // const api_res = await api.json();
  // var uuid = new DeviceUUID().get();
  // const ip = new DeviceUUID().get();
  const ip = await ip_local();

  // console.log(ip);


  axios.post(url + "api/v1/auth/signup", { fullname, email, password, ip_address: ip }).then(res => {

    let msg = res.data.msg;
    let token = res.data.token;
    let user = res.data.user;

    let userObj = {
      user: user,
      token: token
    }

    localStorage.setItem("user", JSON.stringify(userObj));

    document.querySelector("#auto_create_account").disabled = true;

    let HTML = msg.includes("User Logged In Successfully") ? `<p class="success-message">${localStorage.getItem("lang") === "in" ? "Pengguna Berhasil Masuk" : msg}</p>` : `<p class="success-message">${localStorage.getItem("lang") === "in" ? "AKUN ANDA TELAH DIBUAT DENGAN SUKSES" : msg}</p>`;

    document.querySelector("#success").innerHTML += HTML;

    setTimeout(() => {
      document.querySelector("#success").innerHTML = "";
      document.querySelector("#auto_create_account").disabled = false;

      window.location.href = "/home";

    }, 3000)



  }).catch(err => {
    console.log(err);

  });





}


document.querySelector("#auto_create_account").addEventListener("click", (e) => {
  createUser("auto", "auto", "auto")
})