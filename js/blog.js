const profile = document.querySelector(`.profile`);
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
            profile.style.display = "block";
            editPost.style.display = "block";
            editPost.addEventListener('click', () => {
                window.location.href = `edit.html?id=${idValue}`;
            });
        } else {
            profile.style.display = "none";
            editPost.style.display = "none";
        }
    } else {
        profile.style.display = "none";
        editPost.style.display = "none";
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
        <div class="blog-img"></div>
        <h1 class="blog-title">${dataBlog.title}</h1>
        <p class="blog-updated">${dataBlog.updated}</p>
        <p class="blog-body">${dataBlog.body}</p>
    </div>
    `
}

authAccess();

