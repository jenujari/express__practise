const {app, port} = require("./app");
const {sequlizeConn,ConnectionTest} = require("./sequelize");

const runServer = async () => {
  console.clear();
  try{
    
    await ConnectionTest();
    await sequlizeConn.sync();

    app.listen(port,() =>{
      console.log(`App is running on port :: ${port}`);
    });
  } catch(er) {
    console.log(`Error occured while running the server :: ${er.message}`);
  }
};

runServer();

module.exports = app;
