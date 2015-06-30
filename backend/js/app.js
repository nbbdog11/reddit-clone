var http = require('http');
var cookies = require('cookies');
var express = require('express');
var bodyParser = require('body-parser');

var dataAccess = require('./data_access/dataAccess');
dataAccess.establishConnection("mongodb://localhost/test", {
    error: function () {
        console.error.bind(console, 'connection error:');
    },
    success: function () {
        console.log('Connected');
    }
});

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/posts', function (req, res) {
    var responseObj = {
        requestBody: req.body,
        requestHeaders: req.headers
    };
    res.status(200).send(responseObj);
});

app.post('/login', function (req, res) {
    var usernameIn = req.body.username,
        passwordIn = req.body.password;
    dataAccess.login(usernameIn, passwordIn);
    res.status(200).send('Logged in: ' + usernameIn);
});

app.post('/logout', function (req, res) {
    var usernameIn = req.body.username;
    dataAccess.logout(usernameIn);
    res.status(200).send('Logged out: ' + usernameIn);
});

app.post('/register', function (req, res) {
    var usernameIn = req.body.username;
    dataAccess.register({
        username: usernameIn,
        email: req.body.email,
        password: req.body.password
    });
    res.status(200).send('Registered: ' + usernameIn.toString());
});

app.post('/create-post', function (req, res) {
    var post = {
        user: req.body.username,
        title: req.body.title,
        postText: req.body.text,
        submitted: new Date()
    };
    var submittedPost = dataAccess.submitPost(post);
    res.status(200).send(submittedPost);
});

app.post('/delete-post/:postId', function (req, res) {
    var postId = req.body.postId;
    console.log("Delete post: " + postId.toString());
});

app.post('/upvote/:postId', function (req, res) {
    var postId = req.body.postId;
    console.log("Upvote post: " + postId.toString());
});

app.post('/downvote/:postId', function (req, res) {
    var postId = req.body.postId;
    console.log("Downvote post: " + postId.toString());
});

app.post('/comment', function (req, res) {
    var post = {
        commentText: req.body.commentText,
        username: req.body.username,
        postId: req.body.postId,
        parentCommentId: req.body.parentCommentId
    };
    console.log("Comment: " + JSON.stringify(post));
});

app.get('/user/:userId', function (req, res) {
    var userId = req.body.userId;
    console.log("View user: " + userId);
});

app.get('/post/:postId', function (req, res) {
    var post = dataAccess.getPost(req.params.postId);
    res.status(200).send(post);
});

app.listen(6969);