module.exports = {

    options: {
        cache: false,
        separator: '\n',
        banner: "'use strict';\n",
        process: function(src, filepath) {
            return '// Source: ' + filepath + '\n' +
                src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
        }
    },

    dist: {
        src: ['client/application/config.js', 'client/application/application.js', 'client/application/**/*.module.js', 'client/application/*/**/*.js'],
        dest: 'client/dist/application.js'
    }

};
