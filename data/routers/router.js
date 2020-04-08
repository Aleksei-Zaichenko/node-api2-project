const express = require('express');

const Lambda = require('../db.js');

const router = express.Router();

router.get('/', (req, res) => {
  Lambda.find(req.query)
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
  Lambda.findById(req.params.id)
  .then(post => {
    if (post.length > 0) {
      console.log(post);
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
  Lambda.findPostComments(req.params.id)
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
    Lambda.insert(req.body)
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
  Lambda.findById(req.params.id)
  .then(post => {
    if (post.length > 0) {
      if(req.body.text){
        Lambda.insertComment(req.body)
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

  // router.delete('/:id', (req, res) => {
  //   Hubs.remove(req.params.id)
  //   .then(count => {
  //     if (count > 0) {
  //       res.status(200).json({ message: 'The hub has been nuked' });
  //     } else {
  //       res.status(404).json({ message: 'The hub could not be found' });
  //     }
  //   })
  //   .catch(error => {
  //     // log error to database
  //     console.log(error);
  //     res.status(500).json({
  //       message: 'Error removing the hub',
  //     });
  //   });
  // });
  
  // router.put('/:id', (req, res) => {
  //   const changes = req.body;
  //   Hubs.update(req.params.id, changes)
  //   .then(hub => {
  //     if (hub) {
  //       Hubs.findById(req.params.id)
  //       .then(hub =>{
  //         res.status(200).json(hub);
  //       })
  //       .catch(err =>{
  //         res.status(500).json({errorMessage: "error reading the updated  "})
  //       })
  //     } else {
  //       res.status(404).json({ message: 'The hub could not be found' });
  //     }
  //   })
  //   .catch(error => {
  //     // log error to database
  //     console.log(error);
  //     res.status(500).json({
  //       message: 'Error updating the hub',
  //     });
  //   });
  // });

module.exports = router;