require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const morgan = require("morgan");

const app = express();
const keys=["jkhiguuyfguyk"];
const port = process.env.APP_PORT || 8080;
const ENV = process.env.APP_ENV || "prod";
const routesv1 = require("./routes");
const { User, Book } = require("./models");
const { comparePassword } = require("./utils/helpers");

if(ENV === "dev") {
  app.use(morgan("tiny"));
}

app.set("ENV",ENV);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:"applicatin/json"}));
app.use(express.static("public"));
app.use(cookieParser(keys));
app.use(cookieSession({
  name:"session",
  maxAge:24 * 60 * 60 * 1000,
  keys
}));

app.use("/api/v1",routesv1);

app.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username: username } });
  if (user) {
    const validPassword = await bcrypt.compare(password, user.get("password"));
    if (validPassword) {
      res.redirect('/books');
    } else {
      res.statusCode(400);
    }
  } else {
    res.statusCode(401);
  }
});


app.get('/books',
  async (req, res) => {
    const books = await Book.findAll({
      attributes: ['id', 'title', 'author', 'category']
    });
    res.send(books)
  }
);

app.get('/books/:id',
  async (req, res) => {
    let id = req.params.id;

    if(isNaN(parseInt(id))) {
      return res.status(400).send("Invalid id supplied");
    }
    
    try {
      const book = await Book.findById(id);
      if(!book) {
        return res.status(400).send("Book not found");
      }
     return res.status(200).json({ book });
    } catch (err) {
      return res.status(400).json({ err })
    }
  }
);

app.post('/books', async (req, res) => {
  let { title, author, category } = req.body
  const book = await Book.create({
    title,
    author,
    category
  });
  res.send(book);
});

app.put('/books/:id',
  async (req, res) => {
    let { title, author, category } = req.body
    let id = req.params.id

    try {
      const book = await Book.findOne({ where: { id: id } });
      if (book) {
        const updateUser = await book.update({ title, author, category });
        return res.status(200).json([updateUser]);
      } else {
        return res.status(206).json({
          "message": "Book not found"
        });
      }
    } catch (error) {
      return res.status(400).json({
        "error": error
      });
    }
  }
)


app.delete('/books/:id',
  async (req, res) => {
    let id = req.params.id
    try {
      await Book.destroy({ where: { id: id } });
      return res.status(200).send(true);
    } catch (error) {
      return res.status(400).json({ error })
    }
  }
);

app.delete('/books',
  async (req, res) => {
    try {
      await Book.destroy({ truncate: true });
        
      return res.status(200).json({
        success: true,
        "message": "All Users deleted"
      });
    } catch (error) {
      return res.status(400).json({
        err
      });
    }
  }
)


module.exports = {
  app, port
};
