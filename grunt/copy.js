module.exports = {

    options: {
        timestamp: true,
        separator: ';\n'
    },


    development: {
        expand: true,
        src: ['**'],
        cwd: 'client/application/',
        dest: 'client/dist/'
    }

};
