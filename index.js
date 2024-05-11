const express = require('express');
const port = 8000;
const app = express();

// app.get("/",function(req,res)
// {
//     res.send("<h1>It is running!</h1>");
// });

app.listen(port, function(err)
{
    if(err) {
        console.log("error in starting the server");
        return;
    }
    console.log(`Server running fine on port ${port}`);
})