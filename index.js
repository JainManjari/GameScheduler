const express = require('express');
const port = 8000;
const path = require('path');

const db = require('./config/mongoose');

const app = express();


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded());
app.use(express.static("assets"));

app.use('/', require('./routes'));

app.listen(port, function(err)
{
    if(err) {
        console.log("error in starting the server");
        return;
    }
    console.log(`Server running fine on port ${port}`);
})