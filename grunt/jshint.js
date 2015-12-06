module.exports = {

    options: {
        reporter: require('jshint-stylish'),
        "node": true, // Enable globals available when code is running inside of the NodeJS runtime environment.
        "browser": true, // Standard browser globals e.g. `window`, `document`.
        "esnext": true, // Allow ES.next specific features such as `const` and `let`.
        "bitwise": false, // Prohibit bitwise operators (&, |, ^, etc.).
        "camelcase": false, // Permit only camelcase for `var` and `object indexes`.
        "curly": false, // Require {} for every new block or scope.
        "eqeqeq": true, // Require triple equals i.e. `===`.
        "immed": true, // Require immediate invocations to be wrapped in parens e.g. `( function(){}() );`
        "latedef": true, // Prohibit variable use before definition.
        "newcap": true, // Require capitalization of all constructor functions e.g. `new F()`.
        "noarg": true, // Prohibit use of `arguments.caller` and `arguments.callee`.
        "quotmark": "single", // Define quotes to string values.
        "regexp": true, // Prohibit `.` and `[^...]` in regular expressions.
        "undef": true, // Require all non-global variables be declared before they are used.
        "unused": false, // Warn unused variables.
        "strict": true, // Require `use strict` pragma in every file.
        "trailing": true, // Prohibit trailing whitespaces.
        "smarttabs": false, // Suppresses warnings about mixed tabs and spaces
        "globals": { // Globals variables.
            "jasmine": true,
            "angular": true,
            "ApplicationConfiguration": true
        },
        "predef": [ // Extra globals.
            "define",
            "require",
            "exports",
            "module",
            "describe",
            "before",
            "beforeEach",
            "after",
            "afterEach",
            "it",
            "inject",
            "expect"
        ],
        "indent": 4, // Specify indentation spacing
        "devel": true, // Allow development statements e.g. `console.log();`.
        "noempty": true // Prohibit use of empty blocks.
    },

    main: [
        'client/*.js'
    ]
};
