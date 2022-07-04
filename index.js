const express = require('express')
const app = express()
const port = 3000

const dbURI = 'mongodb+srv://Nickjr:47313@cluster0.wivn8.mongodb.net/blog-site?retryWrites=true&w=majority'

// middlewares
const morgan = require('morgan')
app.use(express.urlencoded({extended:false}));



const mongoose = require('mongoose');
const Blog = require('./models/blog')
const { render } = require('ejs')

app.set('view engine', 'ejs')

app.use(morgan('dev'))
app.use(express.static('static'))

main().then(res => {
  console.log('success')
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  }) 
}).catch(err => console.log('eerror', err));

async function main() {
  await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
}


app.get('/', (req, res) => {
  Blog.find()
    .then(blogs => {
      res.render('index', {title: 'Home Page', blogs: blogs})
    })
    .catch(err => console.log(err))
})
app.get('/about', (req, res) => {
  res.render('about')
})
app.get('/blogs/', (req, res) => {
  res.render('create-blog', {title: 'Create Blog'})
})
app.post('/blogs', (req, res) => {
  console.log(req.body)
  const blog = new Blog(req.body)
  blog.save()
  .then(result => {
    res.redirect('/')
  })
  .catch(err => console.log(err))
})

app.get('/blogs/:id', (req, res) => {
  Blog.findByIdAndDelete(req.params.id)
    .then(result => {
      res.render('delete-blog', {title: 'Blog details', blog: result})
    }).catch(err => console.log(err))
})
app.delete('/blogs/:id', (req, res) => {
  Blog.findByIdAndDelete(req.params.id)
    .then(result => {
      res.json({message: 'Blog deleted', redirect: '/'})
    }).catch(err => console.log(err))
})

app.use((req, res) => {
  res.status(404).send('<p>404 Page</p>')
})

// const marked = require('marked');
// or const { marked } = require('marked');

// const html = marked.parse('## Marked in Node.js\n\nRendered by **marked**. \n\n- i am mad');
// console.log(html);

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)})\