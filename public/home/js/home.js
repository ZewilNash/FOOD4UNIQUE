window.onload = () => {

    let user = JSON.parse(localStorage.getItem("user"));


    document.querySelector("#fav_nav").setAttribute("href" , `/favourites/${user.user._id}`);

    if (!user) {
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
    }, 4000)
}

const categories = [

    {
        name: "EGYPTIAN FOOD",
        image: "./images/categories/egyptian.jpg"
    },


    {
        name: "INDONISIAN FOOD",
        image: "./images/categories/indonisian.jpg"
    },

    {
        name: "EGYINDO FOOD",
        image: "./images/categories/egyindo.jpg"
    },
    {
        name: "ECONOMICAL FOOD",
        image: "./images/categories/economical.jpg"
    },
    {
        name: "VIP FOOD",
        image: "./images/categories/vip.jpg"
    },
    {
        name: "BEST FOOD",
        image: "./images/categories/best.jpg"
    },
    {
        name: "BESTSALE FOOD",
        image: "./images/categories/most.jpg"
    },

]

let categoryContainer = document.querySelector(".cat-con");

let HTML = "";

categories.forEach(cat => {
    HTML += `
        <a href="/food/${cat.name.toLowerCase()}"class="col-md-4 category mt-5">
            <img style="width:100%;height:350px;object-fit-contain" src="${cat.image}" />
            <p>${cat.name}</p>
        </a>
    `;

    categoryContainer.innerHTML = HTML;
});

document.querySelector("#logout").addEventListener("click" , () => logout());

function logout() {
    localStorage.removeItem('user');
    window.location.href = '/loginpage';
}

document.querySelector("#search-btn").addEventListener("click" , (e) => {
    e.preventDefault();
    let text = document.querySelector("#search-food-text").value;

    if(text) {
        let URL = document.URL;
        URL = URL.split("home")[0];

        window.location.href = URL +   `findfood/${text.toLowerCase()}`

        console.log(text);
        
    }

})

