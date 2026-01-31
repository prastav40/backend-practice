const express = require('express');
const app = express();
const mongodb = require('./config/mongo');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const connectionstatus=require("../src/routes/connectionstatus")
const userstaus=require("../src/routes/user")

app.use(express.json());
app.use(cookieParser());


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/",connectionstatus)
app.use("/",userstaus)


// --- DATABASE CONNECTION ---
mongodb().then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.error('Failed to connect to the database', err);
});