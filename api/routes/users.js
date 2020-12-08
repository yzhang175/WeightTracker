const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user_model');

router.get('/', (req, res, next) => {
    User.find()
        .select('-__v')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                accounts: docs.map(doc => {
                    return {
                        account: doc,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/users/" + doc.username
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});

router.post('/', (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        password: req.body.password,
    });
    user
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Created user successfully',
                createdUser: {
                    username: result.username,
                    password: result.password,
                    _id: result._id
                },
                request: {
                    type: "GET",
                    url: "http://localhost:3000/users/" + result.username
                }
            });
        })
        .catch(err => {
            console.log(err);  
            res.status(500).json({
                error: err
            });
        });  
});

router.get('/:userName', (req, res, next) => {
    const username = req.params.userName;
    User.findById(username)
        .select('-__v')
        .exec()
        .then(doc => {
            res.status(200).json({
                account: doc,
                request: {
                    type: 'GET',
                    description: 'Get all users',
                    url: 'http://localhost:3000/users/'
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.patch('/:userName', (req, res, next) => {
    const username = req.params.userName;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    };
    User.updateOne({userName: username}, {$set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Account updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/users/' + username
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.delete('/:userName', (req, res, next) => {
    const username = req.params.userName;
    User.deleteOne({username: username})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/users/' + username,
                    body: { username: 'String', password: 'String'}
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});


module.exports = router;
