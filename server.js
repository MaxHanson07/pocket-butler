// Require Modules
const express = require('express');

// Server Port
const PORT = process.env.PORT || 8080;

const app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Requiring our models for syncing
const db = require('./models');

// Parse application body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Handlebars

const exphbs = require("express-handlebars");



app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes
require("./routes/authentication-routes.js")(app);
require("./routes/user-api-routes.js")(app);
require("./routes/html-routes.js")(app);
require("./routes/task-api-routes.js")(app);
//require("./sendEmail")(app);
//require("./sendText")(app);

// Syncing our sequelize models and then starting our Express app
db.sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log('App listening on PORT http://localhost:' + PORT);
    });
});