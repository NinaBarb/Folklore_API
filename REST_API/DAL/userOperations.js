var config = require('./dbConfig');
const sql = require('mssql');
const { password } = require('./dbConfig');

sql.on('error', err => {
    console.log(err.message);
})

async function getUsers() {
    try {
        let pool = await sql.connect(config);
        let users = await pool.request().execute('ReadUserAccounts');
        return users.recordsets;
    } catch (err) {
        console.log(err.message);
    } finally {
    }
}

async function getUser(id) {
    try {
        let pool = await sql.connect(config);
        let users = await pool
            .request()
            .input('IDUser', sql.Int, id)
            .execute('selectUser');
        return users.recordsets[0][0];
    } catch (err) {
        console.log(err.message);
    } finally {
    }
}

async function deleteUser(id) {
    try {
        let pool = await sql.connect(config);
        let users = await pool
            .request()
            .input('IDUser', sql.Int, id)
            .execute('deleteUser');
        return users.recordsets[0][0];
    } catch (err) {
        console.log(err.message);
    } finally {
    }
}

async function createUser(username, email, password) {
    try {
        let pool = await sql.connect(config);
        let users = await pool
            .request()
            .input('Username', sql.NVarChar(50), username)
            .input('Email', sql.NVarChar(50), email)
            .input('Password', sql.NVarChar(sql.MAX), password)
            .input('Active', sql.Bit, 1)
            .output('IDUser', sql.Int)
            .execute('createUser');
        return users.output.IDUserAccount;
    } catch (err) {
        console.log(err.message);
    } finally {
    }
}

async function checkUsernameAndEmail(username, email) {
    try {
        let pool = await sql.connect(config);
        let users = await pool
            .request()
            .input('Username', sql.NVarChar(50), username)
            .input('Email', sql.NVarChar(50), email)
            .query('select * from AppUser where Username = @Username OR Email = @Email');
        if (users !== null) {
            if (users.rowsAffected[0] > 0) {
                return users.recordset;
            }
        }
        return null;
    } catch (err) {
        console.log(err.message);
    } finally {
    }
}
async function checkEmail(email) {
    try {
        let pool = await sql.connect(config);
        let users = await pool
            .request()
            .input('Email', sql.NVarChar(50), email)
            .query('select * from AppUser where Email = @Email');
        if (users !== null) {
            if (users.rowsAffected[0] > 0) {
                return users.recordset;
            }
        }
        return null;
    } catch (err) {
        console.log(err.message);
    } finally {
    }
}

async function getUserBlogs(id) {
    const stories = []

    try {
        let pool = await sql.connect(config);
        let users = await pool
            .request()
            .input('IDUser', sql.Int, id)
            .execute('getUserBlogs');
        for (const [i, story] of users.recordset.entries()) {
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

async function getUserStories(id) {
    const stories = []
    try {
        let pool = await sql.connect(config);
        let users = await pool
            .request()
            .input('IDUser', sql.Int, id)
            .execute('getUserStories');
        for (const [i, story] of users.recordset.entries()) {
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

async function getUserLibrary(id) {
    const stories = []
    try {
        let pool = await sql.connect(config);
        let users = await pool
            .request()
            .input('IDUser', sql.Int, id)
            .execute('getUserLibrary');
        for (const [i, story] of users.recordset.entries()) {
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

async function getSearchItems() {
    try {
        let pool = await sql.connect(config);
        let users = await pool
            .request()
            .execute('getSearchItems');
        return users.recordsets;
    } catch (err) {
        console.log(err.message);
    } finally {
    }
}

async function removeStoryFromUser(userID, storyID) {
    console.log(userID + " " + storyID)
    try {
        let pool = await sql.connect(config);
        let users = await pool
            .request()
            .input('UserID', sql.Int, userID)
            .input('StoryID', sql.Int, storyID)
            .execute('removeStoryFromUser');
        return users.recordsets;
    } catch (err) {
        console.log(err.message);
    }
}

async function addStoryToUserLibrary(userID, storyID) {
    console.log(userID + " " + storyID)
    try {
        let pool = await sql.connect(config);
        let users = await pool
            .request()
            .input('UserID', sql.Int, userID)
            .input('StoryID', sql.Int, storyID)
            .execute('addStoryToUser');
        return users.recordsets;
    } catch (err) {
        console.log(err.message);
    }
}

module.exports = {
    getUsers: getUsers,
    getUser: getUser,
    deleteUser: deleteUser,
    createUser: createUser,
    checkUsernameAndEmail: checkUsernameAndEmail,
    checkEmail: checkEmail,
    getUserBlogs: getUserBlogs,
    getUserStories: getUserStories,
    getUserLibrary: getUserLibrary,
    getSearchItems: getSearchItems,
    removeStoryFromUser: removeStoryFromUser,
    addStoryToUserLibrary: addStoryToUserLibrary
}