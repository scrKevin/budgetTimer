const mongoose = require('mongoose');
const userModel = mongoose.model('User');
const accountModel = mongoose.model('Account')
const recurringModel = mongoose.model('Recurring')

exports.list_all_users = (req, res) => {
  //console.log("req. list all users")
  userModel.find({}, (err, users) => {
    if (err) res.send(err);
    res.json(users);
  });
};

exports.create_a_user = (req, res) => {
  console.log(req.body)
  const newUser = new userModel(req.body);
  newUser.save(async (err, user) => {
    if (err) res.send(err);
    const token = await user.generateAuthToken()
    res.status(201).json({ token });
  });
};

exports.login_user = async (req, res) => {
  try {
    const user = await userModel.findOne({ emailAddress: req.body.emailAddress })
    if (!user) {
      throw new Error({ error: "Invalid login details" });
    }
    var match = await user.comparePassword(req.body.password)//, async function(match) {
    if (!match) {
      throw new Error({ error: "Invalid login details" });
    }
    const token = await user.generateAuthToken();
    res.status(201).json({ token });
    //})
    
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

exports.logout_user = async (req, res) => {
  try {
    //console.log(req)
    var user = await userModel.findOne({_id: req.body._id})
    //console.log(user)
    user.tokens = user.tokens.filter((token) => {
      return token.token != req.body.token
    })
    await user.save()
    res.send()
  } catch (error) {
      res.status(500).send(error)
  }
}

exports.getUserDetails = async (req, res) => {
  await res.json(req.userData);
};

exports.get_a_user = (req, res) => {
  userModel.findById(req.params.userId, (err, user) => {
    if (err) res.send(err);
    res.json(user);
  });
};

exports.update_a_user = (req, res) => {
  userModel.findOneAndUpdate(
    { _id: req.params.userId },
    req.body,
    { new: true },
    (err, user) => {
      if (err) res.send(err);
      res.json(user);
    }
  );
};

exports.delete_a_user = (req, res) => {
  userModel.deleteOne({ _id: req.params.userId }, err => {
    if (err) res.send(err);
    res.json({
      message: 'user successfully deleted',
     _id: req.params.userId
    });
  });
};