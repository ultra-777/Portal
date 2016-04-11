var GulpConfig = (function () {
    function GulpConfig() {

        var wwwRoot = this;

        wwwRoot.target = {
            root: './wwwroot',
            stylesFileName: 'app.css',
            indexFileName: 'index.html',
            libsFolderName: 'libs',
            appFolderName: 'app',
            fontFolderName: 'fonts',
            getAppFolderPath: function () {
                return this.root + '/' + this.appFolderName;
            },
            getLibsFolderPath: function () {
                return this.root + '/' + this.libsFolderName;
            },
            getFontFolderPath: function () {
                return this.root + '/' + this.fontFolderName;
            },
            getCleanPath: function () {
                return [
                    this.getAppFolderPath(),
                    this.getLibsFolderPath(),
                    this.getFontFolderPath(),
                    this.root + "/*.*",
                    '!' + this.root + '/web.config'
                ];
            }
        };

        var sourcesRoot = './client';
        var node_modules = './node_modules';
        wwwRoot.source = {
            application: sourcesRoot,
            bootstrap: sourcesRoot + '/bootstrap.ts',
            favicon: [sourcesRoot + '/favicon.ico', sourcesRoot + '/favicon-32.png'],
            appGrain: sourcesRoot + '/app_grain.png',
            index: {
                base: sourcesRoot + '/index.html',
                development: sourcesRoot + '/index.development.html',
                production: sourcesRoot + '/index.production.html'
            },
            ts: [
                sourcesRoot + '/app/**/*.ts'
            ],
            templates: [
                sourcesRoot + '/*/**/*.html'
            ],
            icons: [
                sourcesRoot + '/*/**/*.png',
                sourcesRoot + '/*/**/*.gif',
                sourcesRoot + '/*/**/*.tiff'
            ],
            less: [
                sourcesRoot + '/**/*.less',
            ],
            vendors: {
                development: {
                    js: [
                        node_modules + '/angular2/es6/dev/src/testing/shims_for_IE.js',
                        node_modules + '/angular2/bundles/angular2-polyfills.js',
                        node_modules + '/systemjs/dist/system.src.js',
                        node_modules + '/rxjs/bundles/Rx.js',
                        node_modules + '/angular2/bundles/angular2.dev.js',
                        node_modules + '/angular2/bundles/router.dev.js',
                        node_modules + '/angular2/bundles/http.dev.js',
                        node_modules + '/jquery/dist/jquery.js',
                        node_modules + '/ms-signalr-client/jquery.signalr-2.2.0.js',
                        node_modules + '/moment/min/moment.min.js',
                        node_modules + '/ng2-bootstrap/bundles/ng2-bootstrap.js'

                    ],
                    css: [
                        node_modules + '/bootstrap/dist/css/bootstrap.css'
                    ]
                },
                production: {
                    js: [
                        /*
                        node_modules + '/angular2/es6/dev/src/testing/shims_for_IE.js',
                        node_modules + '/angular2/bundles/angular2-polyfills.min.js',
                        node_modules + '/systemjs/dist/system.js',
                        node_modules + '/rxjs/bundles/Rx.min.js',
                        node_modules + '/angular2/bundles/angular2.min.js',
                        node_modules + '/angular2/bundles/router.min.js',
                        node_modules + '/angular2/bundles/http.min.js',
                        node_modules + '/jquery/dist/jquery.min.js',
                        node_modules + '/ms-signalr-client/jquery.signalr-2.2.0.min.js',
                        node_modules + '/moment/min/moment.min.js',
                        node_modules + '/ng2-bootstrap/bundles/ng2-bootstrap.min.js'
                        */
                        node_modules + '/angular2/es6/dev/src/testing/shims_for_IE.js',
                        node_modules + '/angular2/bundles/angular2-polyfills.min.js',
                        node_modules + '/systemjs/dist/system.js',
                        node_modules + '/rxjs/bundles/Rx.min.js',

                        node_modules + '/angular2/bundles/angular2.dev.js',
                        node_modules + '/angular2/bundles/router.dev.js',

                        node_modules + '/angular2/bundles/http.min.js',
                        node_modules + '/jquery/dist/jquery.min.js',
                        node_modules + '/ms-signalr-client/jquery.signalr-2.2.0.min.js',
                        node_modules + '/moment/min/moment.min.js',
                        node_modules + '/ng2-bootstrap/bundles/ng2-bootstrap.min.js'
                    ],
                    css: [
                        node_modules + '/bootstrap/dist/css/bootstrap.min.css',
                        node_modules + '/bootstrap/dist/css/bootstrap.min.css.map'
                    ]
                },
                fonts: [
                    node_modules + '/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf',
                    node_modules + '/bootstrap/dist/fonts/glyphicons-halflings-regular.woff',
                    node_modules + '/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2',
                    node_modules + '/bootstrap/dist/fonts/glyphicons-halflings-regular.svg',
                ]

            }
        };

    }
    return GulpConfig;
})();
module.exports = GulpConfig;