/* ============================================================
 * boot-select.js v1.0.0
 * http://github.com/mitris/boot-select
 * ============================================================ */
!function($) {
  "use strict"; // jshint ;_;

	var Select = function(element, options) {
		this.$element = $(element);
		this.options = $.extend({}, $.fn.bootSelect.defaults, this.$element.data(), typeof options == 'object' && options);
		this.currentCssClass = 'btn btn-block dropdown-toggle';

		this.createDropdown();
		this.updateOptions();
		this.render();
		this.init();
	};

	Select.prototype = {
		constructor: Select,
		init: function() {
			var $this = this;
			!this.options.debug && this.$element.hide();
			this.$element.find("option:selected").each(function() {
				$this.setCurrent($(this));
			});
			this.$element.on('change', function(e) {
				$this.setCurrent($(this).find('option:selected'));
			});
			this.options.onInit.apply(this);
		},
		createDropdown: function() {
			var $this = this;
			this.$dropdown = $(
					'<div class="dropdown pull-left boot-select">' +
						'<span class="btn dropdown-toggle ' + this.options.size + '">' +
							'<span class="option pull-left hide"></span>' +
							'<span class="placeholder pull-left hide">' + this.options.placeholder + '</span>' +
							'<span class="pull-right toggle"><i class="icon-angle-down"></i></span>' +
							'<span class="pull-right clear hide">&times;</span>' +
						'</span>' +
						'<div class="dropdown-menu">' +
							'<div class="nano">' +
								'<div class="content">' +
									'<ul></ul>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>'
					);
			this.$list = this.$dropdown.find('ul');
			this.$button = this.$dropdown.find('.btn');
			this.$current = this.$button.find('.option');
			this.$placeholder = this.$button.find('.placeholder');
			this.$clear = this.$button.find('.clear');
			this.$current.data('original-class', this.$current.attr('class'));
			this.$button.on('click.boot-select', function(e) {
				$this.$dropdown.toggleClass('open');
				$this.$dropdown.find('.nano').nanoScroller({
					preventPageScrolling: true
				});
				$(this).blur();
			});
			if (this.options.enableClear) {
				this.$clear.show().on('click.boot-select', function(e) {
					e.stopPropagation();
					$this.clear();
				});
			}
		},
		updateOptions: function() {
			var $this = this;
			$this.$list.empty();
			$this.$element.find('option').each(function() {
				var $option = $(this),
						$li = $('<li><a href="#"><span class="' + $option.attr('class') + '">' + $option.text() + '</span></a></li>');
				if ($option.val()) {
					$this.$list.append($li);
					$li.on("click", function() {
						$this.setCurrent($option);
						return false;
					});
				}
			});
			this.options.onUpdate.apply(this);
		},
		setCurrent: function($option) {
			this.options.onChangeBefore.apply(this);
			if ($option.val()) {
				this.$element.val($option.val());
				this.$current.text($option.text()).attr('class', this.$current.data('original-class') + ' ' + $option.attr('class')).show();
				this.$placeholder.hide();
				this.$dropdown.removeClass('open');
			} else {
				this.clear();
			}
			this.options.onChange.apply(this);
		},
		render: function() {
			this.$element.after(this.$dropdown);
		},
		clear: function() {
			this.$element.prop('selectedIndex', 0);
			this.$current.hide();
			this.$placeholder.show();
			this.options.onClear.apply(this);
		}
	}

	/* PLUGIN DEFINITION */
	$.fn.bootSelect = function(option) {
		var args = Array.apply(null, arguments);
		args.shift();
		return this.each(function() {
			var $this = $(this), data = $this.data('bootSelect'), options = typeof option == 'object' && option;
			if (!data || typeof data != 'object') {
				$this.data('bootSelect', (data = new Select(this, options)));
			}
			if (typeof option == 'string' && typeof data[option] == 'function') {
				return data[option].apply(data, args);
			} else if(typeof option == 'string' && typeof data[option] == 'undefined' && data.options.debug) {
				console.log("BootSelect Error: Method \"" + option + "\" does not exist.");
			}
		})
	};

	$.fn.bootSelect.defaults = {
		debug: false,
		size: false,
		enableClear: true,
		placeholder: "Выберите из списка",
		onInit: function() {
		},
		onUpdate: function() {
		},
		onChange: function() {
		},
		onChangeBefore: function() {
		},
		onClear: function() {
		}
	};
	/* DATA-API */
	$(document).find('[data-boot-select=true]').bootSelect();
}(window.jQuery);
