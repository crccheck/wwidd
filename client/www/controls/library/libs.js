////////////////////////////////////////////////////////////////////////////////
// Library Selector Control
//
// Lets the user control what kind of tags are visible
////////////////////////////////////////////////////////////////////////////////
/*global jQuery, window */
var app = app || {};

app.controls = function (controls, $, services) {
	controls.libs = function () {
		var	self = controls.control.create(controls.popup('dropdown')),
				options = [],
				selected = '',
				data = {names: []},
				onChange;
		
		//////////////////////////////
		// Initialization

		services.lib.getall(function (json) {
			data = json.data;
			selected = json.data.selected;
			
			var processes = json.data.processes,
					progress = processes.thumbnails.progress,
					names = data.names,
					i;
			
			// initializing selector contents
			options = [];
			for (i = 0; i < names.length; i++) {
				options.push(names[i]);
			}
			options.sort();
			
			// detecting in-progress processes
			if (progress > 0) {
				controls.library
					.poll();
			} else {
				self.render();
			}
			
			// calling external handler
			if (onChange) {
				onChange(selected);
			}
		});

		//////////////////////////////
		// Getters, setters

		self.onChange = function (value) {
			onChange = value;
			return self;
		};
		
		self.selected = function (value) {
			if (typeof value !== 'undefined') {
				selected = value;
				onChange(selected);
				return self;
			} else {
				return selected;
			}
		};
		
		self.options = function () {
			return options;
		};

		//////////////////////////////
		// Overrides

		self.contents = function () {
			var i,
			
			result = [
				'<iframe class="download" style="display:none;"></iframe>',
				'<div class="libs">'
			];
			
			for (i = 0; i < options.length; i++) {
				result.push([
					'<div class="lib">',
					options[i] === selected ?
						'<span class="name">' + options[i] + '</span>' :					
						'<a href="#!" class="name">' + options[i] + '</a>',
					'<a href="#!" class="save" title="' + "Download" + '"></a>',
					'</div>'
				].join(''));
			}
			result.push('</div>');
			return result.join('');
		};

		return self;
	}();
	
	//////////////////////////////
	// Static event handlers

	// returns libs control object
	// and name of currently selected library
	function getSelf(elem) {
		var self = controls.lookup[elem.closest('.dropdown').attr('id')],
				lib = elem.closest('.lib'),
				name = self.options()[lib.index()];
		return {
			self: self,
			name: name
		};
	}
	
	function onSelect(event) {
		var $this = $(this),
				tmp = getSelf($this),
				self = tmp.self,
				name = tmp.name;
				
		// changing library
		services.lib.select(name, function () {
			// resetting controls
			controls.pager.reset();
			controls.search.reset();
			controls.url.set();
			
			self.selected(name);

			// loading new library contents
			controls.library.load();
		});
		
		return false;
	}
	
	function onSave(event) {
		var $this = $(this),
				tmp = getSelf($this),
				name = tmp.name;
		
		// saving library
		services.lib.save(name, $this.closest('.popup').find('iframe.download'));
		
		return false;
	}
	
	var context = $('div.lib');
	$('a.name', context).live('click', onSelect);
	$('a.save', context).live('click', onSave);
	
	return controls;
}(app.controls || {},
	jQuery,
	app.services);
