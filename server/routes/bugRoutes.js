const express = require("express");
const router = express.Router();

const {
    createBug,
    getAllBugs,
    getMyBugs,
    updateBugStatus,
    deleteBug,
    assignBug,
    getBugStats
} = require("../controllers/bugController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createBug);

router.get("/", protect, getAllBugs);
router.get("/my", protect, getMyBugs);

router.get("/stats", protect, getBugStats);

router.put("/:id", protect, updateBugStatus);

// 🔥 Assign bug to a user
router.put("/:id/assign", protect, assignBug);

router.delete("/:id", protect, deleteBug);

module.exports = router;