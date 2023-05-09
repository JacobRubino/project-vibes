const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const winston = require('winston');
const expressWinston = require('express-winston');
const path = require('path')
const helpers = require('./utils/auth')
const cors = require('cors')
const {userLogger: logger} = require('./utils/logger');

const sequelize = require('./config/connection');
const { log } = require('console');
const SequelizeStore = require('connect-session-sequelize')(session.Store);



const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors())

const hbs = exphbs.create({ helpers });

const sess = {
  secret: 'Super secret secret',
  cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// // [ WINSTON ]  Capture 500 errors
// app.use((err, req, res, next) => {
//   res.status(500).send('INTERNAL SERVER ERROR (500))');
//   logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
// })

// // // [ WINSTON ]  Capture 404 erors
// app.use((req, res, next) => {
//   res.status(404).send("PAGE NOT FOUND (404))");
//   logger.error(`400 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
// })


app.use(routes);

// Run the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Server started and running on http://localhost:${PORT}`));
});
