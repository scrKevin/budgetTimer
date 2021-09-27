const mongoose = require('mongoose'),
  encrypt = require('mongoose-encryption'),
  Schema = mongoose.Schema,
  uniqueValidator = require('mongoose-unique-validator'),
  Account = require('./accountModel'),
  bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({

  //Our password is hashed with bcrypt
  password: { type: String, required: true },
  emailAddress: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  emailValidated: {type: Boolean, default: true},
  active: {type: Boolean, default: true},

  accounts: [Account],

  },{
    timestamps:true
  });


// testing!!


// production:
// var encKey = process.env.SOME_32BYTE_BASE64_STRING;
// var sigKey = process.env.SOME_64BYTE_BASE64_STRING;

userSchema.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey });
// This adds _ct and _ac fields to the schema, as well as pre 'init' and pre 'save' middleware,
// and encrypt, decrypt, sign, and authenticate instance methods

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

UserSchema.pre("save", function(next) {
  if(!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, SALT_WORK_FACTOR);
  next();
});

UserSchema.methods.comparePassword = function(plaintext, callback) {
  return callback(null, bcrypt.compareSync(plaintext, this.password));
};

module.exports = mongoose.model("User", UserSchema);