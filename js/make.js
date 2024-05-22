const postBtn = document.querySelector(".post-btn");
const cancelBtn = document.querySelector(".cancel-btn");
const navContainer = document.querySelector(`.nav-container`);

function authAccess() {
    const authDataString = localStorage.getItem('authData');
    if (authDataString) {
        const authData = JSON.parse(authDataString);
        if (authData.accessToken) {
            navContainer.style.display = "flex";
        } else {
            navContainer.style.display = "none";
        }
    } else {
        navContainer.style.display = "none";
    }
}

function post() {
    const authDataString = localStorage.getItem(`authData`);
    const authData = JSON.parse(authDataString);

    fetch(`https://v2.api.noroff.dev/blog/posts/${authData.username}`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${authData.accessToken}`
        },
        body: JSON.stringify({
            title: document.querySelector(".title-input").value,
            body: document.querySelector(".content-input").value,
            tags: [document.querySelector(".tags-input").value],
            media: {
                  url: document.querySelector(".img-input").value,
                },
        })
    })   
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);
        window.location.href = `index.html`;
    })
    .catch((error) => {
        console.error('Error during authentication:', error);
        alert("Could not authenticate. Please try again later.");
    });
    event.preventDefault();
};

postBtn.addEventListener("click", post);

authAccess();

