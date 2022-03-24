const chai = require("chai");
const request = require("supertest");

const {sequlizeConn} = require("./../../sequelize");
const app = require("./../../server");
const {expect} = chai;
const should = chai.should();
const agent = request(app);

var Book = "";
var User = "";

try {
  Book = require("./../../models").Book;
} catch (error) {
  Book = {};
}

try {
  User = require("./../../models").User;
} catch (error) {
  User = {};
}

describe("book api", () => {
  before(async () => {
    await sequlizeConn.sync();
    await Book.destroy({where : {}, truncate:true});
    await User.destroy({where : {}, truncate:true});

    const user = await User.create({
      username:"123test",
      password:"123test",
      email:"test123@gmail.com"
    });
    
    // const res = await agent.post("/signin")
    // .send({ username:user.username, password:user.password });

    // console.log(JSON.stringify(res.body,null,2));
    // expect(res.statusCode).to.equal(200);
    // expect('Location','/books');
  });
  
  describe("/Get books", () => {
    it("Getting all books", async () => {
      const res = await agent.get("/books");
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.a('array');
    });
  });
  
  describe("/Post books",function () {
    it("Insert new book",function (done) {
      var book = {
        title :"Jack Ma",
        author : "Chen Wei",
        category :"Biography" 
      };
      
      agent.post("/books")
      .send(book)
      .end(function (err,res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.a('object');
        done();
      });
    });
  });

  describe("/Delete books",function () {
    it("Delete book by id",function (done) {
      var book = {
        title :"Jack Ma",
        author : "Chen Wei",
        category :"Biography" 
      };

      Book.create(book)
      .then(function (_bk) {
        agent.delete("/books/"+ _bk.id)
        .send(book)
        .end(function (err,res) {
          if(err) done(err);
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.equal(true);
          done();
        });
      });
    });
  });

  describe("/Get/:id books",function () {
    it("Get Book by id",function (done) {
      var book = {
        title :"Jack Ma",
        author : "Chen Wei",
        category :"Biography" 
      };

      Book.create(book)
      .then(function (_bk) {
        agent.get("/books/" + _bk.id)
        .end(function (err,res) {
          if(err) done(err);
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.a('object');
          done();
        });
      })
      
    });
    it("Get Book by not existed id",function (done) {
      agent.get("/books/100")
      .end(function (err,res) {
        expect(res.statusCode).to.equal(400);
        expect(res.text).equal('Book not found');
        done();
      });
    });
    it("Get Book by invalid id",function (done) {
      agent.get("/books/abc")
      .end(function (err,res) {
        expect(res.statusCode).to.equal(400);
        expect(res.text).equal('Invalid id supplied');
        done();
      });
    });
  });

  describe("/Put/:id books",function () {
    it("Update book by id",function (done) {
      var book = {
        title :"Jack Ma",
        author : "Chen Wei",
        category :"Biography" 
      };
      var bookEdit = {
        title :"Jack Ma 3",
        author : "Chen Wei 3",
        category :"Biography 3" 
      };

      Book.create(book)
      .then(function (_bk){
        agent.put("/books/" + _bk.id)
        .send(bookEdit)
        .end(function (err,res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.a('array');
          done();
        });
      });
    });
  }); 

});