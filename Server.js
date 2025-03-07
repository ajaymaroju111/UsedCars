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
const Port = process.env.PORT || 3000;

connectDB();

const app = express();

//using express limiter for the 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  headers: true, // Send rate limit info in response headers
});

// Apply rate limiting to all requests
app.use(limiter);

//middlewares 
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Using routes from AuthRoutes : 
app.use('/api/auth', Authroutes);
app.use('/api/tenants', TenantRoutes);
app.use('/api/cars', CarRoutes);

// App is listening on the port : 
app.listen(Port, () => {
  console.log(`Server is running on the port ${Port}`);
});