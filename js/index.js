const newPostBtn = document.querySelector(".new-post-btn");
const profile = document.querySelector(".profile");


function authAccess () {
    const accessToken = localStorage.getItem('accessToken');
    console.log(accessToken);
    if (accessToken){
        newPostBtn.style.display = "block";
        profile.style.display = "block";
    } else {
        newPostBtn.style.display = "none";
        profile.style.display = "none";
    }
}

authAccess();

