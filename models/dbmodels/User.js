const mongoose = require("mongoose");


/**
   username : username of user
   email    : email address of user
   password : password of user ( bcrypt )
   avatar   : url picture of user
   dateOfReg : date in which user registered
   verified  : if user has verified their email address
 **/


const UserSchema = new mongoose.Schema({
    username: {
	required : true,
	unique   : true,
	type     : String
    },
    email: {
	required : true,
	unique   : true,
	type     : String
    },
    password: {
	required : true,
	type     : String
    },
    avatar: String,
    dateOfReg: {
	default: Date.now(),
	type   : Number
    },
    verified: {
	default  : false,
	type     : Boolean
    },
    completeReg: {
	default  : false,
	type     : Boolean
    },
});

module.exports = mongoose.model("Users", UserSchema);
