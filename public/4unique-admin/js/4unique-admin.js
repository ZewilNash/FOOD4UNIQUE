
window.onload = () => {
    let user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "/loginpage";
    }

    if (user && user.user.role === "user") {
        document.querySelector("#secure").style.display = "none";

        window.location.href = "/notfound";
    }

    if (user && user.user.role === "admin") {
        document.querySelector("#secure").style.display = "block";
    }
}

document.querySelector("#secure").style.display = "none";


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

            url_images.push(result.info.secure_url);
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
        size: available_size.split(","),
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

        }, 3000)

    }).catch(err => {
        let errors = err.response.data.msg.split(",");

        errors.forEach(err => {
            let HTML = `<p class="error-message">${err}</p>`;

            document.querySelector("#errors").innerHTML += HTML;


        });

        setTimeout(() => {
            document.querySelector("#errors").innerHTML = "";
        }, 3000)

    })

}


document.querySelector("#show_text").addEventListener("click", (e) => {
    // contact-us foods
    document.querySelector(".contact-us").classList.toggle("hide");
    document.querySelector(".foods").classList.toggle("hide");

    document.querySelector("#show_text").innerText = document.querySelector("#show_text").innerText === "Show All Food" ? "Show Create Product" : "Show All Food"
})



document.querySelectorAll("#delete_food").forEach(btn => {
    btn.addEventListener("click", (e) => {
        const { foodId } = e.target.dataset;


        // console.log(foodId);
        // logic add to vafourite
        let URL = document.URL.split("4unique-admin")[0];

        const user = JSON.parse(localStorage.getItem("user"));

        console.log(user.token);


        axios.delete(URL + `api/v1/products/delete/${foodId}`, {
            headers: {
                Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
            }
        }).then(res => {
            console.log(res);
            const msg_data = res.data.msg;

            document.querySelector(".success").innerText = `${msg_data}`;

            setTimeout(() => {
                document.querySelector(".success").innerText = ``;
            }, 2000);

            setTimeout(() => {
                window.location.reload();
            }, 1000);

        }).catch(err => {
            const msg = err.response.data.msg;

            // do something
            document.querySelector(".error").innerText = `${msg}`;

            setTimeout(() => {
                document.querySelector(".error").innerText = ``;
            }, 2000);


        });

    })
})

function getSingleFood(id) {
    let URL = document.URL.split("4unique-admin")[0];



    const user = JSON.parse(localStorage.getItem("user"));

    axios.patch(URL + `api/v1/products/${id}`, {}, {
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
        }, 2000);


    });



}

document.querySelectorAll("#update_link").forEach(btn => {
    btn.addEventListener("click", (e) => {

        let { foodId } = e.target.dataset;

        let food = getSingleFood(foodId);


        // edit not-edit
        document.querySelector(".edit").classList.toggle("hide");
        document.querySelector(".not-edit").classList.toggle("hide");
    })
})

document.querySelector("#show_text_edit").addEventListener("click", (e) => {
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

    console.log(images, name, price, description, category, available_size);


    // logic to upload to mongodb

    let url = document.URL.split("4unique-admin")[0];

    axios.put(String(url) + `api/v1/products/${id_edit}`, {
        name,
        price,
        category,
        size: available_size.split(","),
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

        }, 3000)

    }).catch(err => {
        console.log(err);

        let errors = err.response.data.msg.split(",");

        errors.forEach(err => {
            let HTML = `<p class="error-message">${err}</p>`;

            document.querySelector(".errors").innerHTML += HTML;


        });

        setTimeout(() => {
            document.querySelector(".errors").innerHTML = "";
        }, 3000)

    })

}

document.querySelector("#create-btn_edit").addEventListener("click", (e) => {
    e.preventDefault();
    updateProduct();


})





