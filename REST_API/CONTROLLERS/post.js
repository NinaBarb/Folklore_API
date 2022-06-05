const dbOperations = require('../DAL/postOperations');

async function addConditionsToPost(postsOBJs, choiceIDs) {
    for (const postsOBJ of postsOBJs) {
        if (postsOBJ.conditions) {
            for (const condition of postsOBJ.conditions) {
                await dbOperations.addConditionToPost(postsOBJ.postID, choiceIDs[condition])
            }
        }
    }
}

async function addPostsToStory(storyID, posts) {
    var choiceIDs = []
    var postsOBJs = []
    for (const post of posts) {
        var postID = await dbOperations.createPost(post.content, post.imageBlob, storyID);
        postsOBJs.push({ "postID": postID, "conditions": post.conditions });
        if (post.choices) {
            // post.choices.forEach(async choice => {
            //     let id = await dbOperations.createChoice(choice.choiceValue, postID)
            //     choiceIDs.push(id);
            // });
            for (const choice of post.choices) {
                let id = await dbOperations.createChoice(choice.choiceValue, postID)
                choiceIDs.push(id);
            }
        }
    }
    addConditionsToPost(postsOBJs, choiceIDs)
}

async function addWarningsToStory(storyID, warnings) {
    for (const warningID of warnings) {
        await dbOperations.addWarningToPost(warningID, storyID)
    }

}

exports.createStory = async (req, res) => {
    console.log(req.body);
    const { title, summary, posts, userID, image, warnings } = req.body;
    var storyID = await dbOperations.createStory(title, summary, image, userID);
    if (posts != null) {
        addPostsToStory(storyID, posts)
    }
    if (warnings != null) {
        addWarningsToStory(storyID, warnings)
    }
    // for (const post of posts) {
    //     var postID = await dbOperations.createPost(post.content, null, storyID);
    //     postsOBJs.push({ "postID": postID, "conditions": post.conditions });
    //     if (post.choices) {
    //         post.choices.forEach(async choice => {
    //             let id = await dbOperations.createChoice(choice.choiceValue, postID)
    //             choiceIDs.push(id);
    //         });
    //         // for (const choice in post.choices) {
    //         //     let id = await dbOperations.createChoice(choice.choiceValue, postID)
    //         //     choiceIDs.push(id);
    //         // }
    //     }
    // }
    // for (const postsOBJ of postsOBJs) {
    //     if (postsOBJ.conditions) {
    //         for (const condition of postsOBJ.conditions) {
    //             await dbOperations.addConditionToPost(postsOBJ.postID, choiceIDs[condition])
    //         }
    //     }
    // }
}

exports.getWarnings = async (req, res) => {
    res.status(200).send(await dbOperations.getWarnings());
}

exports.getPosts = async (req, res) => {
    res.status(200).send(await dbOperations.getPosts());
}

exports.getStories = async (req, res) => {
    res.status(200).send(await dbOperations.getStories());
}

exports.getTrendingStories = async (req, res) => {
    res.status(200).send(await dbOperations.getTrendingStories());
}

exports.getStoryById = async (req, res) => {
    const idStory = req.query.idStory;
    res.status(200).send(await dbOperations.getStoryById(idStory));
}

exports.getStoryComments = async (req, res) => {
    const idStory = req.query.idStory;
    res.status(200).send(await dbOperations.getStoryComments(idStory));
}

exports.getPostByChoiceId = async (req, res) => {
    const idChoice = req.query.idChoice;
    res.status(200).send(await dbOperations.getPostByChoiceId(idChoice));
}

exports.addCommentToStory = async (req, res) => {
    const { comment, userID, idStory } = req.body;
    try {
        await dbOperations.addCommentToStory(comment, userID, idStory)
        res.status(200).send({ message: "Comment added to story" });
    } catch (error) {
        return res.status(400).send(error);
    }
}

exports.addScoreToStory = async (req, res) => {
    const { score, userID, idStory } = req.body;
    console.log(req.body)
    try {
        await dbOperations.addScoreToStory(score, userID, idStory)
        res.status(200).send({ message: "Score added to story" });
    } catch (error) {
        return res.status(400).send(error);
    }
}

exports.getUserStoryScore = async (req, res) => {
    const { userID, idStory } = req.body;
    console.log(req.body)
    try {
        res.status(200).send(await dbOperations.getUserStoryScore(userID, idStory));
    } catch (error) {
        return res.status(400).send(error);
    }
}