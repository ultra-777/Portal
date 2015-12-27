module.exports = {

    development: {
        options: {
            paths: ["dist/css"]
        },
        files: [{
            expand: true,
            cwd: 'client/application/',
            src: ['**/*.less'],
            dest: 'client/css',
            ext: '.css'
        }]
    },
    production: {
        options: {
            paths: ["dist/css"]
        },
        files: [{
            expand: true,
            cwd: 'client/application/',
            src: ['**/*.less'],
            dest: 'client/css',
            ext: '.css'
        }]
    }
};
