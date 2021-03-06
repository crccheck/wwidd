/**
 * Kind Widget
 *
 * Switches visibility of tags of a given kind.
 * TODO: make evented
 */
/*global document, jQuery, wraith */
var app = app || {};

app.widgets = function (widgets, $, wraith, model) {
    widgets.kind = function (kind, handler) {
        var self = wraith.widget.create();

        self.data.kind = kind;
        self.data.handler = handler || function () {};

        //////////////////////////////
        // Overrides

        self.html = function () {
            var id = 'kind' + kind;
            return [
                '<span id="', self.id, '" class="w_kind w_tag w_tagedit ', model.kind.getNumber(kind), '" >',
                    '<input type="checkbox" id="', id, '"',
                    !self.parent || !self.parent.hidden(kind) ? ' checked="checked"' : '', '/>',
                    '<label for="', id, '">', kind ? kind : "[uncategorized]", '</label>',
                '</span>'
            ].join('');
        };

        return self;
    };

    //////////////////////////////
    // Static event handlers

    // checkbox event handler
    // when checkbox or label is clicked
    function onChecked() {
        var $this = $(this),
            control = wraith.lookup($this.parent()),
            kind = control.data.kind,
            handler = control.data.handler,
            checked = $this.prop('checked');
        handler(kind, checked);
    }

    // when tag background is clicked
    function onClick(event) {
        if (event.target === this) {
            var $this = $(this),
                control = wraith.lookup($this),
                kind = control.data.kind,
                handler = control.data.handler,
                $checkbox = $this.find(':checkbox'),
                checked = !$checkbox.prop('checked');
            $checkbox.prop('checked', checked);
            handler(kind, checked);
        }
    }

    //////////////////////////////
    // Static event bindings

    $(document)
        .on('click', '.w_kind', onClick)
        .on('click', '.w_kind :checkbox', onChecked);

    return widgets;
}(app.widgets || {},
    jQuery,
    wraith,
    app.model);

