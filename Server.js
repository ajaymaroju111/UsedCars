const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Authroutes = require('./Routes/Authroutes.js');
const TenantRoutes = require('./Routes/TenantRoutes.js');
const CarRoutes = require('./Routes/CarRoutes.js');
const connectDB = require('./Databases/DBconnect.js');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// Load Swagger YAML
// Load Swagger YAML file
const swaggerDocument = YAML.load('./api.yaml');
const Port = process.env.PORT || 3000;

// Connect to Database
connectDB().catch(err => {
  console.error('Failed to connect to the database:', err);
  process.exit(1);
});

const app = express();

// Set up Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  headers: true,
});
app.use(limiter);

// Enable CORS
app.use(cors({
  origin: '*', // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/auth', Authroutes);
app.use('/api/tenants', TenantRoutes);
app.use('/api/cars', CarRoutes);

// Start Server
app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
  console.log(`Swagger Docs available at http://localhost:${Port}/api-docs`);
});