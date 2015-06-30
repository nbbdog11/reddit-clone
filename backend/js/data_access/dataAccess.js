var mongoose = require('mongoose');
var models = require('./models')(mongoose);
var db;

module.exports = {
    establishConnection: function(dbUrl, options) {
        mongoose.connect(dbUrl);
        db = mongoose.connection;
        db.on('error', options.error);
        db.once('open', options.success);
    },
    login: function(username, password) {
        console.log("Logging in username: " + username);
    },
    logout: function(username) {
        console.log("Logging out username: " + username);
    },
    register: function(userDetails) {

    },
    submitPost: function(postDetails) {
        console.log("Creating post.");
        console.log(postDetails);
        return new models.Posts({
            title: postDetails.title
        });
    },
    getPost: function(postId) {
        console.log("Getting post: " + postId);
        return {
            'postId': postId
        };
    }
};