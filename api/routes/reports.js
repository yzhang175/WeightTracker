const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Report = require('../models/report_model');
const User = require('../models/user_model');

router.get('/', (req, res, next) => {
    Report.find()
        .select('-__v')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                report: docs.map(doc => {
                    return {
                        report: doc,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/reports/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    User.findById(req.body.userID)
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            } else {
                const report = new Report({
                    _id: mongoose.Types.ObjectId(),
                    userID: req.body.userID,
                    weight: req.body.weight,
                    date: req.body.date
                });
                return report.save()
            }
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Report stored',
                createdReport: {
                    _id: result.id,
                    userID: result.userID,
                    weight: result.weight,
                    date: result.date
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/reports/' + result._id
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

router.get('/:reportID', (req, res, next) => {
    Report.findById(req.params.reportID)
        .select('-__v')
        .exec()
        .then(report => {
            if (!report) {
                return res.status(404).json({
                    message: "Report not found"
                });
            } else {
                res.status(200).json({
                    report: report,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/reports'
                    }
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/:reportID', (req, res, next) => {
    const id = req.params.reportID;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    };
    User.updateOne({_id: id}, {$set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Weight updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/users/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.delete('/:reportID', (req, res, next) => {
    Report.deleteOne({ _id: req.params.reportID })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Report deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/reports' + id,
                    body: { userID: "ID", weight: "Number" }
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



module.exports = router;