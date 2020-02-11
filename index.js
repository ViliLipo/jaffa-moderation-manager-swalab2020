const express = require('express');
const bodyParser = require('body-parser');
const moderationRouter = require('./controllers/moderation.js');
const { mqSend, registerReceiver } = require('./interservice/machinequeue.js');
const database = require('./models/database.js');

const moderationEventQueue = 'moderation_event_queue';


const app = express();
app.use(bodyParser.json());
app.use('/api/moderation', moderationRouter);
const port = 3003;


database
  .authenticate()
  .then(() => {
    console.log('Connection to database has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
