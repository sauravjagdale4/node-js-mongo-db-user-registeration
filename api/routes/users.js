const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, Math.random().toString(36) + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2
  },
  fileFilter: fileFilter
});

const User = require("../models/user");

router.get("/:userName", (req, res, next) => {
  const userName = req.params.userName;
  User.findOne({ userName: userName })
    .select("userName mobileNumber profilePicPath")
    .exec()
    .then(doc => {
      if (doc) {
        const response = {
          userName: doc.userName,
          mobileNumber: doc.mobileNumber,
          profilePicPath: doc.profilePicPath
        };
        res.status(200).json(response);
      } else {
        res
          .status(404)
          .json({ error: { message: "No valid entry found for provided ID" } });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", upload.single("profilePicPath"), (req, res, next) => {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    userName: req.body.userName,
    mobileNumber: req.body.mobileNumber,
    profilePicPath: req.file.path
  });
  user
    .save()
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err => {
      res.status(500).json({
        error: {
          message: err.errmsg
        }
      });
    });
});
module.exports = router;
