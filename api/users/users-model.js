const db = require('../../data/db-config')

//End of imports

//start of model
const find = async() => {
	const results = await db('users')
		.select('user_id', 'username')
	return results
}
const findBy = async (filter) => {
	const results = await db('users as u')
	.select("user_id", "username", "password")
	.where(filter)
	.first()
	return results;  
}
const findById = async (user_id) => {
	const results = await db ('users as u')
		.where("u.user_id" , user_id)
		.first()
		.select("u.user_id", "u.username")
	return results
}
//Check the purpose [id] if broken//after the project.
const add = async (user) => {
  const [id] = await db('users').insert(user)
  return findById(id)

}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {
  find,
  findBy,
  findById,
  add
}