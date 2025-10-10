const { sequelize } = require('../db');
const User = require('../db').User || require('../db').User;

(async () => {
  try {
    await sequelize.authenticate();
    const u = await User.create({ email: 'a@b.com', username: 'yoni', password: 'secret' });
    console.log('OK:', u.id, u.email, u.username, u.password);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();