document.querySelector("#order_id_text").addEventListener("input", (e) => {
    let text = e.target.value;
    let URL = document.URL.split("4unique-admin")[0];


    const user = JSON.parse(localStorage.getItem("user"));

    if (!text) {
        alert("enter id")
    }

    axios.post(URL + 'api/v1/auth/get_order', { text }, {
        headers: {
            Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
        }
    }).then(res => {
        console.log(res);
        document.querySelector("#con").style.display = "none";
        const order = res.data.order;

        document.querySelector("#order_container_search").innerHTML = `
        <p style="text-align: center;">ORDER ID: ${  order._id}</p>

        <p style="text-align: center;">Made By : ${  order.name}</p>
        <p style="text-align: center;">Order Owner Email : ${  order.email}</p>
        <p style="text-align: center;">Order Owner phone : ${  order.phone}</p>
        <p style="text-align: center;">Order Owner address : ${  order.address}</p>

        <div style="font-size: 22px;" class="d-flex gap-3 mt-3">
          <span style="font-size:15px;text-align: center;">owner state: ${  order.state}</span >
          <span style="font-size:15px;text-align: center;">owner country: ${  order.country}</span>
          <span style="font-size:15px;text-align: center;">owner village: ${  order.village}</span>
          <span style="font-size:15px;text-align: center;">owner leisure: ${  order.leisure}</span>
        </div>

        <div style="font-size: 18px;" class="d-flex gap-3 mt-3">
          <span>order Owner Zip Code: ${  order.zip_code}</span>
          <span>order status: ${  order.status}</span>
          <span>order isPaid: ${  order.isPaid}</span>
          
        </div>

        <p style="text-align: center;">Order Date : ${  order.createdAt}</p>

        <div style="font-size: 20px;" class="d-flex gap-3 mt-3">
          <a data-order-id="${ order._id}" id="order_show_more" href="#" style="color:green">Show More</a>
          <a data-order-id="${ order._id}"  href="#" id="delete_order" style="color:red;">Delete Order</a>
          <a data-order-id="${ order._id}" id="edit_order_btn" href="#">Edit Order</a>
          
        </div>

        `
        document.querySelectorAll("#edit_order_btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                document.querySelector("#span_order_id").innerText = e.target.dataset.orderId;

                document.querySelector("#edit_order").classList.toggle("hide");

                document.querySelector("#edit_order").style.display = "block";

                document.querySelector("#order_page").classList.add("hide");

            })
        })

        //         document.querySelectorAll(".booked_order_show").forEach(btn => {

        //             console.log(btn);


        //             btn.addEventListener("click", (e) => {
        //                 // document.querySelector(".not-edit").classList.toggle("hide");
        //                 e.preventDefault();
        //                 console.log("hi");
        //                 let URL = document.URL.split("4unique-admin")[0];



        //                 const user = JSON.parse(localStorage.getItem("user"));

        //                 let order_id = e.target.dataset.orderId;
        // // get_booked_order
        //                 axios.get(URL + `api/v1/auth/get_booked_order/${order_id}`, {
        //                     headers: {
        //                         Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
        //                     }
        //                 }).then(res => {

        //                     document.querySelector("#booked_order_item").classList.toggle("hide");
        //                     document.querySelector("#booked_order_page").classList.add("hide");

        //                     let order = res.data.order;
        //                     let total = [];
        //                     order[0].cart.forEach(c => {




        //                         total.push(Number(c.food.price) * Number(c.qty))

        //                         console.log(total);


        //                         let total_order = total.reduce((a, b) => a + b);

        //                         document.querySelector("#total_order_price").innerText = total_order;

        //                         let HTML = `
        //                         <div style="display-flex;flex-direction:column;gap-3;justify-content-center-align-items-center" class="col-md-12 mt-5">
        //                             <img style="width:100%;height:350px;object-fit:contain" src="${c.food.images[0]}" />
        //                             <p>Quantity: ${c.qty}</p>
        //                             <p>Food Name: ${c.food.name}</p>
        //                             <p>Food price: ${c.food.price}</p>
        //                             <p>Food Total Price: ${Number(c.food.price) * Number(c.qty)}</p>
        //                         </div>
        //                        `

        //                         document.querySelector("#booked_order_item").querySelector(".row").innerHTML += HTML



        //                     })

        //                     //    document.querySelector("#go_back_orders").addEventListener("click" , (e) => {


        //                     //     document.querySelector("#order_item").classList.add("hide");
        //                     //     document.querySelector("#order_page").classList.toggle("hide");


        //                     // })



        //                 }).catch(err => {
        //                     console.log(err);

        //                 })


        //             })
        //         })

        document.querySelectorAll("#order_show_more").forEach(btn => {
            btn.addEventListener("click", (e) => {
                // document.querySelector(".not-edit").classList.toggle("hide");

                let URL = document.URL.split("4unique-admin")[0];



                const user = JSON.parse(localStorage.getItem("user"));

                let order_id = e.target.dataset.orderId;

                axios.get(URL + `api/v1/auth/get_order/${order_id}`, {
                    headers: {
                        Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
                    }
                }).then(res => {

                    document.querySelector("#order_item").classList.remove("hide");
                    document.querySelector("#order_page").classList.add("hide");

                    let order = res.data.order;
                    let total = [];
                    order[0].cart.forEach(c => {




                        total.push(Number(c.food.price) * Number(c.qty))

                        console.log(total);


                        let total_order = total.reduce((a, b) => a + b);

                        document.querySelector("#total_order_price").innerText = total_order;

                        let HTML = `
                       
                        <div style="display-flex;flex-direction:column;gap-3;justify-content-center-align-items-center" class="col-md-12 mt-5">
                            <img style="width:100%;height:350px;object-fit:contain" src="${c.food.images[0]}" />
                            <p>Quantity: ${c.qty}</p>
                            <p>Food Name: ${c.food.name}</p>
                            <p>Food price: ${c.food.price}</p>
                            <p>Food Total Price: ${Number(c.food.price) * Number(c.qty)}</p>
                        </div>
                       `

                        document.querySelector("#order_item").querySelector(".row").innerHTML += HTML

                       

                    })

                    //    document.querySelector("#go_back_orders").addEventListener("click" , (e) => {


                    //     document.querySelector("#order_item").classList.add("hide");
                    //     document.querySelector("#order_page").classList.toggle("hide");


                    // })



                }).catch(err => {
                    console.log(err);

                })


            })
        })

        // document.querySelector("#back_orders").addEventListener("click" , (e) => {


        //     document.querySelector("#order_item").classList.add("hide");
        //     document.querySelector("#order_page").classList.remove("hide");
        // })

        document.querySelector("#delete_order").addEventListener("click", (e) => {
            let URL = document.URL.split("4unique-admin")[0];



            const user = JSON.parse(localStorage.getItem("user"));

            let { orderId } = e.target.dataset;

            axios.delete(URL + `api/v1/auth/delete_order/${orderId}`, {
                headers: {
                    Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
                }
            }).then(res => {
                let msg = res.data.msg;

                let HTML = `<p class="success-message">${msg}</p>`;

                document.querySelector(".success").innerHTML += HTML;

                setTimeout(() => {
                    document.querySelector(".success").innerHTML = "";

                    // window.location.href = "/home";

                }, 3000)
                window.location.reload();
            }).catch(err => {
                console.log(err);

            })
        })


    }).catch(err => {

        console.log(err);
    })

})
document.querySelector("#booked_order_id_text").addEventListener("input", (e) => {
    let text = e.target.value;
    let URL = document.URL.split("4unique-admin")[0];


    const user = JSON.parse(localStorage.getItem("user"));

    if (!text) {
        alert("enter id")
    }

    axios.post(URL + 'api/v1/auth/get_booked_order', { text }, {
        headers: {
            Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
        }
    }).then(res => {
        console.log(res);
        document.querySelector("#booked_con").style.display = "none";
        const order = res.data.order;

        document.querySelector("#booked_order_container_search").innerHTML = `
        <p style="text-align: center;">ORDER ID: ${  order._id}</p>
        <p style="text-align: center;">ORDER NUMBER: ${  order.order_num}</p>
        <p style="text-align: center;">ORDER DATE: ${  order.date}</p>
        <p style="text-align: center;">ORDER TIME: ${  order.time}</p>

        <p style="text-align: center;">Made By : ${  order.name}</p>
        <p style="text-align: center;">Order Owner Email : ${  order.email}</p>
        <p style="text-align: center;">Order Owner phone : ${  order.phone}</p>
       
       

        <div style="font-size: 18px;" class="d-flex gap-3 mt-3">
         
          <span>order isPaid: ${  order.isPaid}</span>
          
        </div>

        <p style="text-align: center;">Order Date : ${  order.createdAt}</p>

        <div style="font-size: 20px;" class="d-flex gap-3 mt-3">
          <a data-order-id="${ order._id}" id="booked_order_show_more" href="#" style="color:green">Show More</a>
          <a data-order-id="${ order._id}"  href="#" id="delete_booked_order" style="color:red;">Delete Order</a>
          
          
        </div>

        `
        

        //         document.querySelectorAll(".booked_order_show").forEach(btn => {

        //             console.log(btn);


        //             btn.addEventListener("click", (e) => {
        //                 // document.querySelector(".not-edit").classList.toggle("hide");
        //                 e.preventDefault();
        //                 console.log("hi");
        //                 let URL = document.URL.split("4unique-admin")[0];



        //                 const user = JSON.parse(localStorage.getItem("user"));

        //                 let order_id = e.target.dataset.orderId;
        // // get_booked_order
        //                 axios.get(URL + `api/v1/auth/get_booked_order/${order_id}`, {
        //                     headers: {
        //                         Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
        //                     }
        //                 }).then(res => {

        //                     document.querySelector("#booked_order_item").classList.toggle("hide");
        //                     document.querySelector("#booked_order_page").classList.add("hide");

        //                     let order = res.data.order;
        //                     let total = [];
        //                     order[0].cart.forEach(c => {




        //                         total.push(Number(c.food.price) * Number(c.qty))

        //                         console.log(total);


        //                         let total_order = total.reduce((a, b) => a + b);

        //                         document.querySelector("#total_order_price").innerText = total_order;

        //                         let HTML = `
        //                         <div style="display-flex;flex-direction:column;gap-3;justify-content-center-align-items-center" class="col-md-12 mt-5">
        //                             <img style="width:100%;height:350px;object-fit:contain" src="${c.food.images[0]}" />
        //                             <p>Quantity: ${c.qty}</p>
        //                             <p>Food Name: ${c.food.name}</p>
        //                             <p>Food price: ${c.food.price}</p>
        //                             <p>Food Total Price: ${Number(c.food.price) * Number(c.qty)}</p>
        //                         </div>
        //                        `

        //                         document.querySelector("#booked_order_item").querySelector(".row").innerHTML += HTML



        //                     })

        //                     //    document.querySelector("#go_back_orders").addEventListener("click" , (e) => {


        //                     //     document.querySelector("#order_item").classList.add("hide");
        //                     //     document.querySelector("#order_page").classList.toggle("hide");


        //                     // })



        //                 }).catch(err => {
        //                     console.log(err);

        //                 })


        //             })
        //         })

        document.querySelectorAll("#booked_order_show_more").forEach(btn => {
            btn.addEventListener("click", (e) => {
                // document.querySelector(".not-edit").classList.toggle("hide");

                let URL = document.URL.split("4unique-admin")[0];



                const user = JSON.parse(localStorage.getItem("user"));

                let order_id = e.target.dataset.orderId;

                axios.get(URL + `api/v1/auth/get_booked_order/${order_id}`, {
                    headers: {
                        Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
                    }
                }).then(res => {

                    document.querySelector("#booked_order_item").classList.remove("hide");
                    document.querySelector("#booked_order_page").classList.add("hide");

                    let order = res.data.order;
                    let total = [];
                    order.cart.forEach(c => {




                        total.push(Number(c.food.price) * Number(c.qty))

                        console.log(total);


                        let total_order = total.reduce((a, b) => a + b);

                        document.querySelector("#total_booked_order_price").innerText = total_order;

                        let HTML = `
                       
                        <div style="display-flex;flex-direction:column;gap-3;justify-content-center-align-items-center" class="col-md-12 mt-5">
                            <img style="width:100%;height:350px;object-fit:contain" src="${c.food.images[0]}" />
                            <p>Quantity: ${c.qty}</p>
                            <p>Food Name: ${c.food.name}</p>
                            <p>Food price: ${c.food.price}</p>
                            <p>Food Total Price: ${Number(c.food.price) * Number(c.qty)}</p>
                        </div>
                       `

                        document.querySelector("#booked_order_item").querySelector(".row").innerHTML += HTML

                       

                    })

                    //    document.querySelector("#go_back_orders").addEventListener("click" , (e) => {


                    //     document.querySelector("#order_item").classList.add("hide");
                    //     document.querySelector("#order_page").classList.toggle("hide");


                    // })



                }).catch(err => {
                    console.log(err);

                })


            })
        })

        // document.querySelector("#back_orders").addEventListener("click" , (e) => {


        //     document.querySelector("#order_item").classList.add("hide");
        //     document.querySelector("#order_page").classList.remove("hide");
        // })

        document.querySelector("#delete_booked_order").addEventListener("click", (e) => {
            let URL = document.URL.split("4unique-admin")[0];



            const user = JSON.parse(localStorage.getItem("user"));

            let { orderId } = e.target.dataset;

            axios.delete(URL + `api/v1/auth/delete_order/${orderId}`, {
                headers: {
                    Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
                }
            }).then(res => {
                let msg = res.data.msg;

                let HTML = `<p class="success-message">${msg}</p>`;

                document.querySelector(".success").innerHTML += HTML;

                setTimeout(() => {
                    document.querySelector(".success").innerHTML = "";

                    // window.location.href = "/home";

                }, 3000)
                window.location.reload();
            }).catch(err => {
                console.log(err);

            })
        })


    }).catch(err => {

        console.log(err);
    })

})


