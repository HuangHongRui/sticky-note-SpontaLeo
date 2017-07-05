require('less/gotop.less')

var GoTop = (function() {
    function gotop($ct) {
        this.target = $ct;
        this.bindEvent();
    }

    gotop.prototype = {
        //bindEvent
        bindEvent: function() {
            var self = this;
            $(window).on('scroll', function() {
                if ($(window).scrollTop() > 150) {
                    self.target.show();
                } else {
                    self.target.hide();
                }
            });
            this.target.on('click', function() {
                $(window).scrollTop(0);
            });
        },

        //create
        createNode: function() {
            $('body').append(this.target);
        },
    }

    return {
        init: function($ct) {
            new gotop($ct);
        }
    }
})();

module.exports = GoTop;