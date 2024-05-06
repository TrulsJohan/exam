const loginBtn = document.querySelector(".login-btn");

let authData = {};

function login() {

    event.preventDefault();

    fetch("https://v2.api.noroff.dev/auth/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            email: document.querySelector(".email").value,
            password: document.querySelector(".password").value,
        }),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);
        const accessToken = data.data.accessToken;
        const username = data.data.name;
        authData.accessToken = accessToken;
        authData.username = username;
        localStorage.setItem('authData', JSON.stringify(authData));
        window.location.href = 'index.html';
    })
    .catch((error) => {
        console.error('Error during login:', error);
        alert("Could not login. Please try again later.");
    });
};

loginBtn.addEventListener("click", login); 

