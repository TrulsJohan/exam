const registerBtn = document.querySelector(`.register-btn`);
const checkbox = document.querySelector(`.checkbox`);

function register() {
    if(!checkbox.checked){
        alert(`You have not agreed to the terms`);
    } else {
        fetch(`https://v2.api.noroff.dev/auth/register`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            name: document.querySelector(".username").value,
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
        .then((result) => {
            console.log(result);
            window.location.href = 'login.html';
        })
        .catch((error) => {
            console.error('Error during login:', error);
            alert("Could not login. Please try again later.");
        });
    }
    event.preventDefault();
};

registerBtn.addEventListener("click", register);

