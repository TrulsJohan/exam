const newPostBtn = document.querySelector(".new-post-btn");
const profile = document.querySelector(".profile");
const filterDropdown = document.querySelector(`.filter-dropdown`);
const resetFilter = document.querySelector(`.reset-filter`);
const blogsContainer = document.querySelector(".blogs-container");
const carouselContainer = document.querySelector(`.carousel`);
const nextBtn = document.querySelector(`.next`);
const prevBtn = document.querySelector(`.prev`);

const tagsArray = [];
let blogs = [];

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

function fetchBlogs() {
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
            blogs = result;
            console.log(blogs);
            renderBlogs(result);
        })
        .catch((error) => {
            console.error('Error during fetch:', error);
            alert("Could not fetch blogs. Please try again later.");
        })
}

// Function to generate HTML for displaying a single blog post
function generateBlogHTML(post, isHidden = false) {
    const displayStyle = isHidden ? 'style="display: none;"' : '';
    return `
        <div class="blog-post" ${displayStyle} data-id="${post.id}">
            <a href="blog.html?id=${post.id}">
                <div class="img-container">
                    <img class="blog-img" src="${post.media.url}" alt="${post.title}">
                </div>
                <div class="blog-info-container">
                    <h3>${post.title}</h3>
                    <p>${post.updated}</p>
                </div>
            </a>
        </div>
    `;
}

function renderBlogs(result) {
    for (let index = 0; index < result.data.length; index++) {
        if (!tagsArray.includes(result.data[index].tags)) {
            tagsArray.push(result.data[index].tags);
        }
    }
    console.log(tagsArray);
    for (let index = 0; index < tagsArray.length; index++) {
        filterDropdown.innerHTML += `<option>${tagsArray[index]}</option>`
    }

    const latestPosts = result.data.slice(0, 3);
    const remainingPosts = result.data.slice(3);

    // Render latest posts in the carousel container
    latestPosts.forEach((post, index) => {
        if (index === 0) {
            carouselContainer.innerHTML += generateBlogHTML(post);
        } else {
            carouselContainer.innerHTML += generateBlogHTML(post, true);
        }
    });

    // Attach event listener to the carousel post to redirect to blog.html
    const carouselPost = carouselContainer.querySelector(".blog-post");
    carouselPost.addEventListener("click", () => {
        window.location.href = `blog.html?id=${carouselPost.dataset.id}`;
    });

    // Render remaining posts in the blogs container
    remainingPosts.slice(0, 6).forEach((post) => {
        blogsContainer.innerHTML += generateBlogHTML(post);
    });

    // Carousel animation for next button
    nextBtn.addEventListener("click", () => {
        const carouselPosts = carouselContainer.querySelectorAll(".blog-post");
        carouselPosts[0].style.display = `none`;
        carouselContainer.appendChild(carouselPosts[0]);
        carouselPosts[1].style.display = `block`;
    });

    // Carousel animation for previous button
    prevBtn.addEventListener("click", () => {
        const carouselPosts = carouselContainer.querySelectorAll(".blog-post");
        carouselPosts[1].style.display = `none`;
        carouselContainer.insertBefore(carouselPosts[carouselPosts.length - 1], carouselPosts[0]);
        carouselPosts[0].style.display = `block`;
    });
}

function filterBlogs(filterValue) {
    blogsContainer.innerHTML = ''; // Clear existing blogs

    blogs.data.forEach(post => {
        if (post.tags.includes(filterValue) || filterValue === 'All Blogs') {
            blogsContainer.innerHTML += generateBlogHTML(post);
        }
    });
}

filterDropdown.addEventListener("change", () => {
    if (filterDropdown.value === "All Blogs") {
        renderBlogs(blogs);
    } else {
        filterBlogs(filterDropdown.value);
    }
});

resetFilter.addEventListener("click", () => {
    carouselContainer.innerHTML = '';
    blogsContainer.innerHTML = '';
    filterDropdown.innerHTML = `<option value="default" disabled selected>All Blogs</option>`;
    renderBlogs(blogs);
});

authAccess();
fetchBlogs();

