const mongoose = require('mongoose'),
  encrypt = require('mongoose-encryption'),
  jwt = require("jsonwebtoken"),
  Schema = mongoose.Schema,
  uniqueValidator = require('mongoose-unique-validator'),
  Account = require('./accountModel').schema,
  bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({

  //Our password is hashed with bcrypt
  password: { type: String, required: true },
  emailAddress: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  emailValidated: {type: Boolean, default: true},
  active: {type: Boolean, default: true},

  accounts: [Account],
  tokens: [
    {
      token: {
        type: String,
        required: true,
      }
    }
  ]

  },{
    timestamps:true
  });


// testing!!
var encKey = "GBECtivrk7x5roBnTlcgq+NiZwKnwkhXHdIBR6SLXg4="
var sigKey = "KKFkr0bN3+o5j4D6D2BEFFHlviH9Up4bti5Cu4ij8C43tiKrwvhkzW7780SIfype7JbvCaL4dd253cbqxOUR4A=="

var tokenSecret = 'secret'

// production:
// var encKey = process.env.SOME_32BYTE_BASE64_STRING;
// var sigKey = process.env.SOME_64BYTE_BASE64_STRING;

// UserSchema.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey, excludeFromEncryption: ['password'] });
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

UserSchema.methods.comparePassword = async function(plaintext) {
  return await bcrypt.compareSync(plaintext, this.password);
};

function checkTokenValidity(token) {
  if (token) {
    try {
      var decodedToken = jwt.verify(token, tokenSecret);
      return decodedToken && (decodedToken.exp * 1000) > new Date().getTime()
    } catch {
      return false
    }
  
  }
  return false
}

//this method generates an auth token for the user
UserSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id, emailAddress: user.emailAddress }, tokenSecret, {expiresIn: '30d'});
  //console.log(token)
  user.tokens = user.tokens.concat({ token });
  
  user.tokens = user.tokens.filter((token) => {
    return checkTokenValidity(token.token)
  })
  await user.save();
  return token;
};

UserSchema.methods.editAccount = async function (accountId, body) {
  const user = this
  for (let account of user.accounts) {
    if (account._id == accountId) {
      account.name = body.name
      account.startbalance = body.startbalance
      break
    }
  }
  await user.save()
  return accountId
}

module.exports = mongoose.model("User", UserSchema);