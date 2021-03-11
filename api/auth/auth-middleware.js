const usersModel = require('../users/users-model')

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
const restricted =  () => async(req, res, next) => {
	try{
		if(!req.session || !req.session.chocolatechip){
			return res.status(401).json({message:"You shall not pass!"})
		}	
		next();
	}catch(err){
		next(err);
	}
}

//used for registration
const checkUsernameFree = () => async(req, res, next) => {
	try{
		const {username} = req.body
		const user = await usersModel.findBy({username})
		// console.log('user: ',user)
		if(user){
			return res.status(422).json({message:"Username taken"})
		}
		next();
	}catch(err){
		next();
	}
}
/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
//used for login?
const checkUsernameExists =  () => async(req, res, next) => {
	try{
		const {username} = req.body;
		const check = await usersModel.findBy({username});
			if(!check){
				return res.status(401).json({message: "Invalid credentials"})
			}
		next();
	}catch(err){
		next(err)
	}
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
const checkPasswordLength =  () => async(req, res, next) => {
	try{
		// console.log('password middleware ran')
		const {password} = req.body;
		// console.log('password length: ', password.length)
		if(!password || password.length < 4){
			return res.status(422).json({message: "Password must be longer than 3 chars"})
		}
		next();
	}catch(err){
	next()
	}
}

// Don't forget to add these to the `exports` object so they can be required in other modules


module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
}