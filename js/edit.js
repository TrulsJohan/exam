const profile = document.querySelector(`.profile`);
const inputTitle = document.querySelector(`.title-input`);
const inputContent = document.querySelector(`.content-input`);
const inputImg = document.querySelector(`.img-input`);
const deleteBtn = document.querySelector(`.delete-btn`);
const saveBtn = document.querySelector(`.save-btn`);
const cancelBtn = document.querySelector(`.cancel-btn`);

const queryString = window.location.search;
const urlParam = new URLSearchParams(queryString);
const idValue = urlParam.get(`id`);
console.log(idValue);

let authData;
let dataBlog;
let isFirstLoad = true;

function authAccess() {
    const authDataString = localStorage.getItem('authData');
    if (authDataString) {
        authData = JSON.parse(authDataString);
        if (isFirstLoad) {
            fetchBlog(authData);
            isFirstLoad = false;
        }
        if (authData.accessToken) {
            profile.style.display = "block";
        } else {
            profile.style.display = "none";
        }
    } else {
        profile.style.display = "none";
    }
}

function fetchBlog(authData) {
    fetch(`https://v2.api.noroff.dev/blog/posts/${authData.username}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json()
        })
        .then((result) => {
            console.log(result);
            dataBlog = result.data.find((val) => val.id === idValue);
            console.log(dataBlog);
            inputTitle.value = dataBlog.title;
            inputContent.value = dataBlog.body;
            inputImg.value = dataBlog.media.url;
        })
        .catch((error) => {
            console.error('Error during fetch:', error);
            alert("Could not fetch blogs. Please try again later.");
        })
}

function saveChanges (authData, dataBlog){
    fetch(`https://v2.api.noroff.dev/blog/posts/${authData.username}/${dataBlog.id}`, {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${authData.accessToken}`
        },
        body: JSON.stringify({
            title: inputTitle.value,
            body: inputContent.value,
            media: {
                url: inputImg.value,
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
        window.location.href = `blog.html?id=${dataBlog.id}`;
    })
    .catch((error) => {
        console.error('Error during authentication:', error);
        alert("Could not authenticate. Please try again later.");
    });
    event.preventDefault();
}

function deletePost (dataBlog, authData){
    fetch(`https://v2.api.noroff.dev/blog/posts/${authData.username}/${dataBlog.id}`, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${authData.accessToken}`
        }
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Network response was not ok`);
        }
    })
    .then((result) => {
        console.log(result);
        window.location.href = `index.html`;
    })
    .catch((error) => {
        console.error(`Error during authentication`, error);
        alert(`Could not authenticate. Please try again later`);
    })
    event.preventDefault();
}

saveBtn.addEventListener("click", () => saveChanges(authData, dataBlog));
cancelBtn.addEventListener("click", ()=> window.location.href = `blog.html?id=${dataBlog.id}`);
deleteBtn.addEventListener("click", ()=> deletePost(dataBlog, authData));

authAccess();

