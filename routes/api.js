var express = require('express');
var router = express.Router();
var Note = require('../models/note')

router.get('/notes', function(req, res, next) {
    var opts = { raw: true }
    if (req.session && req.session.user) {
        opts.where = { uid: req.session.user.id }
    }

    Note.findAll(opts).then(function(notes) {
        console.log(notes)
        res.send({ status: 0, data: notes });
    }).catch(function() {
        res.send({ status: 1, errorMsg: 'Database Exceptions' });
    });
});

router.post('/notes/add', function(req, res, next) {
    console.log('add...')
    if (!req.session || !req.session.user) {
        return res.send({ status: 1, errorMsg: 'Please log in first' })
    }
    if (!req.body.note) {
        return res.send({ status: 2, errorMsg: 'Content cannot be empty' })
    }

    var note = req.body.note;
    var uid = req.session.user.id;
    console.log({ text: note, uid: uid })
    var username = req.session.user.username;
    var update = new Date().getTime();

    Note.create({
        text: note,
        uid: uid,
        username: username,
        createdAt: update,
        updatedAt: update
    }).then(function(data) {
        res.send({ status: 0, result: data.get({ plain: true }) })
    }).catch(function() {
        res.send({
            status: 1,
            errorMsg: 'Database Exceptions or You have no permissions'
        })
    })
});

router.post('/notes/edit', function(req, res, next) {
    console.log('edit...')
    if (!req.session || !req.session.user) {
        return res.send({
            status: 1,
            errorMsg: 'Please log in first'
        })
    }

    var noteId = req.body.id;
    var note = req.body.note;
    var uid = req.session.user.id;
    var update = new Date().getTime();
    Note.update({
        text: note,
        updatedAt: update
    }, { where: { id: noteId, uid: uid }, returning: true, plain: true }).then(function(lists) {
        if (lists[1] === 0) {
            return res.send({ status: 1, errorMsg: 'You have no permissions' })
        }

        res.send({ status: 0 })
    }).catch(function(e) {
        res.send({ status: 1, errorMsg: 'Database Exceptions or You have no permissions' })
    })
});

router.post('/notes/delete', function(req, res, next) {
    console.log('delete...')
    if (!req.session || !req.session.user) {
        return res.send({ status: 1, errorMsg: 'Please log in first' })
    }

    var noteId = req.body.id;
    var uid = req.session.user.id;

    Note.destroy({ where: { id: noteId, uid: uid } }).then(function(deleteLen) {
        if (deleteLen === 0) {
            return res.send({ status: 1, errorMsg: 'You have no permissions' })
        }
        res.send({ status: 0 })
    }).catch(function(e) {
        res.send({ status: 1, errorMsg: 'Database Exceptions or You have no permissions' })
    })
});

module.exports = router;