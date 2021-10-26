const mongoose = require('mongoose');
const userModel = mongoose.model('User');
const accountModel = mongoose.model('Account')
const budgetModel = mongoose.model('Budget')
const recurringModel = mongoose.model('Recurring')
const transActionModel = mongoose.model('Transaction')

exports.list_all_users = (req, res) => {
  //console.log("req. list all users")
  userModel.find({}, (err, users) => {
    if (err) res.send(err);
    res.json(users);
  });
};

exports.create_a_user = (req, res) => {
  //console.log(req.body)
  const newUser = new userModel(req.body);
  newUser.save(async (err, user) => {
    if (err) res.send(err);
    const token = await user.generateAuthToken()
    res.status(201).json({ token });
  });
};

function normalize(parent) {
  if (parent) {
    delete parent._id
    for (let value of Object.values(parent)) {
      if (value !== null) {
        if (typeof(value) == 'object') {
          for (let child of value) {
            normalize(child)
          }
        }
      }
    }
    // for (var i = 0, l = parent.children.length; i < l; ++i) {
    //   var child = parent.children[i];
    //   //delete child._id
    //   normalize(child);
    // }
  }
}

exports.importAccounts = (req, res) => {
  if (req.userData._id == req.params.userId) {
    //console.log(req.body)
    userModel.findById(req.params.userId, (err, user) => {
      for (let account of req.body) {
        normalize(account)
        var newAccount = new accountModel(account)
        user.accounts.push(newAccount)
      }
      user.save(err => {
        res.status(201).json({message: "success"})
      })
    });
    
  } else {
    res.status(401).json({
      message: "Authentification Failed"
    });
  }
}

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