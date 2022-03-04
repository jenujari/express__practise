const {app, port} = require("./app");

app.listen(port,() =>{
  console.log(`App is running on port :: ${port}`);
});


module.exports = app;