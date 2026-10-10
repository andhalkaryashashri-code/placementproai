const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================

exports.register = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      branch,
      year,
      college
    } = req.body;

    const existingUser = await User.findOne({
      email
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({

      name,
      email,
      password: hashedPassword,

      branch: branch || "Information Technology",

      year: year || "Third Year",

      college: college || "Trinity Academy of Engineering",

      role: "student"

    });

    res.status(201).json({

      success: true,

      message: "Student Registered Successfully",

      user

    });

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

};

// ================= LOGIN =================

exports.login = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    // ================= ADMIN =================

    if (
      email === "admin" &&
      password === "admin123"
    ) {

      const token = jwt.sign(

        {
          role: "admin"
        },

        process.env.JWT_SECRET,

        {
          expiresIn: "7d"
        }

      );

      return res.json({

        success: true,

        token,

        user: {

          name: "Administrator",

          email: "admin",

          role: "admin"

        }

      });

    }

    // ================= TEACHER =================

    if (
      email === "teacher" &&
      password === "teacher123"
    ) {

      const token = jwt.sign(

        {
          role: "teacher"
        },

        process.env.JWT_SECRET,

        {
          expiresIn: "7d"
        }

      );

      return res.json({

        success: true,

        token,

        user: {

          name: "Teacher",

          email: "teacher",

          department: "Computer Science",

          role: "teacher"

        }

      });

    }

    // ================= STUDENT =================

    const user = await User.findOne({

      email,

      role: "student"

    });

    if (!user) {

      return res.status(400).json({

        message: "Student not found"

      });

    }

    const match = await bcrypt.compare(

      password,

      user.password

    );

    if (!match) {

      return res.status(400).json({

        message: "Invalid Password"

      });

    }

    const token = jwt.sign(

      {

        id: user._id,

        role: user.role

      },

      process.env.JWT_SECRET,

      {

        expiresIn: "7d"

      }

    );

    res.json({

      success: true,

      token,

      user: {

        _id: user._id,

        name: user.name,

        email: user.email,

        branch: user.branch,

        year: user.year,

        college: user.college,

        role: user.role

      }

    });

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

};