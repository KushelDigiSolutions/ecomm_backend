const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.urlencoded({ extended: false }));
const {cloudinaryConnect} = require("./config/cloudinary");

app.use(express.json());
app.use(cors());

const port = 4000;

const cookieParser = require("cookie-parser");

app.use(cookieParser());


  // connect to cloudinary 
cloudinaryConnect();
  
const dbConnect = require("./config/database");
dbConnect();


const user = require('./routers/userRouter');

const product = require('./routers/productRouter');

const cart = require('./routers/cartRouter');

app.use('/api/v1' , cart);

app.use('/api/v1' , user);

app.use('/api/v1' , product);





// app.get("/", (req, res) => {
//     res.send('this is hlw world');
// });

// app.get("/about",(req,res)=>{
//     res.send("this is about page");
// })

// app.get("/service",(req,res)=>{
//     res.send("this is service page");
// })

// app.get("/contact",(req,res)=>{
//     res.send("this is contact page");
// })


app.listen(port, () => {
    console.log(`app listening on port ${port}`);
})


