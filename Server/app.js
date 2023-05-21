// Import the necessary modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const app = express();

app.use(cors());

app.use(
  cors({
    origin: "http://localhost:3001",
  })
);

app.use(express.json());
const port = 3000;

// Connect to MongoDB database
mongoose
  .connect(
    "mongodb+srv://roshankumara:ptY9IjVwAvJKp9wL@cluster0.je5odxu.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Define a Mongoose schema and model  
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  profileImage: {
    type: String,
    required: false,
  },
});

const User = mongoose.model("User", userSchema);

// Configure multer storage for local file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

// Serve the "images" directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Implement CRUD routes
// Create a new user
app.post('/users', upload.single('profileImage'), async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const profileImage = req.file ? req.file.filename : '';

    // Create a new user instance
    const user = new User({
      name,
      email,
      age,
      profileImage,
    });

    // Save the user to the database
    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Read all users
app.get('/users', (req, res) => {
  User.find()
    .then((users) => {
      res.send(users);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Read a specific user
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send();
      }
      res.send(user);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Update a user
app.patch('/users/:id', (req, res) => {
  const id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'age'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send();
      }
      res.send(user);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

// Delete a user
app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  User.findByIdAndDelete(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send();
      }
      res.send(user);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