document.querySelector("#show_orders").addEventListener("click", (e) => {
    document.querySelector(".edit").classList.add("hide");
    document.querySelector(".not-edit").classList.add("hide");
    document.querySelector("#order_page").classList.toggle("hide");

})

document.querySelector("#show_booked_orders").addEventListener("click", (e) => {
    document.querySelector(".edit").classList.add("hide");
    document.querySelector(".not-edit").classList.add("hide");
    document.querySelector("#booked_order_page").classList.toggle("hide");
})

document.querySelector("#back_from_orders").addEventListener("click", (e) => {

    document.querySelector(".not-edit").classList.toggle("hide");
    document.querySelector("#order_page").classList.add("hide");
})

document.querySelector("#back_from_booked_orders").addEventListener("click", (e) => {

    document.querySelector(".not-edit").classList.toggle("hide");
    document.querySelector("#booked_order_page").classList.add("hide");
})

// /get_order/:id  order_item .row

document.querySelectorAll("#deliveredOrder_show_more").forEach(btn => {
    btn.addEventListener("click", (e) => {
        // document.querySelector(".not-edit").classList.toggle("hide");

        let URL = document.URL.split("4unique-admin")[0];



        const user = JSON.parse(localStorage.getItem("user"));

        let order_id = e.target.dataset.orderId;

        axios.get(URL + `api/v1/auth/get_order/${order_id}`, {
            headers: {
                Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
            }
        }).then(res => {

            document.querySelector("#order_item").classList.toggle("hide");
            document.querySelector("#all_delivered_orders").classList.add("hide");

            let order = res.data.order;
            let total = [];
            order[0].cart.forEach(c => {




                total.push(Number(c.food.price) * Number(c.qty))

                console.log(total);


                let total_order = total.reduce((a, b) => a + b);

                document.querySelector("#total_order_price").innerText = total_order;

                let HTML = `
                <div style="display-flex;flex-direction:column;gap-3;justify-content-center-align-items-center" class="col-md-12 mt-5">
                    <img style="width:100%;height:350px;object-fit:contain" src="${c.food.images[0]}" />
                    <p>Quantity: ${c.qty}</p>
                    <p>Food Name: ${c.food.name}</p>
                    <p>Food price: ${c.food.price}</p>
                    <p>Food Total Price: ${Number(c.food.price) * Number(c.qty)}</p>
                </div>
               `

                document.querySelector("#order_item").querySelector(".row").innerHTML += HTML



            })

            //    document.querySelector("#go_back_orders").addEventListener("click" , (e) => {


            //     document.querySelector("#order_item").classList.add("hide");
            //     document.querySelector("#order_page").classList.toggle("hide");


            // })



        }).catch(err => {
            console.log(err);

        })


    })
})

