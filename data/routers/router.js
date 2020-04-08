const express = require('express');

const PostsDataBase = require('../db.js');

const router = express.Router();

router.get('/', (req, res) => {
  PostsDataBase.find(req.query)
  .then(posts => {
    res.status(200).json(posts);
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: 'The posts information could not be retrieved.'
    });
  });
});
  
router.get('/:id', (req, res) => {
  PostsDataBase.findById(req.params.id)
  .then(post => {
    if (post.length > 0) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'The post with the specified ID does not exist.' });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'The post information could not be retrieved.',
    });
  });
});
  
router.get('/:id/comments', (req, res) => {
  PostsDataBase.findPostComments(req.params.id)
  .then((posts) => {
    if(posts.length > 0){
        res.status(201).json(posts);
    } else {
      res.status(404).json({message: 'The posts with the specified ID does not exist.'});
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({message: 'The comments information could not be retrieved.'});
  });
});

router.post('/', (req, res) => {
  if(req.body.title && req.body.contents){
    PostsDataBase.insert(req.body)
    .then(newPost => {
      if(newPost){
        res.status(201).json(newPost);
      }
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json(
        {
          error: "There was an error while saving the post to the database",
        });
    });
  } else {
      res.status(500).json({
          errorMessage: "Please provide title and contents for the post.",
      });
  }
});
  
router.post('/:id/comments', (req, res) => {
  PostsDataBase.findById(req.params.id)
  .then(post => {
    if (post.length > 0) {
      if(req.body.text){
        PostsDataBase.insertComment(req.body)
        .then(newComment =>{
          console.log(newComment);
          res.status(201).json({newComment});
        })
        .catch(err => {
          res.status(500),json({error: "The posts information could not be retrieved."})
        })
      } else {
        res.status(400).json({errorMessage: "Please provide text for the comment."})
      }
    } else {
      res.status(404).json({ message: 'The post with the specified ID does not exist.' });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(404).json({
      message: "The post with the specified ID does not exist.",
    });
  });  
});

router.delete('/:id', (req, res) => {

  PostsDataBase.findById(req.params.id)
  .then(post => {
    if (post.length > 0) {
      PostsDataBase.remove(req.params.id)
      .then(count => {
        if (count > 0) {
          res.status(200).json(post);
        }
      })
    } else {
      res.status(404).json({ message: 'The post with the specified ID does not exist.' });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: "The post could not be removed"
    });
  });
});
  
  router.put('/:id', (req, res) => {
    
    const changes = req.body;

    if(!changes.text && !changes.contents){
      res.status(400).json({errorMessage: "Please provide title and contents for the post."})
    } else {
      PostsDataBase.update(req.params.id, changes)
      .then(hub => {
        if (hub) {  
          PostsDataBase.findById(req.params.id)
          .then(hub =>{
            res.status(200).json(hub);
          })
          .catch(err =>{
            res.status(500).json({errorMessage: "error reading the updated  "})
          })
        } else {
          res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
      })
      .catch(error => {
        // log error to database
        console.log(error);
        res.status(500).json({
          error: "The post information could not be modified."
        });
      });
    }
    
  });

module.exports = router;