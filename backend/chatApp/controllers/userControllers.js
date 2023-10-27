const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const express = require("express");
const canvas = require("canvas");
const app = express();
const fileUpload = require("express-fileupload");
const bcrypt = require("bcryptjs");
const faceapi = require("face-api.js");
const fs = require("fs");

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

async function LoadModels() {
  await faceapi.nets.tinyFaceDetector.loadFromDisk(__dirname + "/models");
  await faceapi.nets.faceRecognitionNet.loadFromDisk(__dirname + "/models");
  await faceapi.nets.faceLandmark68Net.loadFromDisk(__dirname + "/models");
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(__dirname + "/models");
}
LoadModels();


async function uploadLabeledImages(images, email, name, password) {
  try {
    let counter = 0;
    const descriptions = [];
    for (let i = 0; i < images.length; i++) {
      const img = await canvas.loadImage(images[i]);
      counter = (i / images.length) * 100;
      console.log(`Progress = ${counter}%`);
      const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
      descriptions.push(detections.descriptor);
    }

    const user = new User({
      email: email,
      name: name,
      descriptions: descriptions,
      password: password
    });

    // Delete the temporary files
    for (const image of images) {
      fs.unlinkSync(image); // Delete the temporary file
    }

    await user.save(); // Use await to wait for the save operation to complete

    return true;
  } catch (error) {
    console.log(error);
    return error;
  }
}



async function getDescriptorsFromDB(image) {
  // Get all the face data from mongodb and loop through each of them to read the data
  let faces = await User.find();
  for (i = 0; i < faces.length; i++) {
    // Change the face data descriptors from Objects to Float32Array type
    for (j = 0; j < faces[i].descriptions.length; j++) {
      faces[i].descriptions[j] = new Float32Array(Object.values(faces[i].descriptions[j]));
    }
    // Turn the DB face docs to
    faces[i] = new faceapi.LabeledFaceDescriptors(faces[i].email, faces[i].descriptions);
  }

  // Load face matcher to find the matching face
  const faceMatcher = new faceapi.FaceMatcher(faces, 0.6);

  // Read the image using canvas or other method
  const img = await canvas.loadImage(image);
  let temp = faceapi.createCanvasFromMedia(img);
  // Process the image for the model
  const displaySize = { width: img.width, height: img.height };
  faceapi.matchDimensions(temp, displaySize);

  // Find matching faces
  const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
  const resizedDetections = faceapi.resizeResults(detections, displaySize);
  const results = resizedDetections.map((d) => faceMatcher.findBestMatch(d.descriptor));
  return results;
}



//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public

const allUsers = asyncHandler(async (req, res) => {
  console.log("req.query.search", req.query.search);
  const keyword = req.query.search
    ? {
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ],
    }
    : {};
  console.log("keyword", keyword);
  const users = await User.find(keyword);
  console.log("users", users);
  res.send(users);
});

//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = async (req, res) => {
  console.log(req.files.file1.tempFilePath);
  try {
    const File1 = req.files.file1.tempFilePath;
    const email = req.body.email;
    const password = req.body.password
    const name = req.body.name;
    console.log(email, password, name);

    // Upload labeled images and get the result
    const result = await uploadLabeledImages([File1], email, name, password);

    if (result) {
      res.json({ message: "Face data stored successfully" });
    } else {
      res.json({ message: "Something went wrong, please try again." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});



const faceAuthUser = async (req, res) => {
  console.log(req.files);
  try {
    const File1 = req.files.file1.tempFilePath;
    const result = await getDescriptorsFromDB(File1);
    console.log(result);
    // Delete the temporary file
    fs.unlinkSync(File1);
    if (result[0]._distance < 0.6) { // Change the condition to < 0.6
      const user = await User.findOne({ email: result[0]._label });

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: "Face not recognized" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
};




module.exports = { allUsers, registerUser, authUser, faceAuthUser };
