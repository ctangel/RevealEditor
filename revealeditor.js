(function ($) {
    'use strict';
    $.fn.RevealEditor = function (options) {
        
        // Default setting;
        var settings = $.extend({
            aceTheme: "ace/theme/twilight",
            javascript: true,
            html: true,
            css: true
        }, options);
        
        // Binds Console Output to Editor
        function bindConsole() {
            if (typeof console  !== "undefined") {
                if (typeof console.log !== 'undefined') {
                    console.olog = console.log;
                } else {
                    console.olog = function () {};
                }
            }
            console.log = function (message) {
                console.olog(message);
                $('.output .wrapper .js').append('<p>' + message + '</p>');
            };
            console.error = console.debug = console.info = console.log;
        }
        
        //Parses Javascript Code
        function parseJavascript() {
            var s = "";
            $("#jsEditor .ace_line").each(function () {
                s += $(this).text();
            });
            return s;
        }
        
        //Parses HTML Code
        function parseHtml() {
            var s = "";
            $("#htmlEditor .ace_line").each(function () {
                s += $(this).text();
            });
            return s;
        }
        
        //Parses CSS Code
        function parseCSS() {
            var s = "",
                $lines = $("#cssEditor .ace_line");
            $lines.each(function (index) {
                var temp = $(this).text();
                s += temp;
                if (index === $lines.length - 1) {
                    s = " .output .wrapper .html.css " + s;
                } else {
                    if (temp === "}") {
                        s += " .output .wrapper .html.css";
                    }
                }
            });
            return s;
        }
        
        // Sets Up Editor
        function setUpEditor(este) {
            este.after("<div class='editor'><div class='panel input'><div class='controls'><a class='close'>X</a></div><div class='wrapper'></div></div><div class='panel output'><div class='controls''><a class='run'> Run </a><a class='clear'> Clear </a><a class='copy'>Copy</a><a class='lg'> + </a><a class='sm'> -</a></div><div class='wrapper'></div></div></div></div>");
            if (settings.javascript) {
                $(".input .controls").append("<a class='js active'> Javascript </a>");
                $(".input .wrapper").append("<pre id='jsEditor' class='ace active'></pre>");
                $(".output .wrapper").append("<div class='js active'></div>");
            }
            if (settings.html) {
                $(".input .controls").append("<a class='html'> HTML </a>");
                $(".input .wrapper").append("<pre id='htmlEditor' class='ace'></pre>");
                $(".output .wrapper").append("<div class='html css'></div>");
                if ($(".input .active").length === 0) {
                    $("#htmlEditor").addClass("active");
                    $(".html").addClass("active");
                    $(".output .wrapper .html.css").addClass("active");
                }
            }
            if (settings.css) {
                $(".input .controls").append("<a class='css'> CSS </a>");
                $(".input .wrapper").append("<pre id='cssEditor' class='ace'></pre>");
                if (!$(".output .wrapper .html").length) {
                    $(".output .wrapper").append("<div class='html css'></div>");
                }
                if ($(".input .active").length === 0) {
                    $("#cssEditor").addClass("active");
                    $(".css").addClass("active");
                    $(".output .wrapper .html.css").addClass("active");
                }
            }
            
        }
        
        // Sets Up Ace Javascript Editor
        function setUpAceJSEditor() {
            if (settings.javascript) {
                var jseditor = ace.edit("jsEditor");
                jseditor.setTheme(settings.aceTheme);
                jseditor.session.setMode("ace/mode/javascript");
            }
        }
        
        // Sets Up Ace HTML Editor
        function setUpAceHtmlEditor() {
            if (settings.html) {
                var htmleditor = ace.edit("htmlEditor");
                htmleditor.setTheme(settings.aceTheme);
                htmleditor.session.setMode("ace/mode/html");
            }
        }
        
        // Sets Up Ace CSS Editor
        function setUpAceCssEditor() {
            if (settings.css) {
                var htmleditor = ace.edit("cssEditor");
                htmleditor.setTheme(settings.aceTheme);
                htmleditor.session.setMode("ace/mode/css");
            }
        }
        
        // Sets Up Editor controls
        function setUpControls(este) {
            este.on("click", function () {
                $(".editor").toggle();
            });
            
            $(".run").click(function () {
                if ($("#jsEditor").hasClass("active")) {
                    var s = parseJavascript();
                    $("body").append("<script class='script'>" + s + "</script>");
                    $(".script").remove();
                } else if ($("#cssEditor").hasClass("active") || $("#htmlEditor").hasClass("active")) {
                    var css = parseCSS(),
                        html = parseHtml();
                    $("head .style").remove();
                    $(".output .wrapper .html.css").empty().append(html);
                    $("head").append("<style class='style'>" + css + "</style>");
                }
            });

            $(".clear").click(function () {
                if ($("#jsEditor").hasClass("active")) {
                    $(".output .wrapper .js").empty();
                } else if ($("#cssEditor").hasClass("active") || $("#htmlEditor").hasClass("active")) {
                    $(".output .wrapper .html.css").empty();
                }
            });
            
            $(".close").on("click", function () {
                $(".editor").hide();
            });
            
            $(".html").on("click", function () {
                $(".active").toggleClass("active");
                $("#htmlEditor").toggleClass("active");
                
                $(".output .wrapper .js").hide();
                $(".output .wrapper .html.css").show();
                $(".html").toggleClass("active");
            });
            
            $(".js").on("click", function () {
                $(".active").toggleClass("active");
                $("#jsEditor").toggleClass("active");
                $(".output .wrapper .html.css").hide();
                $(".output .wrapper .js").show();
                $(".js").toggleClass("active");
            });
            
            $(".css").on("click", function () {
                $(".active").toggleClass("active");
                $("#cssEditor").toggleClass("active");
                $(".output .wrapper .js").hide();
                $(".output .wrapper .html.css").show();
                $(".css").toggleClass("active");
            });
            
            $(".lg").on("click", function () {
                var i = parseInt($(".editor .ace").css("font-size"), 10),
                    j = parseInt($(".editor .output .wrapper .js p").css("font-size"), 10);
                $(".editor .ace").css("font-size", i + 1);
                $(".editor .output .wrapper .js p").css("font-size", j + 1);
            });
            
            $(".sm").on("click", function () {
                var i = parseInt($(".editor .ace").css("font-size"), 10),
                    j = parseInt($(".editor .output .wrapper .js p").css("font-size"), 10);
                $(".editor .ace").css("font-size", i - 1);
                $(".editor .output .wrapper .js p").css("font-size", j - 1);
            });
            
            $(".copy").on("click", function () {
                var s = $(".present code").text(),
                    id = $(".ace.active").attr('id');
                ace.edit(id).getSession().setValue(s);
            });
        }
        
        // Initializes Editor
        function init(este) {
            setUpEditor(este);
            setUpAceJSEditor();
            setUpAceHtmlEditor();
            setUpAceCssEditor();
            setUpControls(este);
            bindConsole();
        }
        
        init(this);
    };
}(jQuery));