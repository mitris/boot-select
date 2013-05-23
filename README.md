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

Add attribure `data-boot-select="true"` to `<select>` tag which you want custom:
```html
<select id="your-select" data-boot-select="true">
  <!-- options -->
</seelct>
```
Or just:
```javascript
$(function() {
  $('#your-select').bootSelect(/* options */)
});
```
That's it :) Profit!

### Optional
Simply include [nanoScroller](http://jamesflorentino.github.io/nanoScrollerJS/) on your page and ugly browser scroll would replaced with nice scroll :)

Feautures
-----------
1. Support `data-` API. All plugin options can override with `data-` attributes.
2. You can customize `<select>` and `<option>` tag with `data-` attributes.

Much more features see on demo page.

Example with all supported options provided by default:
-----------
```javascript
$('#your-select').bootSelect.defaults = {
  debug: false,
  enableClear: true,
  autoClose: true,
  keyboardNavigation: true,
  size: 'input-initial',
  placeholder: "Select from list",
  onChange: function() {
    // your own logic here...
  },
  onChangeBefore: function() {
    // your own logic here...
  }
};
```
Options:
-----------
**debug** - Original `<select>` doesn't hide.

**enableClear** - Show clear button near caret icon.

**autoClose** - Hide dropdown list when clicked otherwhere, set to <false> if you want to close it manually

**keyboardNavigation** - Enable `esc` `return` `up` and `down` keyboard buttons, when dropdown list is activated

**size** *string* - CSS class, who applied to select. Nice works with Bootstrap `input-` classes: `input-mini` `input-small` `input-medium` `input-large` `input-xlarge` `input-xxlarge`

**onChange** *function* - Called, when selected option was changed.

**onChangeBefore** *function* - Called on change, but before any manipulations will be made with `<option>` and `<select>`.

Depends on:
-----------
- [jQuery](http://jquery.com) (tested on 1.9.1)
- [Bootstrap](https://github.com/twitter/bootstrap) (2.3.1 or 2.3.2)
- (optional) [nanoScroller](http://jamesflorentino.github.io/nanoScrollerJS/) (tested on 0.7.2)


#### @TODO
- [ ] Support of `<optgroup>` tag
- [ ] Specific design for `<select>` `<optgroup>` `<option>`  via `data-` attributes, maybe with parametrs in constructor
- [ ] Handle disabled tags: `<select>` `<optgroup>` `<option>`
- [ ] In future add support of simple templating
- [ ] Some useful functionality :)

You can request any additional functionality with the [issue](You can request any additional functionality with the issue and if it will be useful, I'll try to implement it.) and if it will be useful, I'll try to implement it.