document.querySelectorAll("#canceledOrder_show_more").forEach(btn => {
    btn.addEventListener("click", (e) => {
        // document.querySelector(".not-edit").classList.toggle("hide");

        let URL = document.URL.split("4unique-admin")[0];



        const user = JSON.parse(localStorage.getItem("user"));

        let order_id = e.target.dataset.orderId;

        axios.get(URL + `api/v1/auth/get_order/${order_id}`, {
            headers: {
                Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
            }
        }).then(res => {

            document.querySelector("#order_item").classList.toggle("hide");
            document.querySelector("#all_canceled_orders").classList.add("hide");

            let order = res.data.order;
            let total = [];
            order[0].cart.forEach(c => {




                total.push(Number(c.food.price) * Number(c.qty))

                console.log(total);


                let total_order = total.reduce((a, b) => a + b);

                document.querySelector("#total_order_price").innerText = total_order;

                let HTML = `
                <div style="display-flex;flex-direction:column;gap-3;justify-content-center-align-items-center" class="col-md-12 mt-5">
                    <img style="width:100%;height:350px;object-fit:contain" src="${c.food.images[0]}" />
                    <p>Quantity: ${c.qty}</p>
                    <p>Food Name: ${c.food.name}</p>
                    <p>Food price: ${c.food.price}</p>
                    <p>Food Total Price: ${Number(c.food.price) * Number(c.qty)}</p>
                </div>
               `

                document.querySelector("#order_item").querySelector(".row").innerHTML += HTML



            })

            //    document.querySelector("#go_back_orders").addEventListener("click" , (e) => {


            //     document.querySelector("#order_item").classList.add("hide");
            //     document.querySelector("#order_page").classList.toggle("hide");


            // })



        }).catch(err => {
            console.log(err);

        })


    })
})


