const newPostBtn = document.querySelector(".new-post-btn");
const profile = document.querySelector(".profile");


function authAccess() {
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

authAccess();

