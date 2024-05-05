
window.onload = () => {
    let user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "/loginpage";
    }

    if (user && user.user.role === "user") {
        console.log("hello");

        window.location.href = "/loginpage";
    }
}


document.querySelector("#create-btn").addEventListener("click", (event) => {
    event.preventDefault();
    // create product logic
    createProduct();
})

document.querySelector("#logout").addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "/loginpage";
})

let url_images = [];

const cloud_name = "futuretodosod";
const upload_preset = "uwpmv7sg";


const myWidget = cloudinary.createUploadWidget(
    {
        cloudName: cloud_name,
        uploadPreset: upload_preset,

    },
    (error, result) => {
        if (!error && result && result.event === "success") {
            console.log("Done! Here is the image info: ", result.info);

            url_images.push( result.info.secure_url);                
        }
    }
);


document.querySelector(".upload_widget").addEventListener(
    "click",
    function () {
      myWidget.open();
    },
    false
  );

function createProduct() {
    let user = JSON.parse(localStorage.getItem("user"));
    let name = document.querySelector("#name").value;
    let price = document.querySelector("#price").value;
    let category = document.querySelector("#category").value;
    let available_size = document.querySelector("#available_size").value;
    let description = document.querySelector("#description").value;

    // let images = document.querySelector("#images").files;
    let images = url_images;

    console.log(images);
    
    
    // logic to upload to mongodb

    let url = document.URL.split("4unique-admin")[0];

    axios.post(String(url) + `api/v1/products`, {
        name,
        price,
        category,
        size:available_size.split(","),
        images,
        description
    }, {
        headers: {
            Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
        }
    }

    ).then(res => {
        // success
        let msg = res.data.msg;
        document.querySelector("#create-btn").disabled = true;

        let HTML = `<p class="success-message">${msg}</p>`;

        document.querySelector("#success").innerHTML += HTML;

        setTimeout(() => {
            document.querySelector("#success").innerHTML = "";
            document.querySelector("#create-btn").disabled = false;
            
            window.location.href = "/home";

        } , 3000)

    }).catch(err => {
        let errors = err.response.data.msg.split(",");

        errors.forEach(err => {
            let HTML = `<p class="error-message">${err}</p>`;

            document.querySelector("#errors").innerHTML += HTML;


        });

        setTimeout(() => {
            document.querySelector("#errors").innerHTML = "";
        },3000)
        
    })

}