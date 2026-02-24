const express = require('express');
const cookieParser = require('cookie-parser');
const mongodb = require('./config/mongo'); 
const cors = require("cors");

// Import Routers
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const connectionStatus = require('./routes/connectionstatus');
const userStatus = require('./routes/user');

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // PATCH must be here
    credentials: true
}));


app.use(express.json()); // Parses incoming JSON bodies
app.use(cookieParser()); // Parses cookies for JWT/Auth

// --- 2. ROUTES ---
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionStatus);
app.use("/", userStatus);

// --- 3. START SERVER ---
mongodb()
  .then(() => {
    app.listen(3000, () => {
        console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database', err);
  });