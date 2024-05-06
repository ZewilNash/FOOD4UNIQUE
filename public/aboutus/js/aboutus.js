window.onload = () => {

    let user = JSON.parse(localStorage.getItem("user"));

    document.querySelector("#my_cart_link").setAttribute("href" , `/cart/${user.user._id}`);

    // nav sett

    document.querySelector("#fav_nav").setAttribute("href" , `/favourites/${user.user._id}`);

    if(!user){
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
    } , 4000)

    let URL = document.URL.split("aboutus")[0];
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

document.querySelector("#logout").addEventListener("click" , () => logout());

function logout() {
    localStorage.removeItem('user');
    window.location.href = '/loginpage';
}


