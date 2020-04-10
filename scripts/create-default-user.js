module.exports = async (mongoose) => {
  const User = require("../controllers/models/User");

  const username = 'Bot';
  const password = '123';
  const defaultUser = await User.findOne({ username: username });

  if (defaultUser) {
    return;
  }

  const user = new User({
    username: username,
    password: password
  })

  await user.save((err) => {
    // mongoose.disconnect();

    if (err) {
      return console.error(err);
    }

    console.log('Saved', user);

  })
}
