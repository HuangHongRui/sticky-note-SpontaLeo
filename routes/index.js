var express = require('express')
var router = express.Router()

/*GET homepage. */

router.get('/', function(req, res, next) {
    var data;
    if (req.session.user) {
        data = {
            isLogin: true,
            user: req.session.user
        }
    } else {
        data = {
            isLogin: false
        }
    }

    console.log(data)
    res.render('index', data);
});

module.exports = router;