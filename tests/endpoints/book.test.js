const chai = require("chai");
const request = require("supertest");

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



describe("book api", async () => {
  before(function(done) {
    Book.destroy({where : {}, truncate:true});
    User.destroy({where : {}, truncate:true});

    User.create({
      username:"123test",
      password:"123test",
      email:"test123@gmail.com"
    }).then(function(user){
      agent
      .get("/signin")
      .send({
        username:user.username,
        password:user.password
      }).end(function(err,res){
        expect(res.statusCode).to.equal(200);
        expect('Location','/books');
        done();
      });
    });
  });
  
  describe("/Get books",function () {
    it("Getting all books",function (done) {
      agent.get("/books")
      .end(function (err,res) {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();        
      });
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
        res.should.have.status(200);
        res.body.should.be.a('object');
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
        agent.delete("/books"+ _bk.id)
        .send(book)
        .end(function (err,res) {
          res.should.have.status(200);
          res.body.should.be.equal(1);
          done();
        });
        
      })

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
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
      })
      
    });
    it("Get Book by not existed id",function (done) {
      agent.get("/books/100")
      .end(function (err,res) {
        res.should.have.status(400);
        res.body.should.equal('Book not found');
        done();
      });
    });
    it("Get Book by invalid id",function (done) {
      agent.get("/books/abc")
      .end(function (err,res) {
        res.should.have.status(400);
        res.body.should.equal('Invalid id supplied');
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
        agent.put("/books" + _bk.id)
        .send(bookEdit)
        .end(function (err,res) {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
      });
    });
  });

});