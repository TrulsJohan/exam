const newPostBtn = document.querySelector(".new-post-btn");
const profile = document.querySelector(".profile");
const blogContainer = document.querySelector(".blog-container");


function authAccess (){
    const authDataString = localStorage.getItem('authData');
    if (authDataString) {
        const authData = JSON.parse(authDataString);
        if (authData.accessToken) {
            newPostBtn.style.display = "block";
            profile.style.display = "block";
        } else {
            newPostBtn.style.display = "none";
            profile.style.display = "none";
        }
    } else {
        newPostBtn.style.display = "none";
        profile.style.display = "none";
    }
}

function renderBlogs (){

    const authDataString = localStorage.getItem(`authData`);
    const authData = JSON.parse(authDataString);

    fetch(`https://v2.api.noroff.dev/blog/posts/${authData.username}`)
    .then((response) => response.json())
    .then((result) => console.log(result));
}

authAccess();
renderBlogs();

