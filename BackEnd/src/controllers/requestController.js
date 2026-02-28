const Connectionreq = require("../models/connectionreq");
const User = require("../models/user");

//get all the pending connection requests
exports.getPendingRequests = async (req, res) => {
    try {
        const LoggedinUser = req.user;
        const connection = await Connectionreq.find({
            ReciverId: LoggedinUser._id,
            status: "interested",
        })
            .populate("senderId", ["firstName", "lastName", "profile"])
            .populate("ReciverId", ["profile"]);

        if (connection.length === 0) {
            return res.status(400).json({ message: "NO connection request Found" });
        }
        res.json({
            message: "Data fetched sucessfully",
            data: connection,
        });
    } catch (err) {
        res.status(400).json({
            message: "ERROR" + err.message,
        });
    }
};

//get user connections
exports.getUserConnections = async (req, res) => {
    try {
        const LoggedinUser = req.user;
        const connectionreq = await Connectionreq.find({
            $or: [
                { ReciverId: LoggedinUser._id, status: "accepted" },
                { senderId: LoggedinUser._id, status: "accepted" },
            ],
        })
            .populate("senderId", "firstName lastName age gender profile Bio profession")
            .populate("ReciverId", "firstName lastName age gender profile Bio profession");

        if (connectionreq.length === 0) {
            return res.json({
                message: "Connection not Found",
            });
        }
        //check from user or touser show their connection
        const data = connectionreq.map((row) => {
            if (row.senderId._id.toString() === LoggedinUser._id.toString()) {
                return row.ReciverId;
            } else {
                return row.senderId;
            }
        });
        res.json({
            message: "Your Connections",
            data,
        });
    } catch (err) {
        res.status(400).json({
            message: "Invalid Request",
        });
    }
};

//Get all data feed
exports.getFeed = async (req, res) => {
    try {
        const LoggedinUser = req.user;

        //give page limit
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectionreq = await Connectionreq.find({
            $or: [{ senderId: LoggedinUser._id }, { ReciverId: LoggedinUser._id }],
        }).select("senderId ReciverId");

        //collect not sending id
        const hiddenuserId = new Set();
        //filtering that value
        connectionreq.forEach((req) => {
            hiddenuserId.add(req.senderId.toString());
            hiddenuserId.add(req.ReciverId.toString());
        });

        const user = await User.find({
            $and: [
                //find in user db which user is not present in hiddenuserId send that
                { _id: { $nin: Array.from(hiddenuserId) } },
                //and not send loggedin user profile
                { _id: { $ne: LoggedinUser._id } },
            ],
        })
            .select("firstName lastName age gender Bio skills profession profile")
            .skip(skip)
            .limit(limit);

        res.json({ data: user });
    } catch (err) {
        res.status(400).json({
            message: "ERROR" + err.message,
        });
    }
};
