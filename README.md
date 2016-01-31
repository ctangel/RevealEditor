# Reveal Editor

An editor for coding demonstrations designed for the HTML presentation platform [reveals.js](https://github.com/hakimel/reveal.js/). 

The editor will allow for Javascript, HTML, and CSS coding without ever exiting the fullscreen presentation. 

The editor was designed to be used with reveal.js, it does not need reveal.js to function.

Checkout the [demo](http://ctangel.github.io/RevealEditor/index.html)!

## Dependencies
It does depend on jQuery and [Ace Editor](https://github.com/ajaxorg/ace-builds/). Ace requires the entire contents of the src-noconflict folder.

```html
<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script> 
<script src="src-noconflict/ace.js"></script> 
```


## Instructions
To properly install the plugin, you must add the style.css file and plugin.js file to your html document. Create an element, such as a button, that you will select to and call the plugin's function on.

```html
<head>
    <link rel="stylesheet" href="style.css">
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
    <script src="revealeditor.js"></script>
</head>
<body>
    <a class="btn"> Open </a>
</body>
<script>
    $(".btn").RevealEditor();
</script>
```

### Copy Code on Slides
The editor allows you to copy any code you have on the current active slide into the active editor by pressing the Copy button.

To ensure that you properly copy your code, make sure your code is enclosed in a code tag like this:

```html
<pre><code class="hljs js" data-trim contenteditable>
function multiply(a, b) {
    return a * b;
}

console.log(multiply(4, 5));
</code></pre>
```

Be sure to use the class 'js', 'html', or 'css' depending on the type of code contained in the pre-code block.

## Options
By default Javascript, HTML, and CSS editors are enabled, but you can disable the ones you do not need. You also have access to change the theme of the Ace editor

```javascript
    RevealEditor({
        aceTheme: "ace/theme/twilight",
        javascript: true,
        html: true,
        css: true,
        fontSize: 18
    });
```

If you want to make changes simply overwrite the default options like so:
```javascript
    RevealEditor({
        aceTheme: "ace/theme/xcode",
        javascript: true,
        html: false,
        css: false,
        fontSize: 24
    });
```
