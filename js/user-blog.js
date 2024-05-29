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
        if (authData.accessToken) {
            navontainer.style.display = "flex";
        } else {
            navontainer.style.display = "none";
        }
    } else {
        navontainer.style.display = "none";
    }
}

function fetchBlog() {
    fetch(`https://v2.api.noroff.dev/blog/posts/Truls_test`)
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
    let dateConverted = new Date(dataBlog.updated);
    let options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    let newDate = dateConverted.toLocaleDateString(undefined, options);
    console.log(dataBlog);
    blogContainer.innerHTML =
        `
        <div class="blog-content">
            <p class="blog-author">${dataBlog.author.name}</p>
            <h6 class="blog-title">${dataBlog.title}</h6>
            <p class="blog-updated">${newDate}</p>
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
            </div>
            <p class="paragraph-s blog-body">${dataBlog.body}</p>
        </div>
        `
}

authAccess();
fetchBlog();

