const Post = require('../models/post')


// create post
exports.createPost = (req,res,next) => {

    const url = req.protocol + '://' + req.get('host')
    // adding a posts
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        createdOn: new Date(),
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId
    })
    post.save().then(createdPost => {
        res.status(201).json({
         message: 'Post added successfully',
         post: {
            ...createdPost,
            id: createdPost._id
            // title: createdPost.title,
            // content: createdPost.content,
            // id: createdPost._id,
            // imagePath: createdPost.imagePath
         }
            
        }) 
    })
    .catch(error => {
        res.status(500).json({
            message: 'Creating a post failed!'
        })
    });
   
}

// get list of posts
exports.getPosts = (req,res,next) => {

const pageSize = +req.query.pageSize;
const currentPage = +req.query.page;
const postQuery = Post.find();
let fetchedPosts;

if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize)
}
    // fetching posts from database
    postQuery.then(documents => {
        fetchedPosts = documents
        return Post.countDocuments()
    }
       
    ).then(count => {
        res.status(200).json({
          message: "Post fetched successfully",
          posts: fetchedPosts,
          maxPosts: count
        })
      })
      .catch(error => {
        res.status(500).json({
            message: 'Fetching posts failed!'
        })
      })
    
}

// get specific post
exports.getPost =  (req,res,next) => {
    
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post)
        } else  {
            res.status(404).json({
                message: 'Page not found'
            })
        }
    })
    .catch(error => {
        res.status(500).json({
            message: 'Fetching post failed!'
        })
    })
}

// update specific post
exports.updatePost = (req,res,next) => {

    let imagePath = req.body.imagePath
    if (req.file) {
        const url = req.protocol + '://' + req.get('host')
        imagePath =  url + '/images/' + req.file.filename
    }

    const updatedPost = {
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    }

    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, updatedPost).then(result => {
        console.log('I am result', result);
       if (result.matchedCount > 0) {
        res.status(200).json({
            message: 'Post Updated succesfully'
        })
       }  else  {
        res.status(401).json({
            message: 'Not Authorized!'
        })
       }  
        
    })
    .catch(error => {
        res.status(500).json({
            message: "Couldn't update post!"
        })
    })
}


// delete post
exports.deletePost = (req,res,next) => {
    Post.deleteOne({_id: req.params.id}).then(result => {
      if (result.deletedCount > 0) {
        res.status(200).json({
            message: 'Post deleted succesfully'
        })
       }  else  {
        res.status(401).json({
            message: 'Not Authorized!'
        })
       }  
    })
    .catch(error => {
        res.status(500).json({
            message: 'Deleting post failed!'
        })
    })
}