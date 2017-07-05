var Toast = require('./toast.js');
var Note = require('./note.js');
var Event = require('./event.js');

var NoteManager = (function() {
    function load() {
        $.get('api/notes')
            .done(function(ret) {
                if (ret.status === 0) {
                    if (ret.data) {
                        $.each(ret.data, function(idx, article) {
                            new Note.init({
                                id: article.id,
                                context: article.text,
                                update: new Date(parseInt(article.updatedAt)).toLocaleString('chinese', { hour12: false }),
                                username: article.username
                            });
                        });
                        Event.fire('waterfall')
                    }
                } else {
                    Toast(ret.errorMsg);
                }
            }).fail(function() {
                Toast.init('network anomaly')
            });
    }

    function add() {
        new Note.init();
    }

    return {
        load: load,
        add: add
    }
})();

module.exports = NoteManager;