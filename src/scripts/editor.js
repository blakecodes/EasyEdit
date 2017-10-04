// TODO:
// 1. Rememberance of loaded components
// 2. Rememberance of scripts loaded


$(function () {
    var editingOn = false;
    var componentSelector = "[data-component]";
    var editableToolbar = $('.editable-toolbar');
    var specialEditorHolder = $('.expanded-editor');
    var specialEditor = $('#special-editor');

    var builder;

    var builder = dragula({
        containers: [document.querySelector('.component-list')],
        copy: true,
        isContainer: function (el) {
            return el.classList.contains('addContent');
        }
    });

    builder.on('drop', function (el, target, source, sibling) {
        replaceComponentHandler();
    });

    // Event bindings
    $('body').on('click', '[data-tool="inline"]', function () {
        editingOn = !editingOn;
        editingOn ? enableEditing('.selected-content') : disableEditing('.selected-content');
    });

    // Toolbar selection
    $("body").on('click', componentSelector, function () {
        if (editableToolbar.is(':visible') && editingOn == false) {
            componentDestroy(this);
        } else {
            componentInit(this);
        }
    });

    $('body').on('click', '[data-special-tool]', function () {
        var type = $(this).data('special-tool');
        loadSpecialEditor(type, function () {
            specialEditorHolder.show();
        });
    });

    // Initialize the component
    function componentInit(e) {
        $(e).addClass('selected-content');
        editableToolbar.show();

        var top = $(e).offset().top;
        var left = $(e).offset().left;
        var componentType = $(e).data('component');

        top = top - editableToolbar.outerHeight();

        editableToolbar.offset({
            top: top,
            left: left
        });

        loadComponent(componentType);
    }

    // Destroy the component
    function componentDestroy(e) {
        $(e).removeClass('selected-content');
        editableToolbar.hide();
    }

    // Determine which editing options need to be enabled
    function determineTools(tools) {
        var toolBar = $('.editable-toolbar');
        toolBar.html(' ');

        $.each(tools, function () {
            var li = document.createElement("i");
            li.className = "glyph-icon editoricon-" + this.name;

            if (this.special) {
                li.setAttribute("data-special-tool", this.tool);
            } else {
                li.setAttribute("data-tool", this.tool);
            }

            toolBar.append(li);
        });
    }

    // Inline editing methods
    function enableEditing(selector) {
        $(selector).attr('contenteditable', true)
            .addClass('editing-content');
    }

    //Disable editing and hide toolbar
    function disableEditing(selector) {
        $(selector)
            .attr('contenteditable', false)
            .removeClass('editing-content');
        editableToolbar.hide();
    }

    // Component duplication
    function copyComponent(selector) {

    }

    function pasteComponent() {

    }


    //Initial load of coponent
    function loadComponent(url) {
        $.getJSON("/src/app/components/singles/component." + url + ".json", function (data) {
            $.each(data.Component.Scripts, function () {
                console.log('Loading script: ' + this);
            });
            determineTools(data.Component.Tools);
        });
    }

    //Find component structure information
    function findComponent(component) {
        var data;

        $.ajax({
            url: "/src/app/components/singles/component." + component + ".json",
            async: false,
            type: 'GET',
            dataType: "JSON",
            success: function (res) {
                data = res;
            }
        });

        return data;
    }

    //Find component bindings and replace them with the content
    function replaceComponentHandler() {
        $('.page-content [data-find-component]').each(function () {
            var type = $(this).data('find-component');

            var component = findComponent(type);

            $(this).replaceWith(component.Component.Content);
        });
    }

    function openSpecialEditor(type) {

    }


    function loadSpecialEditor(type, callback) {
        $.getJSON("/src/app/editors/editor." + type + ".json", function (data) {
            specialEditor.html(data.Editor.Content);

            $.each(data.Editor.Scripts, function () {
                var s = document.createElement('script');
                s.type = "text/javascript";
                s.src = this;
                $('body').append(s);
            });

            callback();
        });
    }




});