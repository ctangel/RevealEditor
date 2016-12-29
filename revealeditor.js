(function ($) {
    'use strict';
    $.fn.RevealEditor = function (options) {

        // Default setting;
        var settings = $.extend({
            aceTheme: "ace/theme/twilight",
            javascript: true,
            html: true,
            css: true,
            fontSize: 18
        }, options);

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
            });
            return s;
        }

        // Sets Up Editor
        function setUpEditor(este) {
            este.after("<div class='editor'><div class='panel input'><div class='controls'><a class='close'>X</a></div><div class='wrapper'></div></div><div class='panel output'><div class='controls''><a class='run'> Run </a><a class='clear'> Clear </a><a class='copy'>Copy</a><a class='lg'> + </a><a class='sm'> -</a></div><div class='console wrapper js active'></div><iframe sandbox='allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation' class='iframe wrapper html css' srcdoc=''></iframe></div></div></div>");
            if (settings.javascript) {
                $(".input .controls").append("<a class='js active'> Javascript </a>");
                $(".input .wrapper").append("<pre id='jsEditor' class='ace active'></pre>");
                $(".console.wrapper.js").addClass("active");
            }
            if (settings.html) {
                $(".input .controls").append("<a class='html'> HTML </a>");
                $(".input .wrapper").append("<pre id='htmlEditor' class='ace'></pre>");
                if ($(".input .active").length === 0) {
                    $("#htmlEditor").addClass("active");
                    $(".wrapper.js").removeClass("active");
                    $(".html").addClass("active");
                    $(".output .wrapper.html.css").addClass("active");
                }
            }
            if (settings.css) {
                $(".input .controls").append("<a class='css'> CSS </a>");
                $(".input .wrapper").append("<pre id='cssEditor' class='ace'></pre>");
                if (!$(".output .wrapper.html").length) {
                    $(".output .wrapper").append("<div class='html css'></div>");
                }
                if ($(".input .active").length === 0) {
                    $("#cssEditor").addClass("active");
                    $(".css").addClass("active");
                    $(".output .wrapper.html.css").addClass("active");
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
                Reveal.configure({
                    keyboard: false
                });
            });

            $(".run").click(function () {
                var js = parseJavascript(),
                    css = parseCSS(),
                    html = parseHtml(),
                    t = "<script> var div = parent.document.body.getElementsByClassName('console'); var console = {panel: div,log: function(m){this.panel[0].innerHTML = this.panel[0].innerHTML + '<p>' + m + '</p>';} }; </script>",
                    s = t + "<style class='style'>" + css + "</style>" + html + "<script class='script'>" + js + "</script>";
                $(".iframe").attr("srcdoc", s);
            });

            // Sets up eventHandlers for btn clicks
            $(".clear").click(function () {
                if ($("#jsEditor").hasClass("active")) {
                    $(".output .wrapper.js").empty();
                } else if ($("#cssEditor").hasClass("active") || $("#htmlEditor").hasClass("active")) {
                    $(".iframe").attr("srcdoc", "");
                }
            });

            $(".close").on("click", function () {
                $(".editor").hide();
                Reveal.configure({
                    keyboard: true
                });
            });

            $("a.html").on("click", function () {
                $(".active").toggleClass("active");
                $("#htmlEditor").toggleClass("active");

                $(".output .wrapper.js").hide();
                $(".output .wrapper.html.css").show();
                $(".html").toggleClass("active");
            });

            $("a.js").on("click", function () {
                $(".active").toggleClass("active");
                $("#jsEditor").toggleClass("active");
                $(".output .wrapper.html.css").hide();
                $(".output .wrapper.js").show();
                $(".js").toggleClass("active");
            });

            $("a.css").on("click", function () {
                $(".active").toggleClass("active");
                $("#cssEditor").toggleClass("active");
                $(".output .wrapper.js").hide();
                $(".output .wrapper.html.css").show();
                $(".css").toggleClass("active");
            });

            $(".lg").on("click", function () {
                settings.fontSize += 1;
                $(".editor .ace").css("font-size", settings.fontSize);
                $(".editor .output .wrapper.js p").css("font-size", settings.fontSize);
            });

            $(".sm").on("click", function () {
                settings.fontSize -= 1;
                $(".editor .ace").css("font-size", settings.fontSize);
                $(".editor .output .wrapper.js p").css("font-size", settings.fontSize);
            });

            $(".copy").on("click", function () {
                var $section = $("section.present:not(.stack)"),
                    s = $section.find("code").text(),
                    id = $(".ace.active").attr("id");
                if ($section.has('.hljs.html').length !== 0) {
                    id = $(".ace#htmlEditor").attr('id');
                    $(".active").toggleClass("active");
                    $("#htmlEditor").toggleClass("active");
                    $(".output .wrapper.js").hide();
                    $(".output .wrapper.html.css").show();
                    $(".html").toggleClass("active");
                } else if ($section.has('.hljs.css').length !== 0) {
                    id = $(".ace#cssEditor").attr('id');
                    $(".active").toggleClass("active");
                    $("#cssEditor").toggleClass("active");
                    $(".output .wrapper.js").hide();
                    $(".output .wrapper.html.css").show();
                    $(".css").toggleClass("active");
                } else if ($section.has('.hljs.js').length !== 0) {
                    id = $(".ace#jsEditor").attr('id');
                    $(".active").toggleClass("active");
                    $("#jsEditor").toggleClass("active");
                    $(".output .wrapper.html.css").hide();
                    $(".output .wrapper.js").show();
                    $(".js").toggleClass("active");
                }
                ace.edit(id).getSession().setValue(s, 1);
            });
        }

        // Sets Up Copy Btn logic
        function enableCopyBtnLogic() {
            var $slide = $("section.present:not(.stack)");
            if ($slide.has(".hljs").length !== 0) {
                $(".copy").show();
            } else {
                $(".copy").hide();
            }
        }

        // Initializes Editor
        function init(este) {
            setUpEditor(este);
            setUpAceJSEditor();
            setUpAceHtmlEditor();
            setUpAceCssEditor();
            setUpControls(este);
            enableCopyBtnLogic();

            // Sets up Reveal Slide eventhandlers
            Reveal.addEventListener("slidechanged", function (event) {
                enableCopyBtnLogic();
            });
        }

        init(this);
    };
}(jQuery));
