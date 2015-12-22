module.exports = {

    // Development settings
    development: {
        options: {
            outputStyle: 'nested',
            sourceMap: true
        },
        files: [{
            expand: true,
            cwd: 'src/styles',
            src: ['*.scss'],
            dest: 'dist/styles',
            ext: '.css'
        }]
    },

    // Production settings
    production: {
        options: {
            outputStyle: 'compressed',
            sourceMap: false
        },
        files: [{
            expand: true,
            cwd: 'src/styles',
            src: ['*.scss'],
            dest: 'dist/styles',
            ext: '.css'
        }]
    }
};
