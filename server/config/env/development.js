'use strict';

module.exports = {
	app: {
		title: 'Uniwebex - Development'
	},
	db: 'postgres://postgres:password@localhost:5432/site',
	maxNodesCount: 1,
	workerStatePeriod: 1000 * 60 * 60 * 24, // 24 hr
	workerStateCheckTimeout: 1000 * 60, // 1 min
	workerStateOverheadRatio: 10,
	port: process.env.PORT || 80,
	sessionExpirationTime: 1000 * 60 * 60 * 24, // 24h
	repositoryChildFilesLimit: 3,
	repositoryChildFoldersLimit: 3,
    assets: {
        lib: {
            css: [
                'client/lib/bootstrap/dist/css/bootstrap.css',
                'client/lib/bootstrap/dist/css/bootstrap-theme.css',
                'client/lib/angular-ui-grid/ui-grid.css',
                'client/lib/angular-ui-layout/src/ui-layout.css',
                'client/lib/angular-material/angular-material.css'
            ],
            js: [
                'client/lib/jquery/dist/jquery.js',
                'client/lib/angular/angular.js',
                'client/lib/angular-resource/angular-resource.js',
                'client/lib/angular-cookies/angular-cookies.js',
                'client/lib/angular-animate/angular-animate.js',
                'client/lib/angular-touch/angular-touch.js',
                'client/lib/angular-sanitize/angular-sanitize.js',
                'client/lib/angular-ui-router/release/angular-ui-router.js',
                'client/lib/angular-ui-grid/ui-grid.js',
                'client/lib/angular-ui-layout/src/ui-layout.js',
                'client/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                'client/lib/angular-aria/angular-aria.js',
                'client/lib/angular-material/angular-material.js',
                'https://cdn.socket.io/socket.io-1.3.4.js'
            ]
        },
        css: [
            'client/css/**/*.css'
        ],
        js: [
            'client/application/config.js',
            'client/application/application.js',
            'client/application/constants.js',
            'client/application/*/*.js',
            'client/application/*/*/*.js'
        ]
    }
};