
window.onload = () => {

    let user = JSON.parse(localStorage.getItem("user"));

    if(user){
        window.location.href = "/home";
    }

    if(user && user.user.role === "admin"){
        window.location.href = "/4unique-admin"
    }

    document.querySelector(".form").style.display = "none";

    setTimeout(() => {
        document.querySelector(".form").style.display = "block";
        document.querySelector(".loader").style.display = "none";
    } , 4000)
}


document.querySelector("#login-btn").addEventListener("click" , (event) => {
    event.preventDefault();
    
  
    let email = document.querySelector("#email").value;

    let password = document.querySelector("#password").value;

 
    createUser(email,password);
    
})


// /api/v1/auth
function createUser(email , password){

    let url = document.URL;

    url = url.split("loginpage")[0];


    axios.post(url + "api/v1/auth/login" , {email , password}).then(res => {

        let msg = res.data.msg;
        let token = res.data.token;
        let user = res.data.user;

        let userObj = {
            user:user,
            token:token
        } 

        localStorage.setItem("user" , JSON.stringify(userObj));

        document.querySelector("#login-btn").disabled = true;

        let HTML = `<p class="success-message">${msg}</p>`;

        document.querySelector("#success").innerHTML += HTML;

        setTimeout(() => {
            document.querySelector("#success").innerHTML = "";
            document.querySelector("#login-btn").disabled = false;
            
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
        
        
    });

   

    

}