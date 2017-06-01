var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    expressSanitizer = require('express-sanitizer')

mongoose.connect('mongodb://localhost/blog_app')
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(expressSanitizer())

app.use(express.static('public/css'))
app.use(express.static('views/partials'))

var schema = new mongoose.Schema({
             title: String,
             image: String,
             body: String,
             created: {type:Date, default: Date.now}
})

var Blog = mongoose.model('Blog',schema)

app.get('/',function(req,res){
  res.redirect('/blogs')
})

app.get('/blogs',function(req,res){
  Blog.find({},function(err,blog){
    if(err) console.log(err)
    else res.render('index.ejs',{blog: blog})
  })
})

app.get('/blogs/new',function(req,res){
  res.render('new.ejs')
})

app.post('/blogs',function(req,res){
  req.body.blog.body = req.sanitize(req.body.blog.body)
  Blog.create(req.body.blog,function(err,newBlog){
    if(err) res.render('new.ejs')
    else res.redirect('/blogs')
  })
})

app.get('/blogs/:id',function(req,res){
  Blog.findById(req.params.id,function(err,foundBlog){
    if(err) res.redirect('/')
    else res.render('show.ejs',{foundBlog: foundBlog})
  })
})

app.get('/blogs/:id/edit',function(req,res){
  Blog.findById(req.params.id,function(err,foundBlog){
    if(err) res.redirect('/blogs')
    else res.render('edit.ejs',{foundBlog: foundBlog})
  })
})

app.put('/blogs/:id',function(req,res){
  req.body.blog.body = req.sanitize(req.body.blog.body)
  Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
    if(err) res.redirect('/blogs')
    else res.redirect("/blogs/"+req.params.id)
  })
})

app.delete('/blogs/:id',function(req,res){
  Blog.findByIdAndRemove(req.params.id,function(err){
    res.redirect('/')
  })
})

app.listen(3000,function(){
  console.log('You can start blogging')
})
