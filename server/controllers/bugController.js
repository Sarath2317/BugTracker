const Bug = require("../models/Bug");

// Create Bug (Protected)
const createBug = async (req, res) => {
    try {
        const { title, description, priority } = req.body;

        const bug = await Bug.create({
            title,
            description,
            priority,
            createdBy: req.user.id
        });

        res.status(201).json({
            message: "Bug Created Successfully",
            bug
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get All Bugs
const getAllBugs = async (req, res) => {
    try {
        const { status, priority, search } = req.query;

        let filter = {};

        // Filter by status
        if (status) {
            filter.status = status;
        }

        // Filter by priority
        if (priority) {
            filter.priority = priority;
        }

        // Search by title
        if (search) {
            filter.title = {
                $regex: search,
                $options: "i"
            };
        }

        const bugs = await Bug.find(filter)
            .populate("createdBy", "name email")
            .populate("assignedTo", "name email");

        res.status(200).json(bugs);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get My Bugs
const getMyBugs = async (req, res) => {
    try {
        const bugs = await Bug.find({
            createdBy: req.user.id
        })
            .populate("createdBy", "name email")
            .populate("assignedTo", "name email");

        res.status(200).json(bugs);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Update Bug Status
const updateBugStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const bug = await Bug.findById(id);

        if (!bug) {
            return res.status(404).json({
                message: "Bug not found"
            });
        }

        bug.status = status;

        await bug.save();

        res.status(200).json({
            message: "Bug status updated successfully",
            bug
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Assign Bug
const assignBug = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const bug = await Bug.findById(id);

        if (!bug) {
            return res.status(404).json({
                message: "Bug not found"
            });
        }

        bug.assignedTo = userId;

        await bug.save();

        res.status(200).json({
            message: "Bug assigned successfully",
            bug
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Delete Bug
const deleteBug = async (req, res) => {
    try {
        const { id } = req.params;

        const bug = await Bug.findById(id);

        if (!bug) {
            return res.status(404).json({
                message: "Bug not found"
            });
        }

        await bug.deleteOne();

        res.status(200).json({
            message: "Bug deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Dashboard Stats
const getBugStats = async (req, res) => {
    try {
        const totalBugs = await Bug.countDocuments();

        const openBugs = await Bug.countDocuments({
            status: "Open"
        });

        const resolvedBugs = await Bug.countDocuments({
            status: "Resolved"
        });

        const highPriorityBugs = await Bug.countDocuments({
            priority: "High"
        });

        res.status(200).json({
            totalBugs,
            openBugs,
            resolvedBugs,
            highPriorityBugs
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createBug,
    getAllBugs,
    getMyBugs,
    updateBugStatus,
    assignBug,
    deleteBug,
    getBugStats
};