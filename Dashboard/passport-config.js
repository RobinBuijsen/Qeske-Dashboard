const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Dummy gebruikersdata (later vervangen door database)
const users = [
  { id: 1, username: 'admin', password: '$2a$10$XXXXXXXXXXXXXXXXXXXXXXX', role: 'admin' }, // Hashed wachtwoord
  { id: 2, username: 'user', password: '$2a$10$XXXXXXXXXXXXXXXXXXXXXXX', role: 'user' },
];

function initialize(passport) {
  const authenticateUser = async (username, password, done) => {
    const user = users.find(user => user.username === username);

    if (!user) {
      return done(null, false, { message: 'Geen gebruiker gevonden met deze gebruikersnaam.' });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Wachtwoord incorrect.' });
      }
    } catch (err) {
      return done(err);
    }
  };

  passport.use(new LocalStrategy(authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    const user = users.find(user => user.id === id);
    return done(null, user);
  });
}

module.exports = initialize;
