const express = require('express');
const router = express.Router();
const {checkUsernameFree, checkPasswordLength, checkUsernameExists} = require('./auth-middleware');
const usersModel = require('../users/users-model')
const bcrypt = require('bcryptjs');
const { json } = require('express');

// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!

router.post("/register", checkUsernameFree(), checkPasswordLength(),  async(req,res,next)=>{
  try{
	//   console.log("Router Reached")
      const {username, password} = req.body;
      const addUser = await usersModel.add({
        username: username,
        password: await bcrypt.hash(password, 2)
      })
      res.status(201).json(addUser)
  }catch(err){
    next(err)
  }
})

  router.post("/login", checkUsernameExists(), async (req,res,next) =>{
    try{
		  // console.log("Router Reached")
		const {username, password} = req.body
		  // console.log(username, password, )
		const user = await usersModel.findBy({username})
		  // console.log("user", user)
		const passwordCheck = await bcrypt.compare(password, user.password)
		  // console.log("passwordCheck: ", passwordCheck)
		if (!user || passwordCheck === false ){
			return res.status(401).json({message: "Invalid credentials"})
		}

		req.session.chocolatechip = user;
		res.json({message: `Welcome ${user.username}`})
		// console.log('success')
  
    }catch(err){
      next(err)
    }
  })

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */
  router.get("/logout", async(req,res,next)=>{
    try{
      console.log(req.session)
      if(!req.session.chocolatechip){
        return res.status(200).json({message:"no session"})
      }
			req.session.destroy(err=>{
				if(err){
					next(err)
				}else{
					res.status(200).json({message:"logged out"})
				}
			})
    }catch(err){
      next(err)
    }
  })

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

 
// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router;