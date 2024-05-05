window.onload = () => {

    const user = JSON.parse(localStorage.getItem("user"));
    
    document.querySelector("#fav_nav").setAttribute("href" , `/favourites/${user.user._id}`);

    document.querySelector("#login").style.display = user ? "none" : "block";

    document.querySelector("#signup").style.display = user ? "none" : "block";
  
    document.querySelector("#logout").style.display = user ? "block" : "none";
  
    document.querySelector(".home").style.display = "none";

    setTimeout(() => {
        document.querySelector(".home").style.display = "block";
        document.querySelector(".loader").style.display = "none";
      }, 4000)
}

let user = JSON.parse(localStorage.getItem("user"));

document.querySelectorAll("#fav_btn").forEach(b => {
  b.addEventListener("click" , (e) => {
    e.stopPropagation();
    
    let {foodId}  = e.target.dataset;
    let userId = user.user._id;
    
    // console.log(foodId);
    // logic add to vafourite
    let URL = document.URL.split("findfood")[0];

    console.log(user.token);
    

  
    axios.patch(URL + `api/v1/products/addToFav/${foodId}/${userId}` , {} ,  {
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

document.querySelector("#logout").addEventListener("click" , () => logout());

function logout() {
  localStorage.removeItem('user');
  window.location.href = '/loginpage';
}