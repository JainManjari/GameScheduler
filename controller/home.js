module.exports.home = async function(req, res) {
    try {
        return res.render("home");
    } catch(error) {
        console.log("error in loading home controller ", error);
        return;
    } 
}