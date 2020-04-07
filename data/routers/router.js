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

  // router.post('/', (req, res) => {
  //   Hubs.add(req.body)
  //   .then(hub => {
  //     res.status(201).json(hub);
  //   })
  //   .catch(error => {
  //     // log error to database
  //     console.log(error);
  //     res.status(500).json({
  //       message: 'Error adding the hub',
  //     });
  //   });
  // });
  
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

  // router.post('/:id/messages', (req, res) => {
  //   Hubs.addMessage(req.body)
  //       .then(message => {
  //           res.status(201).json(message);
  //   })
  //   .catch(error => {
  //     // log error to database
  //     console.log(error);
  //     res.status(500).json({
  //       message: 'Error adding the hub',
  //     });
  //   });
  // });

module.exports = router;