document.querySelectorAll("#pendingOrder_show_more").forEach(btn => {
    btn.addEventListener("click", (e) => {
        // document.querySelector(".not-edit").classList.toggle("hide");

        let URL = document.URL.split("4unique-admin")[0];



        const user = JSON.parse(localStorage.getItem("user"));

        let order_id = e.target.dataset.orderId;

        axios.get(URL + `api/v1/auth/get_order/${order_id}`, {
            headers: {
                Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
            }
        }).then(res => {

            document.querySelector("#order_item").classList.toggle("hide");
            document.querySelector("#all_pending_orders").classList.add("hide");

            let order = res.data.order;
            let total = [];
            order[0].cart.forEach(c => {




                total.push(Number(c.food.price) * Number(c.qty))

                console.log(total);


                let total_order = total.reduce((a, b) => a + b);

                document.querySelector("#total_order_price").innerText = total_order;

                let HTML = `
                <div style="display-flex;flex-direction:column;gap-3;justify-content-center-align-items-center" class="col-md-12 mt-5">
                    <img style="width:100%;height:350px;object-fit:contain" src="${c.food.images[0]}" />
                    <p>Quantity: ${c.qty}</p>
                    <p>Food Name: ${c.food.name}</p>
                    <p>Food price: ${c.food.price}</p>
                    <p>Food Total Price: ${Number(c.food.price) * Number(c.qty)}</p>
                </div>
               `

                document.querySelector("#order_item").querySelector(".row").innerHTML += HTML



            })

            //    document.querySelector("#go_back_orders").addEventListener("click" , (e) => {


            //     document.querySelector("#order_item").classList.add("hide");
            //     document.querySelector("#order_page").classList.toggle("hide");


            // })



        }).catch(err => {
            console.log(err);

        })


    })
})

document.querySelectorAll(".booked_order_show").forEach(btn => {
    btn.addEventListener("click", (e) => {
        // document.querySelector(".not-edit").classList.toggle("hide");

        let URL = document.URL.split("4unique-admin")[0];



        const user = JSON.parse(localStorage.getItem("user"));

        let order_id = e.target.dataset.orderId;

        axios.get(URL + `api/v1/auth/get_booked_order/${order_id}`, {
            headers: {
                Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
            }
        }).then(res => {
            console.log(res);
            
            document.querySelector("#booked_order_item").classList.remove("hide");
            document.querySelector("#booked_order_page").classList.add("hide");

            let order = res.data.order;

            // console.log(order[0].cart);
            

            let total = [];
            order?.cart.forEach(c => {

                total.push(Number(c.food.price) * Number(c.qty))

                console.log(total);


                let total_order = total.reduce((a, b) => a + b);

                document.querySelector("#total_booked_order_price").innerText = total_order;

                let HTML = `
                <div style="display-flex;flex-direction:column;gap-3;justify-content-center-align-items-center" class="col-md-12 mt-5">
                    <img style="width:100%;height:350px;object-fit:contain" src="${c.food.images[0]}" />
                    <p>Quantity: ${c.qty}</p>
                    <p>Food Name: ${c.food.name}</p>
                    <p>Food price: ${c.food.price}</p>
                    <p>Food Total Price: ${Number(c.food.price) * Number(c.qty)}</p>
                </div>
               `

                document.querySelector("#booked_order_item").querySelector(".row").innerHTML += HTML


                // document.querySelector("#back_booked_orders").addEventListener("click", (e) => {


                //     document.querySelector("#booked_order_item").classList.add("hide");
                //     document.querySelector("#booked_order_page").classList.remove("hide");
                // })

            })

            //    document.querySelector("#go_back_orders").addEventListener("click" , (e) => {


            //     document.querySelector("#order_item").classList.add("hide");
            //     document.querySelector("#order_page").classList.toggle("hide");


            // })



        }).catch(err => {
            console.log(err);

        })


    })
})

// asddddddddddddddddddddddddddddd
document.querySelectorAll("#order_show_more").forEach(btn => {
    btn.addEventListener("click", (e) => {
        // document.querySelector(".not-edit").classList.toggle("hide");

        let URL = document.URL.split("4unique-admin")[0];



        const user = JSON.parse(localStorage.getItem("user"));

        let order_id = e.target.dataset.orderId;

        axios.get(URL + `api/v1/auth/get_order/${order_id}`, {
            headers: {
                Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
            }
        }).then(res => {

            document.querySelector("#order_item").classList.remove("hide");
            document.querySelector("#order_page").classList.add("hide");

            let order = res.data.order;
            let total = [];
            order[0].cart.forEach(c => {




                total.push(Number(c.food.price) * Number(c.qty))

                console.log(total);


                let total_order = total.reduce((a, b) => a + b);



                document.querySelector("#total_order_price").innerText = total_order;

                let HTML = `
                <div style="display-flex;flex-direction:column;gap-3;justify-content-center-align-items-center" class="col-md-12 mt-5">
                    <img style="width:100%;height:350px;object-fit:contain" src="${c.food.images[0]}" />
                    <p>Quantity: ${c.qty}</p>
                    <p>Food Name: ${c.food.name}</p>
                    <p>Food price: ${c.food.price}</p>
                    <p>Food Total Price: ${Number(c.food.price) * Number(c.qty)}</p>
                </div>
               `

                document.querySelector("#order_item").querySelector(".row").innerHTML += HTML

                // document.querySelector("#back_orders_btn").addEventListener("click", (e) => {


                //     document.querySelector("#order_item").classList.add("hide");
                //     document.querySelector("#order_page").classList.remove("hide");
                // })



            })

            //    document.querySelector("#go_back_orders").addEventListener("click" , (e) => {


            //     document.querySelector("#order_item").classList.add("hide");
            //     document.querySelector("#order_page").classList.toggle("hide");


            // })



        }).catch(err => {
            console.log(err);

        })


    })
})



