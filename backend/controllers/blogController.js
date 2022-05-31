import asyncHandler from 'express-async-handler';
import Blog from '../models/blogModel.js';
import User from '../models/userModel.js';

const getBlogs = asyncHandler(async(req, res) => {
    const blogs = await Blog.find({})

    res.json({ blogs });
})

const getBlogById = asyncHandler(async(req, res) => {

    const blog = await Blog.findById(req.params.id)
    
    if(blog) {
        res.json(blog);
    } else {
        res.status(404).json({ message: 'Blog Not Found' });
    }
})

const createBlog = asyncHandler(async(req, res) => {

    const blog = new Blog({
        title: 'Название',
        user: req.user._id,
        image: '/images/sample.jpg',
        author: 'Admin',
        category: 'Блог',
        content: 'Описание'
    })

    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
})

const updateBlog = asyncHandler(async(req, res) => {

    const { title, category, image, author, content } = req.body;

    const blog = await Blog.findById(req.params.id)


    if(blog) {
        blog.title = title;
        blog.author = author;
        blog.image = image
        blog.category = category;
        blog.content = content;

        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    } else {
        res.status(404);
        throw new Error('Blog Post Not Found');
    }
})

const deleteBlog = asyncHandler(async(req, res) => {

    const blog = await Blog.findById(req.params.id)
    
    if(blog) {
        await blog.remove();
        res.json({
            message: 'Блог удален'
        })
    } else {
        res.status(404).json({ message: 'Блог не найден' });
    }
})


export {
    getBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
}