const navontainer = document.querySelector(`.nav-container`);
const blogContainer = document.querySelector(`.blog-container`);
const editPost = document.querySelector(`.edit-post`);

const queryString = window.location.search;
const urlParam = new URLSearchParams(queryString);
const idValue = urlParam.get(`id`);

function authAccess() {
    const authDataString = localStorage.getItem('authData');
    if (authDataString) {
        const authData = JSON.parse(authDataString);
        fetchBlog(authData);
        if (authData.accessToken) {
            navontainer.style.display = "flex";
        } else {
            navontainer.style.display = "none";
        }
    } else {
        navontainer.style.display = "none";
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
            renderBlog(result);
        })
        .catch((error) => {
            console.error('Error during fetch:', error);
            alert("Could not fetch blogs. Please try again later.");
        })
}

function renderBlog(result) {
    blogContainer.innerHTML = "";
    dataBlog = result.data.find(val => val.id === idValue);
    console.log(dataBlog);
    blogContainer.innerHTML =
        `
        <div class="blog-content">
            <p class="blog-updated">${dataBlog.updated}</p>
            <h6 class="blog-title">${dataBlog.title}</h6>
            <img class="blog-img" src="${dataBlog.media.url}" alt="${dataBlog.title}">
            <div class="img-edit-container">
                <div class="group-img-container">
                    <div class="group-logo-bg">
                        <img src="assets/img/group-img-logo.svg" alt="img">
                    </div>
                    <img src="assets/img/group-eclipse.svg" alt="eclipse">
                    <img src="assets/img/group-eclipse.svg" alt="eclipse">
                    <img src="assets/img/group-eclipse.svg" alt="eclipse">
                </div>
                <a href="../edit.html?id=${dataBlog.id}">
                    <div class="edit-container">
                        <img src="assets/img/edit.svg" alt="edit">
                        <p class="label-xs">Edit post</p>
                    </div>
                </a>
            </div>
            <p class="paragraph-s blog-body">${dataBlog.body}</p>
        </div>
        `
}

authAccess();