document.querySelectorAll("#edit_order_btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        document.querySelector("#span_order_id").innerText = e.target.dataset.orderId;

        document.querySelector("#edit_order").classList.toggle("hide");

        document.querySelector("#edit_order").style.display = "block";

        document.querySelector("#order_page").classList.add("hide");

    })
})

document.querySelector("#back_orders").addEventListener("click", (e) => {

    document.querySelector("#edit_order").classList.toggle("hide");

    document.querySelector("#edit_order").style.display = "none";

    document.querySelector("#order_page").classList.toggle("hide");
})

document.querySelector("#edit_order_submit").addEventListener("click", (e) => {
    e.preventDefault();
    /*
order_status
order_paid
    */

    let status = document.querySelector("#order_status").value;

    let isPaid = document.querySelector("#order_paid").value === "true" ? true : false;


    let URL = document.URL.split("4unique-admin")[0];



    const user = JSON.parse(localStorage.getItem("user"));

    let order_id_span = document.querySelector("#span_order_id").innerText;

    axios.patch(URL + `api/v1/auth/edit_order/${order_id_span}`, { status, isPaid }, {
        headers: {
            Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
        }
    }).then(res => {
        let msg = res.data.msg;

        let HTML = `<p class="success-message">${msg}</p>`;

        document.querySelector(".success").innerHTML += HTML;

        setTimeout(() => {
            document.querySelector(".success").innerHTML = "";

            // window.location.href = "/home";

        }, 3000)
        window.location.reload();
    }).catch(err => {
        console.log(err);

    })



})


document.querySelectorAll("#delete_order").forEach(btn => {
    btn.addEventListener("click", (e) => {
        let URL = document.URL.split("4unique-admin")[0];



        const user = JSON.parse(localStorage.getItem("user"));

        let { orderId } = e.target.dataset;

        axios.delete(URL + `api/v1/auth/delete_order/${orderId}`, {
            headers: {
                Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
            }
        }).then(res => {
            let msg = res.data.msg;

            let HTML = `<p class="success-message">${msg}</p>`;

            document.querySelector(".success").innerHTML += HTML;

            setTimeout(() => {
                document.querySelector(".success").innerHTML = "";

                // window.location.href = "/home";

            }, 3000)
            window.location.reload();
        }).catch(err => {
            console.log(err);

        })
    })
})
document.querySelectorAll("#delete_booked_order").forEach(btn => {
    btn.addEventListener("click", (e) => {
        let URL = document.URL.split("4unique-admin")[0];



        const user = JSON.parse(localStorage.getItem("user"));

        let { orderId } = e.target.dataset;

        axios.delete(URL + `api/v1/auth/delete_booked_order/${orderId}`, {
            headers: {
                Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
            }
        }).then(res => {
            let msg = res.data.msg;

            let HTML = `<p class="success-message">${msg}</p>`;

            document.querySelector(".success").innerHTML += HTML;

            setTimeout(() => {
                document.querySelector(".success").innerHTML = "";

                // window.location.href = "/home";

            }, 3000)
            window.location.reload();
        }).catch(err => {
            console.log(err);

        })
    })
})

document.querySelectorAll("#canceledOrder_delete").forEach(btn => {
    btn.addEventListener("click", (e) => {
        let URL = document.URL.split("4unique-admin")[0];



        const user = JSON.parse(localStorage.getItem("user"));

        let { orderId } = e.target.dataset;

        axios.delete(URL + `api/v1/auth/delete_order/${orderId}`, {
            headers: {
                Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
            }
        }).then(res => {
            let msg = res.data.msg;

            let HTML = `<p class="success-message">${msg}</p>`;

            document.querySelector(".success").innerHTML += HTML;

            setTimeout(() => {
                document.querySelector(".success").innerHTML = "";

                // window.location.href = "/home";

            }, 3000)
            window.location.reload();
        }).catch(err => {
            console.log(err);

        })
    })
})
document.querySelectorAll("#deliveredOrder_delete").forEach(btn => {
    btn.addEventListener("click", (e) => {
        let URL = document.URL.split("4unique-admin")[0];



        const user = JSON.parse(localStorage.getItem("user"));

        let { orderId } = e.target.dataset;

        axios.delete(URL + `api/v1/auth/delete_order/${orderId}`, {
            headers: {
                Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
            }
        }).then(res => {
            let msg = res.data.msg;

            let HTML = `<p class="success-message">${msg}</p>`;

            document.querySelector(".success").innerHTML += HTML;

            setTimeout(() => {
                document.querySelector(".success").innerHTML = "";

                // window.location.href = "/home";

            }, 3000)
            window.location.reload();
        }).catch(err => {
            console.log(err);

        })
    })
})


