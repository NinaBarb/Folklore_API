const { user } = require('../DAL/dbConfig');
const dbOperations = require('../DAL/userOperations');


exports.getUser = async (req, res) => {
    var user = await dbOperations.getUser(req.body.userID);
    var blogs = await dbOperations.getUserBlogs(req.body.userID);
    var stories = await dbOperations.getUserStories(req.body.userID);
    var user = {
        username: user.Username,
        email: user.Email,
        blogs: blogs,
        stories: stories
    }
    res.status(200).send(user);
    // res.status(200).send(JSON.parse(json));
}

exports.deleteUser = async (req, res) => {
    try {
        var user = await dbOperations.deleteUser(req.body.userID);
        res.clearCookie("jwt");
        res.status(200).send({ message: "User deleted" });
    } catch (error) {
        return res.status(400).send(error);
    }
}

exports.getSearchItems = async (req, res) => {
    try {
        res.status(200).send(await dbOperations.getSearchItems());
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.getUserLibrary = async (req, res) => {
    res.status(200).send(await dbOperations.getUserLibrary(req.body.userID));
}

exports.getUserBlogs = async (req, res) => {
    res.status(200).send(await dbOperations.getUserBlogs(req.body.userID));
}

exports.getUserStories = async (req, res) => {
    res.status(200).send(await dbOperations.getUserStories(req.body.userID));
}

exports.removeStoryFromUser = async (req, res) => {
    try {
        await dbOperations.removeStoryFromUser(req.body.userID, req.query.storyID)
        res.status(200).send({ message: "Story removed from library" });
    } catch (error) {
        return res.status(400).send(error);
    }
}

exports.addStoryToUserLibrary = async (req, res) => {
    try {
        await dbOperations.addStoryToUserLibrary(req.body.userID, req.query.storyID)
        res.status(200).send({ message: "Story added to library" });
    } catch (error) {
        return res.status(400).send(error);
    }
}

