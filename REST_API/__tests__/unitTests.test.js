// const postOperations = require('./DAL/postOperations');
import axios from 'axios';
import Story from '../axios/story';

jest.mock('axios');

test('should fetch users', () => {
    const users = [{
        IDStory: 125,
        ImageBlob: null,
        PubDate: "2022-04-12",
        StoryName: "Moj blog",
        Summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        Username: "fran",
        Score: 2,
        CommentNbr: 2,
        warnings: []
    }];
    const resp = { data: users };
    axios.get.mockResolvedValue(resp);

    // or you could use the following depending on your use case:
    // axios.get.mockImplementation(() => Promise.resolve(resp))

    return Story.all().then(data => expect(data).toEqual(users));
});

test('Create Story', () => {

});
