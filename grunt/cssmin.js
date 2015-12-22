module.exports = {


    production: {
        options: {
            shorthandCompacting: false,
            roundingPrecision: -1
        },
        files: {
            'client/dist/application.min.css': ['client/css/**/*.css']
        }
    }


};
