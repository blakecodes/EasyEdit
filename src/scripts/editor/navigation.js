// TODO
// Setup clicking on nav items to show config for that item
// Setup content editable trigger to change names
// Verify exportd ata is correct

$(function () {
    var navIndex = 0;


    //
    // ─── EVENT HANDLERS ──────────────────────────────────────────────────────────────────────
    //
    var builder = dragula({
        containers: [document.querySelector('.nav-draggable')],
        copy: true,
        copySortSource: true,
        isContainer: function (el) {
            return el.classList.contains('addNav');
        }
    });

    $('body').on('click', '.delete-nav', function () {
        $(this).parent('li').remove();
    });



    // ────────────────────────────────────────────────────────────────────────────────

    //
    // ─── ATTRIBUTE EDITOR ───────────────────────────────────────────────────────────
    //

    function generateURL() {
        return window.location.hostname;
    }

    // ────────────────────────────────────────────────────────────────────────────────


    //
    // ─── OBJECT BUILDER ─────────────────────────────────────────────────────────────
    //

    class LinkEditor {
        constructor() {
            this.editor = $('#link-list');
        }

        buildLinks(links) {
            links.map(link => {
                let li = document.createElement('li');
                let img = document.createElement('img');
                let span = document.createElement('span');


                span.innerHTML = link.text;
            });
        }

        buildLinkEditor() {

        }
    }

    //Navigation building component
    class NavBuilder extends LinkEditor {
        constructor() {
            super();

            var app = this;
            app.navigation = [];

            this.buildLinkEditor();
            this.get();
        }

        init() {
            this.build();
            this.design();
        }

        // Get the websites navigation content on initial page load
        get() {
            $.ajax({
                url: '/api/navigation/main.json',
                type: 'GET'
            }).done(res => {
                app.navigation = res;
            });
        }

        //Set a unique identifier to each label
        assing() {
            navIndex = 0;
            $('.nav-label').each(function () {
                let current = $(this).data('nav-index');

                if (!current) {
                    $(this).data('nav-index', navIndex);
                    $(this).attr('data-nav-index', navIndex);
                    navIndex++;
                }
            });
        }

        // Finds the second layer down of navigation
        checkDouble(e) {
            var elements = [];

            $(e).parent('li').find('ul .nav-label').each(function () {
                let html = $(this).html();
                let index = $(this).data('nav-index');
                elements.push({
                    text: html,
                    index: index
                });
            });

            return elements.length > 0 ? elements : false;
        }

        // Finds the third layer down of elements
        checkTripple(e) {
            var elements = [];

            $(e).parent('li').find('ul .nav-label').each(function () {
                let html = $(this).html();
                let index = $(this).data('nav-index');
                elements.push({
                    text: html,
                    index: index
                });
            });

            console.log('triple', elements);

            return elements.length > 0 ? elements : false;
        }

        // Generate a bootstrap dropdown
        generateDropdown(title, nested) {

            // Generate the list items
            function generateList(group) {
                var main = document.createElement('div');
                main.className = 'dropdown-menu';
                main.setAttribute('aria-labelledby', 'navbarDropwdownMenuLink');

                group.map(item => {
                    var el = document.createElement('a');
                    el.className = 'dropdown-item';
                    el.href = 'href';
                    el.innerHTML = item.text;

                    main.append(el);
                });

                return main;
            }

            // Generate the holder
            function generateHolder() {
                var main = document.createElement('li');
                main.className = 'nav-item dropdown';

                var a = document.createElement('a');
                a.className = 'nav-link dropdown-toggle';
                a.setAttribute('data-toggle', 'dropdown');
                a.setAttribute('aria-haspopup', 'true');
                a.setAttribute('aria-expanded', 'false');
                a.href = void(0);
                a.innerHTML = title;

                main.append(a);
                main.append(generateList(nested));

                return main;
            }


            return generateHolder();
        }

        // Basic bootstrap navigation item
        generateBootstrapLink(title) {
            var main = document.createElement('li');
            main.className = 'nav-item';

            var a = document.createElement('a');
            a.className = 'nav-link';
            a.innerHTML = title;
            a.href = void(0);

            main.append(a);

            return main;
        }

        // Build the html content layout for the navigation
        design() {
            var navBar = $('#link-holder');
            navBar.html(' ');
            app.navigation.map(nav => {
                // Create dropdown
                if (nav.nested.length > 0) {
                    navBar.append(this.generateDropdown(nav.text, nav.nested));
                } else { // Create single level
                    navBar.append(this.generateBootstrapLink(nav.text));
                }
            });
        }


        // Develop the full structure of the navigation into an object
        build() {
            app.navigation = [];

            this.assing();

            // Add the item to the main object
            $('#link-list > li > .nav-label').each(function () {
                let html = $(this).html();
                let index = $(this).data('nav-index');

                app.navigation.push({
                    text: html,
                    index: index,
                    nested: app.checkDouble(this),
                    pageTitle: 'test',
                    pageName: 'test',
                    pageDescription: 'test',
                    pageUrl: 'test'
                });
            });
        }

    }

    // ────────────────────────────────────────────────────────────────────────────────


    //
    // ─── CONTENT EDITOR ─────────────────────────────────────────────────────────────
    //


    function formControl(name) {
        return $('.form-control[name="' + name + '"]');
    }

    // Load model into the form
    function loadModel(model) {
        console.log('Page Model', model);
        formControl('pageTitle').val(model.pageTitle);
        formControl('pageName').val(model.pageName);
        formControl('pageDescription').val(model.pageDescription);
        formControl('pageIndex').val(model.index);

        formControl('pageUrl').val(model.pageUrl);
    }

    function saveModel() {
        let index = formControl('pageIndex').val();

        var update = $.grep(app.navigation, function (model) {
            if (model.index == index) {
                console.log(model);
                model.pageTitle = formControl('pageTitle').val();
                model.pageName = formControl('pageName').val();
                model.pageDescription = formControl('pageDescription').val();
            }
        });
    }

    // ────────────────────────────────────────────────────────────────────────────────


    //
    // ─── PAGE LEVEL FUNCTIONALITY ───────────────────────────────────────────────────
    //

    // Run
    var app = new NavBuilder();
    app.init();

    builder.on('drop', function (el, target, source, sibling) {
        app.init();
    });

    $('body').on('click', '.delete-nav', function () {
        app.init();
    });

    // Navigation labels
    $('body').on({
        'keyup': function () {
            app.init();
        },
        'click': function () {
            let index = $(this).data('nav-index');

            var result = $.grep(app.navigation, function (e) {
                return e.index == index;
            });

            loadModel(result[0]);
        }
    }, '.nav-label');


    //Save attributes
    $('#attrForm').on({
        'submit': function (e) {
            e.preventDefault();

            saveModel();
        }
    });




    // ────────────────────────────────────────────────────────────────────────────────


});