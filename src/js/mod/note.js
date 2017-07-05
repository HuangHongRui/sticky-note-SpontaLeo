// 样式
require('less/note.less')

var Toast = require('./toast.js')
var Event = require('./event.js')

var Note = (function() {
    function _note(opts) {
        this.initOpts(opts);
    }
    _note.prototype.initOpts = function(opts) {
        defaultOptions = {
            id: '',
            time: new Date().toLocaleString('chinese', { hour12: false }),
            $ct: $('#content').length > 0 ? $('#content') : $('body'),
            context: 'Please input here'
        };
        this.opts = $.extend({}, defaultOptions, opts || {});
        if (this.opts.id) {
            this.id = this.opts.id
        }

        var tpl = '<div class="note transition">' +
            '<div class="note-head"></div>' +
            '<div class="note-ct" contenteditable="true"></div>' +
            '<p class="username msg-ct"></p><p class="time msg-ct">' + new Date().toLocaleString('chinese', { hour12: false }) + '</p><span class="delete">&times;</span>' +
            '</div>';
        this.note = $(tpl);
        this.note.find('.time').html(this.opts.update);
        this.note.find('.username').html(this.opts.username);
        this.note.find('.note-ct').html(this.opts.context);
        this.opts.$ct.append(this.note);
        if (!this.id) {
            this.note.siblings().css('zIndex', 0);
            this.note.css({ zIndex: 999, left: '30px', top: '200px' });
        }
        this.setStyle();
        Event.fire('waterfall');
    }
    _note.prototype.setStyle = function() {
        var headcolors = ['#ea9b35', '#dd598b', '#eee34b', '#c24226', '#c1c341', '#3f78c3'];
        var ctcolors = ['#efb04e', '#e672a2', '#f2eb67', '#d15a39', '#d0d25c', '#5591d2'];
        var headcolor = headcolors[Math.floor(Math.random() * 6)];
        var ctcolor = ctcolors[Math.floor(Math.random() * 6)];
        this.note.find('.note-head').css({ 'background-color': headcolor });
        this.note.find('.note-ct').css({ 'background-color': ctcolor });
        this.bindEvent();
    }
    _note.prototype.setLayout = function() {
            var _this = this;
            if (_this.clk) {
                clearTimeout(_this.clk);
            }
            _this.clk = setTimeout(function() {
                Event.fire('waterfall');
            }, 100)
        }
        // 点击 按下 拖拽 跟随
    _note.prototype.bindEvent = function() {
        var _this = this,
            note = this.note,
            noteHead = note.find('.note-head'),
            noteCt = note.find('.note-ct'),
            noteTime = note.find('.time'),
            delBtn = note.find('.delete'),
            beforenoteCt = noteCt.html();

        noteCt.on('focus', function() {
            note.siblings().css('zIndex', 0);
            note.css('zIndex', 999);
            if (noteCt.html() == 'Please input here') {
                noteCt.html('');
            }
            noteCt.data('before', beforenoteCt);
        }).on('blur paste', function() {
            if (noteCt.data('before') != noteCt.html()) {
                if (noteCt.html() == '' || noteCt.html() == '<br>') {
                    noteCt.html(beforenoteCt);
                    Toast.init('Content cannot be empty');
                    return;
                }
                if (_this.id) {
                    _this.edit(noteCt, noteTime)
                } else {
                    _this.add(noteCt.html())
                }
                _this.setLayout();
            }
        });
        note.hover(function() {
            note.find('.delete').fadeIn();
        }, function() {
            note.find('.delete').hide();
        });

        // 删除
        delBtn.on('click', function() {
                _this.delete(noteCt.html());
                _this.setLayout();
            })
            // 点击头部移动
        noteHead.on('mousedown', function(e) {
            var eventX = e.pageX - note.offset().left,
                eventY = e.pageY - note.offset().top;
            note.siblings().css('zIndex', 0);
            note.css('zIndex', 999);
            note.removeClass('transition').addClass('draggable').data('evtPos', { x: eventX, y: eventY });
        }).on('mouseup', function() {
            note.removeClass('draggable').addClass('transition').removeData('pos')
        });


        // 当鼠标移动时，根据鼠标的位置和前面保持距离，计算位置
        $('body').on('mousemove', function(e) {
            $('.draggable').length && $('.draggable').offset({
                top: e.pageY - $('.draggable').data('evtPos').y,
                left: e.pageX - $('.draggable').data('evtPos').x
            })
        });
    }
    _note.prototype.edit = function(noteCt, noteTime) {
        var beforenoteCt = noteCt.data('before');
        var msg = noteCt.html();
        $.post('/api/notes/edit', {
            id: this.id,
            note: msg
        }).done(function(ret) {
            if (ret.status === 0) {
                Toast.init('edit success');
                noteTime.html(new Date().toLocaleString('chinese', { hour12: false }))
            } else {
                noteCt.html(beforenoteCt)
                Toast.init(ret.errorMsg);
            }
        })
    }
    _note.prototype.add = function(msg) {
        var _this = this;
        // console.log(_this, '1')
        $.post('/api/notes/add', {
            note: msg
        }).done(function(ret) {
            if (ret.status === 0) {
                _this.note.remove();
                new Note.init({
                    id: ret.result.id,
                    context: ret.result.text,
                    update: new Date(parseInt(ret.result.updatedAt)).toLocaleString('chinese', { hour12: false }),
                    username: ret.result.username
                });
                Toast.init('add success');
            } else {
                _this.note.remove();
                Toast.init(ret.errorMsg);
            }
        })
    }
    _note.prototype.delete = function() {
        var _this = this;
        $.post('/api/notes/delete', {
            id: _this.id
        }).done(function(ret) {
            if (ret.status === 0) {
                Toast.init('delete success');
                _this.note.remove();
                Event.fire('waterfall');
            } else {
                Toast.init(ret.errorMsg);
            }
        })
    }
    return {
        init: function(opts) {
            new _note(opts);
        }
    }
})();

module.exports = Note;