document.querySelectorAll("#pendingOrder_delete").forEach(btn => {
    btn.addEventListener("click", (e) => {
        let URL = document.URL.split("4unique-admin")[0];



        const user = JSON.parse(localStorage.getItem("user"));

        let { orderId } = e.target.dataset;

        axios.delete(URL + `api/v1/auth/delete_order/${orderId}`, {
            headers: {
                Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
            }
        }).then(res => {
            let msg = res.data.msg;

            let HTML = `<p class="success-message">${msg}</p>`;

            document.querySelector(".success").innerHTML += HTML;

            setTimeout(() => {
                document.querySelector(".success").innerHTML = "";

                // window.location.href = "/home";

            }, 3000)
            window.location.reload();
        }).catch(err => {
            console.log(err);

        })
    })
})


document.querySelector("#show_reports").addEventListener("click", (e) => {
    document.querySelector(".edit").classList.add("hide");
    document.querySelector(".not-edit").classList.add("hide");
    document.querySelector("#order_page").classList.add("hide");
    document.querySelector("#reports").classList.toggle("hide");
})

document.querySelector("#back_reports").addEventListener("click", (e) => {

    document.querySelector(".not-edit").classList.toggle("hide");
    document.querySelector("#reports").classList.toggle("hide");
})

document.querySelectorAll("#delete_report").forEach(btn => {
    btn.addEventListener("click", (e) => {
        let URL = document.URL.split("4unique-admin")[0];



        const user = JSON.parse(localStorage.getItem("user"));

        let { orderId } = e.target.dataset;

        axios.delete(URL + `api/v1/auth/delete_report/${orderId}`, {
            headers: {
                Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
            }
        }).then(res => {
            let msg = res.data.msg;

            let HTML = `<p class="success-message">${msg}</p>`;

            document.querySelector(".success").innerHTML += HTML;

            setTimeout(() => {
                document.querySelector(".success").innerHTML = "";

                // window.location.href = "/home";

            }, 3000)
            window.location.reload();
        }).catch(err => {
            console.log(err);

        })
    })
})

document.querySelector("#report_text_Search").addEventListener("change", (e) => {
    document.querySelector("#con_report").classList.add("hide")
    document.querySelector("#report_container_search").classList.toggle("hide");

    let URL = document.URL.split("4unique-admin")[0];



    const user = JSON.parse(localStorage.getItem("user"));

    let report_id = e.target.value;

    axios.get(URL + `api/v1/auth/find_report/${report_id}`, {
        headers: {
            Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
        }
    }).then(res => {
        console.log(res);

        let report = res.data.report;

        let HTML = `
        <p style="text-align: center;">ORDER ID: ${  report.order}</p>
    
        <p style="text-align: center;">Report Content : ${  report.report}</p>


        <p style="text-align: center;">Report Date : ${  report.createdAt}</p>
        

        <div style="font-size: 20px;" class="d-flex gap-3 mt-3">
          
          <a data-order-id="${ report._id}"  href="#" id="delete_report" style="color:red;">Delete Report</a>
          
          
        </div>  
        `

        document.querySelector("#report_container_search").innerHTML = HTML;

    }).catch(err => {
        console.log(err);
        document.querySelector("#con_report").classList.remove("hide")
        document.querySelector("#report_container_search").classList.toggle("hide");
    })

})

/*
all_pending
all_delivered
all_canceled

*/

// #order_container_search
document.querySelector("#admin-dashboard-link").addEventListener("click", (e) => {
    document.querySelector(".not-edit").classList.toggle("hide");
    document.querySelector("#admin-dashboard").classList.toggle("hide");
})

document.querySelector("#back_from_dashboard").addEventListener("click", (e) => {
    document.querySelector(".not-edit").classList.toggle("hide");
    document.querySelector("#admin-dashboard").classList.toggle("hide");
})
document.querySelector("#back_from_pending").addEventListener("click", (e) => {
    document.querySelector("#all_pending_orders").classList.toggle("hide");
    document.querySelector("#admin-dashboard").classList.toggle("hide");
})
document.querySelector("#back_from_delivered").addEventListener("click", (e) => {
    document.querySelector("#all_delivered_orders").classList.toggle("hide");
    document.querySelector("#admin-dashboard").classList.toggle("hide");
})
document.querySelector("#back_from_canceled").addEventListener("click", (e) => {
    document.querySelector("#all_canceled_orders").classList.toggle("hide");
    document.querySelector("#admin-dashboard").classList.toggle("hide");
})
document.querySelector("#back_from_users").addEventListener("click", (e) => {
    document.querySelector(".not-edit").classList.add("hide");
    document.querySelector("#all_users").classList.add("hide");
    document.querySelector("#admin-dashboard").classList.toggle("hide");
})
document.querySelector("#back_from__edit_users").addEventListener("click", (e) => {
    document.querySelector(".not-edit").classList.add("hide");
    document.querySelector("#all_users").classList.toggle("hide");
    document.querySelector("#admin-dashboard").classList.add("hide");
    document.querySelector("#edit_user_form").classList.add("hide");
})
document.querySelector("#show_all_users").addEventListener("click", (e) => {
    document.querySelector(".not-edit").classList.add("hide");
    document.querySelector("#all_users").classList.toggle("hide");
    document.querySelector("#admin-dashboard").classList.add("hide");
})
document.querySelector("#show_pending_orders").addEventListener("click", (e) => {
    document.querySelector(".not-edit").classList.add("hide");
    document.querySelector("#all_users").classList.add("hide");
    document.querySelector("#admin-dashboard").classList.add("hide");
    document.querySelector("#all_pending_orders").classList.toggle("hide");
})
document.querySelector("#show_delivered_orders").addEventListener("click", (e) => {
    document.querySelector(".not-edit").classList.add("hide");
    document.querySelector("#all_users").classList.add("hide");
    document.querySelector("#admin-dashboard").classList.add("hide");
    document.querySelector("#all_delivered_orders").classList.toggle("hide");
})
document.querySelector("#show_canceled_orders").addEventListener("click", (e) => {
    document.querySelector(".not-edit").classList.add("hide");
    document.querySelector("#all_users").classList.add("hide");
    document.querySelector("#admin-dashboard").classList.add("hide");
    document.querySelector("#all_canceled_orders").classList.toggle("hide");
})

