const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require('swagger-jsdoc');
require("dotenv").config();
const routes = require('./routes/routes.js');

const app = express();
app.use(bodyParser.json());

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);



// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/projectsDB')
mongoose.connect('mongodb+srv://thisisjames007:MxG556UjM2nIR50v@cluster0.gs0bxym.mongodb.net/projectsDB')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


// Swagger options
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User API',
            version: '1.0.0',
            description: 'API documentation with Swagger',
        },
    },
    // Paths to files with API annotations
    apis: ['./controllers/*.js', './routes/*.js'],
};
const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));


// Routes
app.use('/api', routes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
