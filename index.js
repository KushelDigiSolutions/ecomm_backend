const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const port = 5000;

app.get("/", (req, res) => {
    res.send('this is hlw world');
});

app.get("/about",(req,res)=>{
    res.send("this is about page");
})

app.get("/service",(req,res)=>{
    res.send("this is service page");
})

app.get("/contact",(req,res)=>{
    res.send("this is contact page");
})

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
})


