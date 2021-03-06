/**
 * General Popup Widget
 */
/*global jQuery, wraith, window */
var app = app || {};

app.widgets = (function (widgets, $, wraith) {
    var TYPES = {
        'centered': 'centered', // always centered, like a modal dialog
        'context': 'context', // positions near mouse mask, stays there
        'dropdown': 'dropdown', // same as context but doesn't bind 'click outside'
        'follow': 'follow'              // follows mouse mask
    };

    widgets.popup = function (type) {
        type = type || 'context';

        var self = wraith.widget.create(),
            $window = $(window),    // frequently used window object
            anchor,                 // position anchor object for dropdown
            relatedWidget;          // related widget (usually the one that triggered the select)

        //////////////////////////////
        // Getters, setters

        /** Sets anchor jQuery elem for dropdown popup */
        self.anchor = function (value) {
            anchor = value;
            return this;
        };

        self.relatedWidget = function (value) {
            if (typeof value === 'object') {
                relatedWidget = value;
                return this;
            } else {
                return relatedWidget;
            }
        };

        //////////////////////////////
        // Event handlers

        /**
         * Mouse move event handler.
         * @param event {object} jQuery event object
         * @param elem {object} DOM element.
         * @param dims {object} Dimensions of element (or window).
         */
        function onMouseMove(event, elem, dims) {
            var offset, pos,
                pageX, pageY;

            // obtaining element position
            if (!event && typeof anchor !== 'undefined') {
                offset = anchor.offset();
                pos = {
                    pageX: offset.left,
                    pageY: offset.top + anchor.outerHeight(true)
                };
            } else {
                pos = event;
            }

            if (pos) {
                // we need the top left of the mouse cursor
                pageX = pos.pageX - 8;
                pageY = pos.pageY - 8;

                elem.css({
                    top: dims.windowHeight > pageY + dims.elemHeight ? pageY : pageY - dims.elemHeight,
                    left: dims.windowWidth > pageX + dims.elemWidth ? pageX : pageX - dims.elemWidth
                });
            }
        }

        /** Resize handler for centered popup */
        function onResize(elem) {
            var $window = $(window);
            elem.css({top: ($window.height() - elem.height()) / 2, left: ($window.width() - elem.width()) / 2});
        }

        //////////////////////////////
        // Overrides

        /** Constructs the specific contents of the popup */
        self.contents = null;

        /**
         * Acquires element and window dimensions.
         * @param elem {object} jQuery object.
         * @param elem.outerHeight {function}
         * @param elem.outerWidth {function}
         */
        function getDims(elem) {
            return {
                elemHeight: elem.outerHeight(true),
                elemWidth: elem.outerWidth(true),
                windowHeight: $window.height(),
                windowWidth: $window.width()
            };
        }

        function onClickOutside(event, popup) {
            // checking whether user actually clicked outside of popup
            if (!$(event.target).closest('#' + self.id).length) {
                // removing popup
                popup.render(null);
            } else {
                // re-binding event handler
                $('body').one(event.type, function (event) {
                    onClickOutside(event, popup);
                });
            }
            return false;
        }

        self.init = function (elem) {
            var dims,
                that = this;

            switch (type) {
            case 'centered':
                onResize(elem);
                $(window).bind('resize', function (event) {
                    onResize(elem);
                });
                break;

            case 'follow':
                dims = getDims(elem);
                onMouseMove(null, elem, dims);
                $('body').bind('mousemove', function (event) {
                    onMouseMove(event, elem, dims);
                });
                break;

            case 'dropdown':
                dims = getDims(elem);
                onMouseMove(null, elem, dims);
                $(window).bind('resize', function (event) {
                    onMouseMove(null, elem, dims);
                });
                break;

            default:
                //case 'context':
                dims = getDims(elem);
                onMouseMove(null, elem, dims);
                $('body').one('mousedown', function (event) {
                    onClickOutside(event, that);
                });
                break;
            }
        };

        self.html = function () {
            return [
                '<div id="', self.id, '" class="', ['w_popup', TYPES[type] || 'follow'].join(' '), '">',
                this.contents(),
                '</div>'
            ].join('');
        };

        return self;
    };

    return widgets;
}(app.widgets || {},
    jQuery,
    wraith));

