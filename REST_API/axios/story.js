import axios from 'axios';

class Story {
    static all() {
        return axios.get('/getStories').then(resp => resp.data);
    }
}

export default Story;