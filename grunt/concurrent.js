module.exports = {

    // Task options
    options: {
        limit: 8,
        logConcurrentOutput: true
    },

    // Dev tasks
    developmentFirst: [
        'clean',
        'jshint'
    ],
    developmentSecond: [
        'sass:development'//,
        //'copy'
    ],

    productionZero: [
        'clean:productionZero'
    ],

    // Production tasks
    productionFirst: [
        'jshint'
    ],
    productionSecond: [
        'sass:production',
        'concat'
    ],
    productionThird: [
        'cssmin:production',
        'uglify'
    ],

    // Image tasks
    imageFirst: [
        'imagemin'
    ]
};
