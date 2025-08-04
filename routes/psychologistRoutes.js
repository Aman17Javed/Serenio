const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const Psychologist = require("../models/psychologist");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.put(
  "/psychologists/profile-picture/:id",
  verifyToken,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const psychologist = await Psychologist.findById(req.params.id);
      if (
        !psychologist ||
        psychologist.userId.toString() !== req.user.userId ||
        req.user.role !== "Psychologist"
      ) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      psychologist.imageUrl = imageUrl;
      await psychologist.save();

      res.status(200).json({ message: "Profile picture updated", imageUrl });
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


router.get("/psychologists", verifyToken, async (req, res) => {
  try {
    const psychologists = await Psychologist.find().select(
      "_id name specialization rating reviews experience availability imageUrl hourlyRate sessionPrice bio"
    );
    console.log("Psychologists returned:", JSON.stringify(psychologists, null, 2));
    res.status(200).json(psychologists);
  } catch (err) {
    console.error("Error fetching psychologists:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// router.get('/:id', verifyToken, async (req, res) => {
//   try {
//     const psychologist = await Psychologist.findById(req.params.id);
//     if (!psychologist) {
//       return res.status(404).json({ message: "Psychologist not found" });
//     }
//     res.json(psychologist);
//   } catch (error) {
//     console.error("Error fetching psychologist:", error);
//     res.status(500).json({ message: "Failed to fetch psychologist", error: error.message });
//   }
// });

module.exports = router;