/* ============================================================
 * boot-select.js v2.0.0
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
            this.current = $('<span class="current"></span>');
            this.placeholder = $('<span class="placeholder">' + this.settings.placeholder + '</span>');
            this.actions = $('<span class="actions"></span>');
            this.clearButton = $('<span class="clear">' + this.settings.clearButton + '</span>');
            this.toggleButton = $('<span class="toggle">' + this.settings.toggleButton + '</span>');
            this.dropdown = $('<ul class="dropdown-menu"></ul>');
            this.view.append(this.button, this.dropdown);
            this.button.append(this.current, this.placeholder, this.actions);
            this.actions.append(this.clearButton, this.toggleButton);
            this.element.hide().before(this.view);
        },
        _updateOptions: function () {
            var self = this;
            self.options = {};
            self.dropdown.empty();
            self.elementOptionsLength = this.element.get(0).options.length;
            self.element.find('option[value][value!=""]').each(function () {
                var option = $('<li><a href="#">' + $(this).text() + '</a></li>');
                option.data('button-class', $(this).data('button-class'));
                if ($(this).data('class')) {
                    option.addClass($(this).data('class'));
                }
                self.dropdown.append(option);
                self.options[$(this).val()] = option;
                if ($(this).is(':disabled')) {
                    option.addClass('disabled');
                }
                option.data('value', $(this).val());
            });
            this._scrollToCurrent();
        },
        _updateSelected: function () {
            this._select(this.element.find(':selected'));
        },
        _fixWidth: function() {
            var width = this.button.width() - this.clearButton.outerWidth() - this.toggleButton.outerWidth();
            this.current.width(width);
            this.placeholder.width(width);
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
                    e.stopPropagation();
                    if (self.visible && /(13|27|38|40)/.test(e.keyCode)) {
                        if (e.keyCode == 27 || e.keyCode == 13) {
                            self.hide();
                        }
                        if (e.keyCode == 38) {
                            var option = self.element.find('option:selected').prevAll('[value][value!=""]:not(:disabled):first');
                            log(option, option.index())
                            if (option.index() > 0) {
                                self.select(option);
                            }
                        }
                        if (e.keyCode == 40) {
                            var option = self.element.find('option:selected').nextAll('[value][value!=""]:not(:disabled):first');
                            log(option, option.index())
                            if (option.index() > 0) {
                                self.select(option);
                            }
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
            }
            this._scrollToCurrent();
        },
        select: function (value) {
            this._select(value);
            this.settings.onChange();
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
            this.dropdown.show();
            this.visible = true;
            $(document).one('click.boot-select', function (e) {
                self.visible && self.hide();
            });
        },
        hide: function () {
            this._scrollToCurrent();
            this.button.removeClass('active');
            this.dropdown.hide();
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
        onChange: function () {
        }
    };

}(window.jQuery);
