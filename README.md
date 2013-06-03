boot-select
===========

Custom HTML select box based on [twitter bootstrap](https://github.com/twitter/bootstrap) components.

Installation
-----------
It's quite simple and will take few minutes :)

*The next steps assume that you have already include [jQuery](http://jquery.com) and [Bootstrap](https://github.com/twitter/bootstrap) on your page.*

[Download](https://github.com/mitris/boot-select/archive/master.zip) and include `boot-select.css` and `boot-select.js` on your page:
```html
<html>
  <head>
    ...
    <link rel="bootstrap.css">
    <link rel="boot-select.css">
    ...
  </head>
  <body>
    ...
    <select id="your-select">
      <!-- options -->
    </seelct>
    ...
    <script src="jquery.js"></script>
    <script src="bootstrap.js"></script>
    <script src="boot-select.js"></script>
  </body>
</html>
```
```javascript
$(function() {
  $('#your-select').bootSelect(/* options */)
});
```
That's it :) Profit!

<!--
### Optional
Simply include [nanoScroller](http://jamesflorentino.github.io/nanoScrollerJS/) on your page and ugly browser scroll would replaced with nice scroll :)
-->

Example with all supported options provided by default:
-----------
```javascript
$('#your-select').bootSelect({
  enableClear: true,
  keyboardNavigation: true,
  placeholder: 'Выберите из списка',
  clearButton: '&times;',
  toggleButton: '<i class="icon-angle-down"></i>',
  onInit: function () {
    // your own logic here...
  },
  onChange: function () {
    // your own logic here...
  }
});
```
Options:
-----------
**enableClear** - Show clear button near caret icon.

**keyboardNavigation** - Enable `esc` `return` `up` and `down` keyboard buttons, when dropdown list is activated

**placeholder** - Placeholder text/html. Showing when nothing selected or `<select>` cleared.

**clearButton** - text/html for clear button

**toggleButton** - text/html for toggle button. By default it is one of Font-Awesome icon. You can change it to any Bootstrap icon.

**onInit** *function* - Called, when sets selection of selected default option.

**onChange** *function* - Called, when selected option was changed.

Public methods:
-----------
**clear** - Clear selected value, or if select not have empty option set `selectedIndex` to `-1`

**select** - Select value. Accepts one argument - value of option, native `<option>`, or `<option>` wrapped with jQuery

**update** - Use this, when you add/remove options on your select dynamically (for example, you manually add option via `$('#your-select').append('<option value="new">New</option>)` )

**toggle** - Toggle show/hide dropdown

**show** - Show dropdown. *Known issue with show: does't work properly*

**hide** - Hide dropdown


Usage of methods:
```javascript
  $('#your-select').bootSelect('clear');
  ...
  $('#your-select').bootSelect('select', 'value');
```

Depends on:
-----------
- [jQuery](http://jquery.com) (tested on 1.9.1)
- [Bootstrap](https://github.com/twitter/bootstrap) (2.3.1 or 2.3.2)

<!--
- (optional) [nanoScroller](http://jamesflorentino.github.io/nanoScrollerJS/) (tested on 0.7.2)
-->


#### @TODO
- [ ] Support of `<optgroup>` tag

You can request any additional functionality with the [issue](You can request any additional functionality with the issue and if it will be useful, I'll try to implement it.) and if it will be useful, I'll try to implement it.
