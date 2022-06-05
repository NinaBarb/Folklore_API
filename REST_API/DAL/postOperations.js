var config = require('./dbConfig');
const sql = require('mssql');
const { password } = require('./dbConfig');

sql.on('error', err => {
    console.log(err.message);
})

async function createStory(title, summary, image, userID) {
    try {
        let pool = await sql.connect(config);
        let users = await pool
            .request()
            .input('StoryName', sql.NVarChar(50), title)
            .input('Summary', sql.NVarChar(500), summary)
            .input('ImageBlob', sql.NVarChar(sql.MAX), image)
            .input('UserID', sql.Int, userID)
            .output('IDStory', sql.Int)
            .execute('createStory');
        return users.output.IDStory;
    } catch (err) {
        console.log(err.message);
    } finally {
    }
}
async function createPost(content, image, storyID) {
    try {
        let pool = await sql.connect(config);
        let users = await pool
            .request()
            .input('Content', sql.NVarChar(sql.MAX), content)
            .input('ImageBlob', sql.NVarChar(sql.MAX), image)
            .input('StoryID', sql.Int, storyID)
            .output('IDPost', sql.Int)
            .execute('createPost');
        return users.output.IDPost;
    } catch (err) {
        console.log(err.message);
    } finally {
    }
}

async function createChoice(content, postID) {
    try {
        let pool = await sql.connect(config);
        let users = await pool
            .request()
            .input('Content', sql.NVarChar(sql.MAX), content)
            .input('PostID', sql.Int, postID)
            .output('IDChoice', sql.Int)
            .execute('createChoice');
        return users.output.IDChoice;
    } catch (err) {
        console.log(err.message);
    } finally {
    }
}

async function getWarnings() {
    try {
        let pool = await sql.connect(config);
        let warnings = await pool
            .request()
            .execute('selectWarnings');
        return warnings.recordset;
    } catch (err) {
        console.log(err.message);
    } finally {
    }
}

async function getPosts() {
    try {
        let pool = await sql.connect(config);
        let posts = await pool
            .request()
            .execute('selectPosts');
        return posts.recordset;
    } catch (err) {
        console.log(err.message);
    } finally {
    }
}

async function getStories() {
    const stories = []
    try {
        let pool = await sql.connect(config);
        let posts = await pool
            .request()
            .execute('selectStories');
        for (const [i, story] of posts.recordset.entries()) {
            stories.push({
                IDStory: story.IDStory,
                ImageBlob: story.ImageBlob,
                PubDate: story.PubDate,
                StoryName: story.StoryName,
                Summary: story.Summary,
                Username: story.Username,
                Score: story.Score,
                CommentNbr: story.CommentNbr,
                warnings: await getStoryWarnings(story.IDStory)
            })
        }
        return stories
        // return posts.recordset;
    } catch (err) {
        console.log(err.message);
    } finally {
    }
}

async function getStoryWarnings(idStory) {
    try {
        let pool = await sql.connect(config);
        let posts = await pool
            .request()
            .input('IDStory', sql.Int, idStory)
            .execute('selectStoryWarnings');
        return posts.recordset;
        // return posts.recordset;
    } catch (err) {
        console.log(err.message);
    } finally {
    }
}

async function getTrendingStories() {
    const stories = []

    try {
        let pool = await sql.connect(config);
        let posts = await pool
            .request()
            .execute('getTop10StoriesByReview');
        for (const [i, story] of posts.recordset.entries()) {
            stories.push({
                IDStory: story.IDStory,
                ImageBlob: story.ImageBlob,
                PubDate: story.PubDate,
                StoryName: story.StoryName,
                Summary: story.Summary,
                Username: story.Username,
                Score: story.Score,
                CommentNbr: story.CommentNbr,
                warnings: await getStoryWarnings(story.IDStory)
            })
        }
        return stories
    } catch (err) {
        console.log(err.message);
    } finally {
    }
}

