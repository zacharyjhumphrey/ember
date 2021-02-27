const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const async = require('async');

module.exports = {
    /*
        Precondition: 
            Is given a valid document with author value that the user wants to find the author of

        Postcondition: 
            returns an object version of the document with author data tacked on instead of just the id
    
        OOO: 
            Get the user
                & Get all of the posts for the user
                    Push the posts into the newPost
            return the newUser
    */
    getUser: (id) => {
        return new Promise((resolve, reject) => {
            User.findById(id)
            .then((user, err) => {
                if (user == null) {
                    reject(new Error("User not found"));
                    return;
                }
                if (err) {
                    reject(err);
                    return;
                }

                const newUser = user.toObject();
                const postIds = newUser.posts;
                newUser.posts = [];

                postIds.forEach(id => {
                    Post.findById(id)
                    .then((post, err) => {
                        if (post == null) {
                            reject(new Error("Post not found"));
                            return;
                        }
                        if (err) {
                            reject(err);
                            return;
                        }

                        const newPost = post.toObject();
                        const commentIds = post.comments;
                        post.comments = [];

                        // Add the author to all of these posts
                        newPost.author = user;

                        // Comments are loaded into each of the user's posts
                        module.exports.getComments(commentIds)
                        .then((comments, err) => {
                            if (comments == null) {
                                reject(comments);
                                return;
                            }
                            if (err) {
                                reject(err);
                                return;
                            }

                            newPost.comments = comments;
                            newUser.posts.push(newPost);

                            resolve(newUser);
                        })
                    })
                })
            })
        });
    },

    /*
        Predcondition: 
            The function is given a valid commentIds

        Postcondition: 
            returns comment data
    */
    getComments: (commentIds) => {
        return new Promise((resolve, reject) => {
            let calls = [];

            // For each comment, find 
            commentIds.forEach(id => {
                calls.push(callback => {
                    Comment.findById(id).then((comment, err) => {
                        if (err) callback(err);
                        if (comment == null) callback(new Error('Comment not found'));

                        newComment = comment.toObject();

                        // Find the author of the comment
                        User.findById(newComment.author).then((author, err) => {
                            // Error casing
                            if (err) reject(err);
                            if (author == null) reject(new Error('Author not found'));

                            // Put the author object in the document
                            newComment.author = author.toObject();

                            callback(null, newComment)
                        }).catch((err) => reject(err));
                    })
                })
            });
            
            // Wait for the calls to finish
            async.parallel(calls, (err, comments) => {
                if (err) reject(err);
                resolve(comments);
            });
        });
    },

    /*
        Precondition: 
            A valid user document is passed into the function

        Postcondition: 
            returns an object version of user with data loaded into the posts member instead of just ids
    */
    getPostsByUser: (user) => {
        const userObject = user.toObject();
        const postIds = user.posts;
        userObject.posts = [];

        return new Promise((resolve, reject) => {
            let calls = [];

            // For each post
            postIds.forEach(id => {
                calls.push(callback => {
                    // Get the posts
                    Post.findById(id).catch(err => callback(err))
                    .then((post, err) => {
                        if (err) callback(err);

                        // Get the comments
                        this.getCommentsByPost(post).catch(err => callback(err))
                        .then(completedPost => callback(null, completedPost));
                    });
                })
            });

            // Wait for all posts to be finished loading
            async.parallel(calls, (err, posts) => {
                if (err) reject(err);

                // Put the posts in the user
                userObject.posts = posts;

                resolve(userObject, posts);
            });
        })
    },

    /*
        Precondition: 
            valid post id is passed in

        Postcondition:
            returns a post object with user and comments loaded in 

        OOO: 
            Find the post
                & Find the data for the posts author and load it into the post
                & Find the data for the comments and load it into the post
    */
    getPost: (id) => {
        return new Promise((resolve, reject) => {
            Post.findById(id)
            .then((post, err) => {
                if (post == null) {
                    reject(new Error("Post not found"));
                    return;
                }
                if (err) {
                    reject(err);
                    return;
                }

                const calls = [];
                let newPost = post.toObject();
                const commentIds = newPost.comments;

                // Load author data
                calls.push(callback => {
                    User.findById(newPost.author).then((author, err) => {
                        if (author == null) {
                            reject(new Error("Author not found"));
                            return;
                        } 
                        if (err) {
                            reject(err);
                            return;
                        }
                        newPost.author = author;

                        callback(null);
                    });
                });

                // Clear comment ids for comment data in post
                newPost.comments = [];

                // Get the comments
                calls.push(callback => {
                    module.exports.getComments(commentIds).catch(err => callback(err))
                        .then(comments => {
                            newPost.comments = [];
                            newPost.comments = comments;
                            callback(null);
                        })
                })

                // Wait for the calls to finish
                async.parallel(calls, (err) => {
                    if (err) reject(err);
                    resolve(newPost);
                });

            })
        }).catch(err => console.error(err));
    }
}


