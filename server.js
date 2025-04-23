// server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

// --- Hardcoded Blog Data ---
const blogPosts = [
    {
        id: 1,
        slug: 'getting-started-with-node',
        title: 'Getting Started with Node.js',
        author: 'Admin',
        date: '2025-04-20',
        content: 'Node.js is a powerful JavaScript runtime built on Chrome\'s V8 JavaScript engine. This post covers the basics of setting up your environment.'
    },
    {
        id: 2,
        slug: 'express-routing-basics',
        title: 'Express Routing Basics',
        author: 'Dev User',
        date: '2025-04-21',
        content: 'Express.js makes building web applications and APIs easier. Learn how to define routes to handle different HTTP requests.'
    },
    {
        id: 3,
        slug: 'api-design-principles',
        title: 'API Design Principles',
        author: 'API Expert',
        date: '2025-04-22',
        content: 'Designing clean and predictable APIs is crucial for maintainability and usability. We explore some key principles.'
    },
    {
        id: 4,
        slug: 'connecting-frontend-backend',
        title: 'Connecting Frontend to Backend',
        author: 'Fullstack Dev',
        date: '2025-04-23',
        content: 'Learn how to use the Fetch API or libraries like Axios to make requests from your frontend application to your backend API.'
    }
];

// --- Middleware ---
// Enable CORS for all origins (for development purposes)
app.use(cors());
// Middleware to parse JSON bodies (though not strictly needed for these GET requests)
app.use(express.json());

// --- API Routes ---

// GET /api/blogs - Returns the list of all blog posts
app.get('/api/blogs', (req, res) => {
    console.log('Request received for /api/blogs');
    // Return only essential list data (id, slug, title)
    const blogList = blogPosts.map(post => ({
        id: post.id,
        slug: post.slug,
        title: post.title
    }));
    res.json(blogList);
});

// GET /api/blogs/:identifier - Returns details for a specific blog post by ID or Slug
app.get('/api/blogs/:identifier', (req, res) => {
    const identifier = req.params.identifier;
    console.log(`Request received for /api/blogs/${identifier}`);

    // Try finding by ID (converting identifier to number)
    const postId = parseInt(identifier, 10);
    let foundPost = null;

    if (!isNaN(postId)) {
        foundPost = blogPosts.find(post => post.id === postId);
    }

    // If not found by ID or identifier wasn't a valid number, try finding by slug
    if (!foundPost) {
        foundPost = blogPosts.find(post => post.slug === identifier);
    }

    if (foundPost) {
        console.log(`Found post: ${foundPost.title}`);
        res.json(foundPost); // Return the full post details
    } else {
        console.log(`Post not found for identifier: ${identifier}`);
        res.status(404).json({ message: 'Blog post not found' });
    }
});

// --- Default Route ---
app.get('/', (req, res) => {
    res.send('Blog API is running. Try /api/blogs or /api/blogs/:id_or_slug');
});


// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});