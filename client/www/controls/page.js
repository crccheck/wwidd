////////////////////////////////////////////////////////////////////////////////
// Video Library - Page
////////////////////////////////////////////////////////////////////////////////
var yalp = yalp || {};

yalp.controls = (function (controls, $, data) {
	controls.page = function () {
		var self = {},
				pager,
				kinds;

		// applies static event handlers
		function events() {
			$('#selectall')
				.click(function () {
					controls.library.selectAll();
					return false;
				});

			$('#selectnone')
				.click(function () {
					controls.library.selectNone();
					return false;
				});
		}
		
		// initializes page
		self.init = function () {
			// applying static events
			events();
			
			// initializing pager control
			controls.pager
				.render($('#pager').empty());
				
			// initializing and adding kinds control
			controls.kinds
				.onChecked(function () {
					controls.library.render();
				})
				.render($('#kinds').empty());
			
			// adding search box to page
			controls.search
				.render($('#search')
					.empty()
					.append('&nbsp;'));	// helps vertical alignment
			
			// adding library switcher
			controls.switcher
				.render($('#switcher').empty());
				
			// adding root adder to page
			controls.rootadd
				.render($('#rootadd').empty());
			
			// initializing and adding library to page
			controls.library
				.onInit(function () {
					// redrawing controls
					controls.pager.render();

					// initializing kinds table
					data.kinds
						.init(function () {
							controls.library.render();
							controls.kinds.render();
						});
				})
				.load()
				.render($('#media').empty());

			return self;
		};

		return self;
	}();
	
	return controls;
})(yalp.controls || {},
	jQuery,
	yalp.data);

