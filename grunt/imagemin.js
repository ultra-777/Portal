module.exports = {
    options: {
        optimizationLevel: 7
    },
    all: {
        files: [{
            expand: true,
            cwd: 'client/application/',
            src: ['client/application/**/*.{png,jpg,gif}'],
            dest: 'client/dist/'
        }]
    }
};
