const sqlite = require('sqlite'),
      Sequelize = require('sequelize'),
      request = require('request'),
      express = require('express'),
      app = express();

 const films = require('./routes/films');
 const models = require('./models');

 const { PORT=3000, NODE_ENV='development', DB_PATH='./db/database.db' } = process.env;

app.use('/films', films);
app.get('*', missingRouteHandler);

// START SERVER
Promise.resolve()
  .then(() => app.listen(PORT, () => console.log(`App listening on port ${PORT}`)))
  .catch((err) => { if (NODE_ENV === 'development') console.error(err.stack); });

function missingRouteHandler(req, res) {
   res.status(404).json({ message: 'Cannot be found' });
 }

// ROUTES
app.get('/films/:id/recommendations', getFilmRecommendations);

// ROUTE HANDLER
function getFilmRecommendations(req, res) {
 res.status(500).send('Not Implemented');
  const filmId = req.params.id;
   Film.findById(filmId)
     .then(film => res.json(film))
     .catch(err => { res.status(500).json({ message: err.message }) });
}

module.exports = app;
