const express = require('express');
const mongoose = require('mongoose');

const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');

const app = express();
const PORT = 3000;
const DB = "mongodb://127.0.0.1:27017/amazon-clone"; // "mongodb+srv://...<url>"; // we are making offline db for now

app.use(express.json());
app.use(authRouter);
app.use(adminRouter)
app.use(productRouter)
app.use(userRouter)


mongoose.connect(DB).then(()=>{
    console.log("Connection established with database!");
}).catch((e)=>{
    console.log(e);
});

app.listen(PORT,"0.0.0.0",()=>{
    console.log(`listening on port ${PORT}`);
});