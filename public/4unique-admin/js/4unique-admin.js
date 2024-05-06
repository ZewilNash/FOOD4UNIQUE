
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

document.querySelector(".upload_widget_edit").addEventListener(
    "click",
    function () {
      myWidget.open();
    },
    false
  );

//   upload_widget_edit

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


document.querySelector("#show_text").addEventListener("click" , (e) => {
    // contact-us foods
    document.querySelector(".contact-us").classList.toggle("hide");
    document.querySelector(".foods").classList.toggle("hide");

    document.querySelector("#show_text").innerText = document.querySelector("#show_text").innerText === "Show All Food" ? "Show Create Product" : "Show All Food"
})



document.querySelectorAll("#delete_food").forEach(btn => {
    btn.addEventListener("click" , (e) => {
        const {foodId} = e.target.dataset;
   

         // console.log(foodId);
    // logic add to vafourite
    let URL = document.URL.split("4unique-admin")[0];

    const user = JSON.parse(localStorage.getItem("user"));

    console.log(user.token);
    

    axios.delete(URL + `api/v1/products/delete/${foodId}` ,  {
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

function getSingleFood(id){
    let URL = document.URL.split("4unique-admin")[0];

    

    const user = JSON.parse(localStorage.getItem("user"));

    axios.patch(URL + `api/v1/products/${id}`,{} ,  {
        headers: {
            Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
        }
    }).then(res => {
        console.log(res);
       let data = res.data.food;

       document.querySelector("#id_edit").value = data._id;
       document.querySelector("#name_edit").value = data.name;
       document.querySelector("#price_edit").value = data.price;
       document.querySelector("#category_edit").value = data.category;
       document.querySelector("#available_size_edit").value = data.size.join(",");
       document.querySelector("#description_edit").value = data.description;

        
        // add the edit fields value
        
        
      }).catch(err => {
        const msg = err.response.data.msg;
  
        // do something
        document.querySelector(".error").innerText = `${msg}`;
  
        setTimeout(() => {
          document.querySelector(".error").innerText = ``;
        },2000);
        
        
      });

    
    
}

document.querySelectorAll("#update_link").forEach(btn => {
    btn.addEventListener("click" , (e) => {

        let {foodId} = e.target.dataset;
    
        let food = getSingleFood(foodId);
    
        
        // edit not-edit
        document.querySelector(".edit").classList.toggle("hide");
        document.querySelector(".not-edit").classList.toggle("hide");
    })
})

document.querySelector("#show_text_edit").addEventListener("click" , (e) => {
    // edit not-edit
    document.querySelector(".edit").classList.toggle("hide");
    document.querySelector(".not-edit").classList.toggle("hide");
})


function updateProduct() {
    let user = JSON.parse(localStorage.getItem("user"));
    let name = document.querySelector("#name_edit").value;
    let price = document.querySelector("#price_edit").value;
    let category = document.querySelector("#category_edit").value;
    let available_size = document.querySelector("#available_size_edit").value;
    let description = document.querySelector("#description_edit").value;

    let id_edit = document.querySelector("#id_edit").value;

    // let images = document.querySelector("#images").files;
    let images = url_images;

    console.log(images , name , price , description , category , available_size);
    
    
    // logic to upload to mongodb

    let url = document.URL.split("4unique-admin")[0];

    axios.put(String(url) + `api/v1/products/${id_edit}`, {
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
        console.log(res);
        
        // success
        let msg = res.data.msg;
        document.querySelector("#create-btn-edit").disabled = true;

        let HTML = `<p class="success-message">${msg}</p>`;

        document.querySelector(".success").innerHTML += HTML;

        setTimeout(() => {
            document.querySelector(".success").innerHTML = "";
            document.querySelector("#create-btn").disabled = false;
            
            // window.location.href = "/home";

        } , 3000)

    }).catch(err => {
        console.log(err);
        
        let errors = err.response.data.msg.split(",");

        errors.forEach(err => {
            let HTML = `<p class="error-message">${err}</p>`;

            document.querySelector(".errors").innerHTML += HTML;


        });

        setTimeout(() => {
            document.querySelector(".errors").innerHTML = "";
        },3000)
        
    })

}

document.querySelector("#create-btn_edit").addEventListener("click" , (e) => {
    e.preventDefault();
    updateProduct();
    
    
})