document.querySelectorAll("#delete_user").forEach(btn => {
    btn.addEventListener("click", (e) => {
        // delete user function
        const { userId } = e.target.dataset;
        let URL = document.URL.split("4unique-admin")[0];



        const user = JSON.parse(localStorage.getItem("user"));


        axios.delete(URL + `api/v1/auth/delete_user/${userId}`, {
            headers: {
                Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
            }
        }).then(res => {
            let msg = res.data.msg;

            let HTML = `<p class="success-message">${msg}</p>`;

            document.querySelector(".success").innerHTML += HTML;

            setTimeout(() => {
                document.querySelector(".success").innerHTML = "";

                // window.location.href = "/home";

            }, 3000)
            window.location.reload();
        }).catch(err => {
            console.log(err);

        })

    })
})

document.querySelectorAll("#edit_user").forEach(btn => {
    btn.addEventListener("click", (e) => {
        // delete user function
        const { userId } = e.target.dataset;
        let URL = document.URL.split("4unique-admin")[0];



        const user = JSON.parse(localStorage.getItem("user"));


        axios.get(URL + `api/v1/auth/get_user/${userId}`, {
            headers: {
                Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
            }
        }).then(res => {
            console.log(res);

            let user_ob = res.data.user;

            document.querySelector(".not-edit").classList.add("hide");
            document.querySelector("#all_users").classList.add("hide");
            document.querySelector("#admin-dashboard").classList.add("hide");
            document.querySelector("#edit_user_form").classList.toggle("hide");

            document.querySelector("#edit_user_container").innerHTML = `
           <form style="display: flex;justify-content: center;align-items: center;margin-top: 20px;flex-direction: column;">
           <h1 class="mb-5">Edit User</h1>
           <input value="${user_ob.fullname}" id="edit_fullname" type="text" placeholder="Fullname">
           <input value="${user_ob.email}" id="edit_email" type="email" placeholder="Email">
           <input value="${user_ob.role}" id="edit_role" type="text" placeholder="Role">
           <button data-user-id="${user_ob._id}" id="edit_user_btn" type="submit">Submit</button>
         </form>
           `

            document.querySelector("#edit_user_btn").addEventListener("click", (e) => {
                const { userId } = e.target.dataset;

                let user_fullname = document.querySelector("#edit_fullname").value;
                let user_email = document.querySelector("#edit_email").value;
                let user_role = document.querySelector("#edit_role").value;

                updateUser(userId, user_fullname, user_email, user_role)
            })


        }).catch(err => {
            console.log(err);

        })

    })
})


function updateUser(id, fullname, email, role) {
    let URL = document.URL.split("4unique-admin")[0];



    const user = JSON.parse(localStorage.getItem("user"));


    axios.patch(URL + `api/v1/auth/update_user/${id}`, { fullname, email, role }, {
        headers: {
            Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
        }
    }).then(res => {
        let msg = res.data.msg;

        let HTML = `<p class="success-message">${msg}</p>`;

        document.querySelector(".success").innerHTML += HTML;

        setTimeout(() => {
            document.querySelector(".success").innerHTML = "";

            // window.location.href = "/home";

        }, 3000)
        window.location.reload();
    }).catch(err => {
        console.log(err);

    })
}

document.querySelector("#delete_all_canceled").addEventListener("click", (e) => {
    // delivered_all_delete
    let URL = document.URL.split("4unique-admin")[0];



    const user = JSON.parse(localStorage.getItem("user"));



    axios.delete(URL + `api/v1/auth/canceled_all_delete`, {
        headers: {
            Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
        }
    }).then(res => {
        console.log(res);

        let msg = res.data.msg;

        let HTML = `<p class="success-message">${msg}</p>`;

        document.querySelector(".success").innerHTML += HTML;

        setTimeout(() => {
            document.querySelector(".success").innerHTML = "";

            // window.location.href = "/home";

        }, 3000)
        window.location.reload();


    }).catch(err => {
        console.log(err);

    })
})
document.querySelector("#delete_all_delivered").addEventListener("click", (e) => {
    // delivered_all_delete
    let URL = document.URL.split("4unique-admin")[0];



    const user = JSON.parse(localStorage.getItem("user"));



    axios.delete(URL + `api/v1/auth/delivered_all_delete`, {
        headers: {
            Authorization: 'Bearer ' + user.token //the token is a variable which holds the token
        }
    }).then(res => {
        console.log(res);

        let msg = res.data.msg;

        let HTML = `<p class="success-message">${msg}</p>`;

        document.querySelector(".success").innerHTML += HTML;

        setTimeout(() => {
            document.querySelector(".success").innerHTML = "";

            // window.location.href = "/home";

        }, 3000)
        window.location.reload();


    }).catch(err => {
        console.log(err);

    })
})