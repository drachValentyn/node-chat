const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../controllers/models/User');
const settings = require('../config/settings');

module.exports = function (passport) {
  let opt = {};
  opt.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opt.secretOrKey = settings.secret;
  passport.use(new JwtStrategy(opt, function (jwt_payload, done) {
    User.findOne({id: jwt_payload.id}, function (err, user) {

      if (err) return done(err, false);

      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }

    })
  }))
};
