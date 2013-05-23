/* ============================================================
 * boot-select.js v1.0.0
 * http://github.com/mitris/boot-select
 * ============================================================ */
!function($) {
	"use strict"; // jshint ;_;

	var Select = function(element, options) {
		this.$element = $(element);
		this.options = $.extend({}, $.fn.bootSelect.defaults, this.$element.data(), typeof options == 'object' && options);

		this.createDropdown();
		this.updateOptions();
		this.render();
		this.attachEvents();
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
						'<span class="btn dropdown-toggle ' + this.options.size + '" ssdata-toggle="dropdown">' +
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
			this.$button = this.$dropdown.find('.btn');
			this.$current = this.$button.find('.option');
			this.$placeholder = this.$button.find('.placeholder');
			this.$clear = this.$button.find('.clear');
			this.$dropdown_menu = this.$dropdown.find('.dropdown-menu');
			this.$list = this.$dropdown_menu.find('ul');
			this.$button.data('original-class', this.$button.attr('class'));
			this.$current.data('original-class', this.$current.attr('class'));
			this.$button.on('click.boot-select', function(e) {
				if($.fn.nanoScroller) {
					$this.$dropdown.find('.nano').nanoScroller({
						preventPageScrolling: true
					});
				}
				$this.$dropdown.toggleClass('open');
				$this.scrollToSelectedOption();
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
			$this.$list_options = {};
			$this.$element.find('option').each(function() {
				var $option = $(this);
				$this.$list_options[$option.val()] = $('<li><span>' + $option.text() + '</span></li>');
				$this.$list_options[$option.val()].find('span').addClass($option.data('option-class')).data('value', $option.val())
				if ($option.val()) {
					$this.$list_options[$option.val()].on("click", function() {
						$this.setCurrent($option);
					});
					$this.$list.append($this.$list_options[$option.val()]);
				}
			});
			this.options.onUpdate.apply(this);
		},
		setCurrent: function($option, keepOpen) {
			keepOpen = keepOpen || false;
			this.options.onChangeBefore.apply(this);
			if ($option.val()) {
				this.$list.find('li').removeClass('active');
				this.$list_options[$option.val()].addClass('active');
				this.$element.val($option.val());
				this.$current
						.text($option.text())
						.removeClass()
						.addClass(this.$current.data('original-class'))
						.addClass($option.data('current-class'))
						.show();
				this.$button
						.removeClass()
						.addClass(this.$button.data('original-class'))
						.addClass($option.data('btn-class'));
				this.$placeholder.hide();
				this.scrollToSelectedOption();
				!keepOpen && this.$dropdown.removeClass('open');
			} else {
				this.clear();
			}
			this.options.onChange.apply(this);
		},
		scrollToSelectedOption: function() {
			this.$dropdown_menu.animate({
				scrollTop: this.$list.find('li.active').index() * this.$list.find('li.active').outerHeight()
			}, 100);
		},
		render: function() {
			this.$element.after(this.$dropdown);
		},
		clear: function() {
			this.$dropdown_menu.animate({scrollTop: 0}, 100);
			this.$list.find('li').removeClass('active');
			this.$element.prop('selectedIndex', 0);
			this.$current.hide();
			this.$button.attr('class', this.$button.data('original-class'));
			this.$placeholder.show();
			this.options.onClear.apply(this);
		},
		attachEvents: function () {
			var $this = this;
			if($this.options.keyboardNavigation) {
				$(document).on('keypress.boot-select', function (e) {
					if ($this.$dropdown.hasClass('open') && /(38|40|27|13)/.test(e.keyCode))  {
						e.preventDefault();
						e.stopPropagation();
						if (e.keyCode == 27 || e.keyCode == 13) {
							$this.$dropdown.removeClass('open');
						}
						if(e.keyCode == 38) {
							$this.setCurrent($this.$element.find('option:selected').prev(), true);
						}
						if(e.keyCode == 40) {
							$this.setCurrent($this.$element.find('option:selected').next(), true);
						}
					}
				});
			}
			if($this.options.autoClose) {
				var $this = this;
				$(document).on('click.boot-select', function (e) {
					if (!$this.$dropdown.is(e.target) && !$this.$dropdown.has(e.target).length) {
						$this.$dropdown.removeClass('open');
					}
				});
			}
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
			} else if (typeof option == 'string' && typeof data[option] == 'undefined' && data.options.debug) {
				console.log("BootSelect Error: Method \"" + option + "\" does not exist.");
			}
		})
	};

	$.fn.bootSelect.defaults = {
		debug: false,
		enableClear: true,
		autoClose: true,
		keyboardNavigation: true,
		size: 'input-initial',
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