async function getStoryById(idStory) {
    console.log(idStory)
    try {
        let pool = await sql.connect(config);
        let posts = await pool
            .request()
            .input('IDStory', sql.Int, idStory)
            .execute('selectStory');
        let data = {
            story: posts.recordsets[0][0],
            warnings: posts.recordsets[1],
            firstPost: posts.recordsets[2][0],
            choices: posts.recordsets[3],
            comments: posts.recordsets[4]
        }
        console.log(data)
        return data;
    } catch (err) {
        console.log(err.message);
    } finally {
    }
}

async function getStoryComments(idStory) {
    try {
        let pool = await sql.connect(config);
        let posts = await pool
            .request()
            .input('IDStory', sql.Int, idStory)
            .execute('selectStoryComments');
        return posts.recordset;
    } catch (err) {
        console.log(err.message);
    } finally {
    }
}

async function getPostByChoiceId(idChoice) {
    try {
        let pool = await sql.connect(config);
        let posts = await pool
            .request()
            .input('IDChoice', sql.Int, idChoice)
            .execute('selectPostByChoiceId');
        let data = {
            post: posts.recordsets[0][0],
            choices: posts.recordsets[1]
        }
        console.log(data)
        return data;
    } catch (err) {
        console.log(err.message);
    } finally {
    }
}

async function addConditionToPost(postID, choiceID) {
    try {
        let pool = await sql.connect(config);
        let postCondition = await pool
            .request()
            .input('PostID', sql.Int, postID)
            .input('ChoiceID', sql.Int, choiceID)
            .output('IDPostChoice', sql.Int)
            .execute('addConditionToPost');
        return postCondition.output.IDPostChoice;
    } catch (err) {
        console.log(err.message);
    } finally {
    }
}

async function addWarningToPost(postID, choiceID) {
    try {
        let pool = await sql.connect(config);
        let postCondition = await pool
            .request()
            .input('WarningID', sql.Int, postID)
            .input('StoryID', sql.Int, choiceID)
            .execute('addWarningToStory');
    } catch (err) {
        console.log(err.message);
    } finally {
    }
}

async function addCommentToStory(content, idUser, idStory) {
    try {
        let pool = await sql.connect(config);
        let comments = await pool
            .request()
            .input('Content', sql.NVarChar(sql.MAX), content)
            .input('IDUser', sql.Int, idUser)
            .input('IDStory', sql.Int, idStory)
            .output('IDComment', sql.Int)
            .execute('addCommentToStory');
        return comments.output.IDComment;
    } catch (err) {
        console.log(err.message);
    } finally {
    }
}

async function addScoreToStory(score, idUser, idStory) {
    try {
        let pool = await sql.connect(config);
        let reviews = await pool
            .request()
            .input('Score', sql.Int, score)
            .input('IDUser', sql.Int, idUser)
            .input('IDStory', sql.Int, idStory)
            .output('IDReview', sql.Int)
            .execute('addReviwToStory');
        console.log(reviews.recordset);
        return reviews.output.IDReview;
    } catch (err) {
        console.log(err.message);
    } finally {
    }
}

async function getUserStoryScore(idUser, idStory) {
    try {
        let pool = await sql.connect(config);
        let reviews = await pool
            .request()
            .input('IDUser', sql.Int, idUser)
            .input('IDStory', sql.Int, idStory)
            .execute('getUserStoryReview');
        console.log(reviews.recordset[0]);
        return reviews.recordset[0];
    } catch (err) {
        console.log(err.message);
    } finally {
    }
}




module.exports = {
    createPost: createPost,
    createStory: createStory,
    createChoice: createChoice,
    getWarnings: getWarnings,
    getPosts: getPosts,
    getStories: getStories,
    getTrendingStories: getTrendingStories,
    getStoryById: getStoryById,
    getStoryComments: getStoryComments,
    getPostByChoiceId: getPostByChoiceId,
    addConditionToPost: addConditionToPost,
    addWarningToPost: addWarningToPost,
    addCommentToStory: addCommentToStory,
    addScoreToStory: addScoreToStory,
    getUserStoryScore: getUserStoryScore
}