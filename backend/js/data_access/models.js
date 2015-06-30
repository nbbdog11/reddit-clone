module.exports = function (mongoose) {
    var Schema = mongoose.Schema,
        bcrypt = require('bcrypt'),
        SALT_WORK_FACTOR = 10;

    var UserSchema = new Schema({
        username: {
            type: String,
            required: true,
            index: {
                unique: true
            }
        },
        emailAddress: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    });

    UserSchema.pre('save', function (next) {
        var user = this;

        // only hash the password if it has been modified (or is new)
        if (!user.isModified('password')) {
            return next();
        }

        // generate a salt
        bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
            if (err) {
                return next(err);
            }

            // hash the password using our new salt
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }

                // override the cleartext password with the hashed one
                user.password = hash;
                next();
            });
        });
    });

    UserSchema.methods.comparePassword = function(candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if (err) {
                return cb(err);
            }
            cb(null, isMatch);
        });
    };

    var CommentSchema = new Schema({
        user: [UserSchema],
        text: String,
        votes: Number
    });

    CommentSchema.add({
        comments: [CommentSchema]
    }, '');

    var PostSchema = new Schema({
        id: Number,
        title: String,
        text: String,
        user: [UserSchema],
        comments: [CommentSchema],
        votes: Number
    });

    UserSchema.add({
        posts: [PostSchema],
        comments: [CommentSchema]
    }, '');

    var UserSessionSchema = new Schema({
        username: {
            type: String,
            required: true
        },
        sessionId: {
            type: String,
            required: true
        }
    });

    return {
        User: mongoose.model('Users', UserSchema, 'users'),
        Comment: mongoose.model('Comments', CommentSchema, 'comments'),
        Post: mongoose.model('Posts', PostSchema, 'posts'),
        UserSession: mongoose.model("UserSessions", UserSessionSchema, 'user-sessions')
    };
};