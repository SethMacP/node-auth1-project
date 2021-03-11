// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!
const model = require('./users-model');
const express = require('express')
const router = express.Router();
const {restricted} = require('../auth/auth-middleware')


//[]Middleware 'restricted' added
//[x]Returning Correct Values
//[]401 setup
router.get('/', restricted(), async(req,res,next)=>{
  try{
    const results = await model.find();
    res.status(200).json(results)

  }catch(err){
    next(err)
  }
})

router.get('/:id', async(req,res,next)=>{
  try{
    const results = await model.findById(req.params.id);
    res.status(200).json(results)

  }catch(err){
    next(err)
  }
})
/**
  [GET] /api/users

  This endpoint is RESTRICTED: only authenticated clients
  should have access.

  response:
  status 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response on non-authenticated:
  status 401
  {
    "message": "You shall not pass!"
  }
*/


// Don't forget to add the router to the `exports` object so it can be required in other modules

module.exports = router;