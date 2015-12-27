module.exports = {
    options: {
        optimizationLevel: 7
    },
    all: {
        files: [{
            expand: true,
            cwd: 'client/application/',
            src: ['**/*.{png,jpg,gif}'],
            dest: 'client/images/'
        }]
    }
};
