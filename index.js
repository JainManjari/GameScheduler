const express = require('express');
const port = 8000;
const path = require('path');
const app = express();


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.get("/",function(req,res)
{
    return res.render("home");
});

app.listen(port, function(err)
{
    if(err) {
        console.log("error in starting the server");
        return;
    }
    console.log(`Server running fine on port ${port}`);
})