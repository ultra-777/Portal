module.exports = {
    options: {
        mangle: true
    },

    all: {
        files: [{
            expand: true,
            cwd: 'client/dist',
            src: '**/*.js',
            dest: 'client/dist/',
            ext: '.min.js'
        }]
    }
};
