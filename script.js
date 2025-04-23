// script.js
const API_BASE_URL = 'http://localhost:8080/api'; // Your backend API URL

// DOM Elements
const blogListContainer = document.getElementById('blog-list-container');
const blogListUl = document.getElementById('blog-list');
const listErrorEl = document.getElementById('list-error');

const blogDetailContainer = document.getElementById('blog-detail-container');
const blogDetailDiv = document.getElementById('blog-detail');
const detailErrorEl = document.getElementById('detail-error');
const backButton = document.getElementById('back-button');

// --- Helper Functions ---

function showError(element, message) {
    element.textContent = message;
    element.classList.remove('hidden');
}

function hideError(element) {
    element.textContent = '';
    element.classList.add('hidden');
}

function showView(viewToShow) {
    if (viewToShow === 'list') {
        blogListContainer.classList.remove('hidden');
        blogDetailContainer.classList.add('hidden');
        hideError(listErrorEl);
        hideError(detailErrorEl);
    } else if (viewToShow === 'detail') {
        blogListContainer.classList.add('hidden');
        blogDetailContainer.classList.remove('hidden');
        hideError(listErrorEl);
        hideError(detailErrorEl);
    }
}


// --- Display Functions ---

function displayBlogList(posts) {
    blogListUl.innerHTML = ''; // Clear previous list or loading message
    if (!posts || posts.length === 0) {
        blogListUl.innerHTML = '<li>No posts found.</li>';
        return;
    }

    posts.forEach(post => {
        const listItem = document.createElement('li');
        listItem.textContent = post.title;
        // Store identifier (id or slug) in data attribute for easy retrieval
        listItem.dataset.identifier = post.slug || post.id; // Prefer slug if available
        listItem.addEventListener('click', () => fetchBlogDetail(listItem.dataset.identifier));
        blogListUl.appendChild(listItem);
    });
}

function displayBlogDetail(post) {
    blogDetailDiv.innerHTML = ''; // Clear previous details

    const title = document.createElement('h2');
    title.textContent = post.title;

    const meta = document.createElement('p');
    meta.innerHTML = `By <strong>${post.author || 'Unknown'}</strong> on ${post.date || 'Unknown Date'}`;
    meta.style.fontSize = '0.9em';
    meta.style.color = '#555';


    const content = document.createElement('p');
    content.textContent = post.content;

    blogDetailDiv.appendChild(title);
    blogDetailDiv.appendChild(meta);
    blogDetailDiv.appendChild(content);

    showView('detail'); // Show the detail view
}


// --- API Fetch Functions ---

async function fetchBlogList() {
    showView('list'); // Ensure list view is visible
    blogListUl.innerHTML = '<li>Loading posts...</li>'; // Show loading indicator
    hideError(listErrorEl);

    try {
        const response = await fetch(`${API_BASE_URL}/blogs`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const posts = await response.json();
        displayBlogList(posts);
    } catch (error) {
        console.error('Error fetching blog list:', error);
        showError(listErrorEl, `Failed to load posts. Error: ${error.message}. Make sure the backend server is running.`);
        blogListUl.innerHTML = ''; // Clear loading message on error
    }
}

async function fetchBlogDetail(identifier) {
    hideError(detailErrorEl);
    blogDetailDiv.innerHTML = '<p>Loading post details...</p>'; // Show loading indicator
    showView('detail'); // Switch view immediately

    if (!identifier) {
        showError(detailErrorEl, 'Cannot fetch details: No identifier provided.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/blogs/${identifier}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Post not found.');
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        const post = await response.json();
        displayBlogDetail(post);
    } catch (error) {
        console.error(`Error fetching blog detail for identifier "${identifier}":`, error);
        showError(detailErrorEl, `Failed to load post details. Error: ${error.message}`);
        blogDetailDiv.innerHTML = ''; // Clear loading message on error
    }
}


// --- Event Listeners ---
backButton.addEventListener('click', fetchBlogList); // Go back to list view

// --- Initial Load ---
// Fetch the blog list when the page loads
document.addEventListener('DOMContentLoaded', fetchBlogList);