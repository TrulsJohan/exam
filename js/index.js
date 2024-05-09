const newPostBtn = document.querySelector(".new-post-btn");
const profile = document.querySelector(".profile");
const blogsContainer = document.querySelector(".blogs-container");


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

function fetchBlogs (){
    const authDataString = localStorage.getItem(`authData`);
    const authData = JSON.parse(authDataString);

    fetch(`https://v2.api.noroff.dev/blog/posts/${authData.username}`)
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((result) => {
        console.log(result);
        renderBlogs(result);
    })
    .catch((error) => {
        console.error('Error during fetch:', error);
        alert("Could not fetch blogs. Please try again later.");
    }) 
}

function renderBlogs(result) {
    blogsContainer.innerHTML = "";
    for (let index = 0; index < result.data.length; index++) {
        blogsContainer.innerHTML +=
        `
        <a href="blog.html?id=${result.data[index].id}">
            <div class="blog-post>
                <div class="blog-img">img</div>
                <div class="blog-info-container">
                    <h3>${result.data[index].title}</h3>
                    <p>${result.data[index].updated}</p>
                </div>
            </div>
        </a>
        `  
    }
}


authAccess();
fetchBlogs();

