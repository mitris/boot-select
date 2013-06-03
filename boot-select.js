/* ============================================================
 * boot-select.js v2.0.2
 * http://github.com/mitris/boot-select
 * ============================================================ */

!function ($) {
    "use strict"; // jshint ;_;

    var cache = {};
    var Select = function (element, settings) {
        this.element = $(element);
        this.settings = $.extend(true, {}, $.fn.bootSelect.defaults, typeof settings == 'object' && settings, this.element.data());
        this.value = false;
        this.init();
    };

    Select.prototype = {
        constructor: Select,
        init: function () {
            this.visible = false;
            this._generateView();
            this._applySettings();
            this._fixWidth();
            this._updateOptions();
            this._updateSelected();
            this._attachEvents();
        },
        _generateView: function () {
            this.view = $('<div class="dropdown btn-group boot-select"></div>');
            this.button = $('<span class="btn dropdown-toggle input-block-level"></span>');
			this.text = $('<span class="text"></span>');
            this.current = $('<span class="current"></span>');
            this.placeholder = $('<span class="placeholder">' + this.settings.placeholder + '</span>');
            this.actions = $('<span class="actions"></span>');
            this.clearButton = $('<span class="clear">' + this.settings.clearButton + '</span>');
            this.toggleButton = $('<span class="toggle">' + this.settings.toggleButton + '</span>');
            this.dropdown = $('<div class="dropdown-menu"><div class="nano"><div class="content"><ul></ul></div></div></div>');
			this.dropdown_list = this.dropdown.find('ul');
            this.view.append(this.button, this.dropdown);
            this.button.append(this.text, this.actions);
			this.text.append(this.current, this.placeholder);
            this.actions.append(this.clearButton, this.toggleButton);
            this.element.hide().before(this.view);
        },
        _updateOptions: function () {
            var self = this;
            self.options = {};
            self.dropdown_list.empty();
            self.elementOptionsLength = this.element.get(0).options.length;
            self.element.find('option[value][value!=""]').each(function () {
                var option = $('<li><a href="javascript:void(0)"><span>' + $(this).text() + '</span></a></li>');
                option.data({
					'button-class': $(this).data('button-class'),
					'current-class': $(this).data('current-class')
				});
				option.addClass($(this).data('li-class'));
				option.find('a').addClass($(this).data('a-class'));
				option.find('span').addClass($(this).data('span-class'));
                self.dropdown_list.append(option);
                self.options[$(this).val()] = option;
                if ($(this).is(':disabled')) {
                    option.addClass('disabled');
                }
                option.data('value', $(this).val());
            });
			this._fixHeight();
            this._scrollToCurrent();
        },
        _updateSelected: function () {
            var currentValue = this._select(this.element.find(':selected'));
            this.settings.onInit.apply(this.element, [currentValue, this]);
        },
        _fixWidth: function() {
            var width = this.button.width() - this.clearButton.outerWidth() - this.toggleButton.outerWidth();
            this.text.width(width);
        },
        _fixHeight: function() {
			var li = this.dropdown_list.find('li'), items = li.size() <= 5 ? li.size(): 5;
			this.dropdown.height(items * li.outerHeight());
        },
        _applySettings: function () {
            if (this.element.is(':disabled')) {
                this.button.addClass('disabled')
            }
            if (!this.settings.enableClear) {
                this.clearButton.remove();
            }
            if (this.element.data('class')) {
                this.view.addClass(this.element.data('class'));
            }
            if (!this.button.data('original-class')) {
                this.button.data('original-class', this.button.attr('class'));
            }
            if (!this.current.data('original-class')) {
                this.current.data('original-class', this.current.attr('class'));
            }
        },
        _attachEvents: function () {
            var self = this;
            self.view.on('click.boot-select', function (e) {
                e.stopPropagation();
            });
            self.button.on('click.boot-select', function () {
                self.toggle();
            });
            self.clearButton.on('click.boot-select', function (e) {
                e.stopPropagation();
                self.clear();
            });
            self.dropdown.on('click.boot-select', 'li', function () {
                if (!$(this).hasClass('disabled')) {
                    self.select($(this).data('value'));
                    self.hide();
                }
            });
            self.element.on('change.boot-select', function () {
                self.select(this.value);
            });
            $(window).on('resize.boot-select', function() {
                self._fixWidth();
            });
            if (self.settings.keyboardNavigation) {
                $(document).on('keypress.boot-select', function (e) {
                    if (self.visible && /(13|27|38|40)/.test(e.keyCode)) {
						e.stopPropagation();
						e.preventDefault();
                        if (e.keyCode == 27 || e.keyCode == 13) {
                            self.hide();
                        }
                        if (e.keyCode == 38) {
                            var option = self.element.find('option:selected').prevAll('[value][value!=""]:not(:disabled):first');
                            option.index() >= 0 &&  self.select(option);
                        }
                        if (e.keyCode == 40) {
                            var option = self.element.find('option:selected').nextAll('[value][value!=""]:not(:disabled):first');
                            option.index() >= 0 && self.select(option);
                        }
                    }
                });
            }
        },
        _scrollToCurrent: function () {
            this.dropdown.scrollTop(this.dropdown.find('.active').index() * this.dropdown.find('.active').outerHeight() - this.dropdown.outerHeight() / 2);
        },
        _select: function (value) {
            if (value instanceof jQuery) {
                var option = value;
            } else if (value instanceof HTMLElement) {
                var option = $(value);
            } else {
                var option = this.element.find('option[value="' + value + '"]');
            }
            if (!option.val()) {
                this.clear();
            } else if (option.not(':disabled').prop('selected', true).is('option')) {
                if (this.value) {
                    this.options[this.value].removeClass('active');
                }
                this.value = option.val();
                this.options[this.value].addClass('active');
                this.current.text(this.options[this.value].text()).show();
                this.placeholder.hide();
                this.button.attr('class', this.button.data('original-class'));
                if (this.options[this.value].data('button-class')) {
                    this.button.addClass(this.options[this.value].data('button-class'));
                }
                this.current.attr('class', this.current.data('original-class'));
                if (this.options[this.value].data('current-class')) {
                    this.current.addClass(this.options[this.value].data('current-class'));
                }
            }
            this._scrollToCurrent();
			return this.element.val();
        },
        select: function (value) {
			var currentValue = this._select(value);
            this.settings.onChange.apply(this.element, [currentValue, this]);
        },
        clear: function () {
            var empty = this.element.find('option:not([value])');
            if (empty) {
                empty.prop('selected', true);
            } else {
                this.element.prop('selectedIndex', -1);
            }
            this.dropdown.find('.active').removeClass('active');
            this.current.hide();
            this.placeholder.show();
            this.button.attr('class', this.button.data('original-class'));
            this._scrollToCurrent();
        },
        update: function () {
            return this._updateOptions();
        },
        toggle: function () {
            if (this.button.hasClass('disabled')) {
                return;
            }
            if (this.visible) {
                this.hide();
            } else {
                this.show();
            }
        },
        show: function () {
            var self = this;
            this._scrollToCurrent();
            this.button.addClass('active');
            this.dropdown.css('visibility', 'visible').show();
            this.visible = true;
			if('undefined' != typeof $.fn.nanoScroller) {
				this.dropdown.find('.nano').nanoScroller({
					iOSNativeScrolling: true,
					preventPageScrolling: true
				});
			}
            $(document).one('click.boot-select', function (e) {
                self.visible && self.hide();
            });
        },
        hide: function () {
            this._scrollToCurrent();
            this.button.removeClass('active');
            this.dropdown.css('visibility', 'hidden').hide();
            this.visible = false;
        }
    };

    /* PLUGIN DEFINITION */
    $.fn.bootSelect = function (setting) {
        var args = Array.apply(null, arguments);
        args.shift();
        return this.each(function () {
            var $this = $(this), data = $this.data('bootSelect'), settings = typeof setting == 'object' && setting;
            if (!data || typeof data != 'object') {
                $this.data('bootSelect', (data = new Select(this, settings)));
            }
            if (typeof setting == 'string' && typeof data[setting] == 'function' && setting.charAt(0) != '_') {
                return data[setting].apply(data, args);
            } else if (typeof setting == 'string' && typeof data[setting] == 'undefined') {
                jQuery.error("BootSelect: Method \"" + setting + "\" does not exist.");
            }
        });
    };

    $.fn.bootSelect.defaults = {
        enableClear: true,
        keyboardNavigation: true,
        placeholder: 'Выберите из списка',
        clearButton: '&times;',
        toggleButton: '<i class="icon-angle-down"></i>',
        onInit: function () {
        },
        onChange: function () {
        }
    };

}(window.jQuery);
