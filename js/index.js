const navContainer = document.querySelector(".nav-container");
const filterDropdown = document.querySelector(`.filter-dropdown`);
const resetFilter = document.querySelector(`.reset-filter`);
const inputSearch = document.querySelector(`.search-input`);
const blogsContainer = document.querySelector(".blogs-container");
const carouselContainer = document.querySelector(`.carousel`);
const nextBtn = document.querySelector(`.next`);
const prevBtn = document.querySelector(`.prev`);
const seeMore = document.querySelector(`.see-more-btn`);

let tagsArray = [];
let blogs = [];
let displayedBlogCount = 6;

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

function generateBlogHTML(post, isHidden = false) {
    const displayStyle = isHidden ? 'style="display: none;"' : '';
    return `
        <div class="blog-post" ${displayStyle} data-id="${post.id}">
            <a href="blog.html?id=${post.id}">
                <div class="img-container">
                    <img class="blog-img" src="${post.media.url}" alt="${post.title}">
                    <div class="title-container">
                        <p class="label-s blog-title">${post.title}</p>
                    </div>
                </div>
            </a>
        </div>
    `;
}

function renderBlogs(result) {
    for (let i = 0; i < result.data.length; i++) {
        let tags = result.data[i].tags;
        for (let j = 0; j < tags.length; j++) {
            if (!tagsArray.includes(tags[j])) {
                tagsArray.push(tags[j]);
            }
        }
    }
    console.log(tagsArray);
    for (let i = 0; i < tagsArray.length; i++) {
        filterDropdown.innerHTML += `<option>${tagsArray[i]}</option>`;
    }

    const latestPosts = result.data.slice(0, 3);
    const remainingPosts = result.data.slice(3);

    latestPosts.forEach((post, index) => {
        if (index === 0) {
            carouselContainer.innerHTML += generateBlogHTML(post);
        } else {
            carouselContainer.innerHTML += generateBlogHTML(post, true);
        }
    });

    const carouselPost = carouselContainer.querySelector(".blog-post");
    carouselPost.addEventListener("click", () => {
        window.location.href = `blog.html?id=${carouselPost.dataset.id}`;
    });

    remainingPosts.slice(0, displayedBlogCount).forEach((post) => {
        blogsContainer.innerHTML += generateBlogHTML(post);
    });

    nextBtn.addEventListener("click", () => {
        const carouselPosts = carouselContainer.querySelectorAll(".blog-post");
        carouselContainer.classList.add("dim");
        setTimeout(() => {
            carouselPosts[0].style.display = `none`;
            carouselContainer.appendChild(carouselPosts[0]);
            carouselPosts[1].style.display = `block`;
            carouselContainer.classList.remove("dim");
        }, 200);
    });
    
    prevBtn.addEventListener("click", () => {
        const carouselPosts = carouselContainer.querySelectorAll(".blog-post");
        carouselContainer.classList.add("dim");
        setTimeout(() => {
            carouselPosts[1].style.display = `none`;
            carouselContainer.insertBefore(carouselPosts[carouselPosts.length - 1], carouselPosts[0]);
            carouselPosts[0].style.display = `block`;
            carouselContainer.classList.remove("dim");
        }, 200);
    });
    
}

function filterBlogs(filterValue) {
    blogsContainer.innerHTML = '';

    blogs.data.forEach(post => {
        if (post.tags.includes(filterValue) || filterValue === 'All Blogs') {
            blogsContainer.innerHTML += generateBlogHTML(post);
        }
    });
}

function searchBlogs(searchTerm) {
    searchTerm = searchTerm.toLowerCase().trim(); 
    const filteredBlogs = blogs.data.filter(post => post.title.toLowerCase().includes(searchTerm));
    renderSearch(filteredBlogs); 
    console.log(filteredBlogs);
}

function renderSearch(filteredBlogs) {
    blogsContainer.innerHTML = '';
    for (let index = 0; index < filteredBlogs.length; index++) {
        blogsContainer.innerHTML += 
        `
        <div class="blog-post" data-id="${filteredBlogs[index].id}">
            <a href="blog.html?id=${filteredBlogs[index].id}">
                <div class="img-container">
                    <img class="blog-img" src="${filteredBlogs[index].media.url}" alt="${filteredBlogs[index].title}">
                    <div class="title-container">
                        <p class="label-s blog-title">${filteredBlogs[index].title}</p>
                    </div>
                </div>
            </a>
        </div>
        `
    }
}

function seeMoreBlogs() {
    const totalDisplayed = blogsContainer.children.length;
    const additionalBlogs = blogs.data.slice(totalDisplayed, totalDisplayed + 6); // Load 6 more blogs
    additionalBlogs.forEach(post => {
        blogsContainer.innerHTML += generateBlogHTML(post);
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

inputSearch.addEventListener("input", () => {
    if (inputSearch.value.length <= 3) {
        searchBlogs(inputSearch.value);
    } else {
        carouselContainer.innerHTML = '';
        blogsContainer.innerHTML = '';
        renderBlogs(blogs);
    }
});

seeMore.addEventListener("click", () => {
    seeMoreBlogs();
});

authAccess();
fetchBlogs();

