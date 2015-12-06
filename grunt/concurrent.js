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

    // Production tasks
    productionFirst: [
        'clean:productionFirst',
        'jshint'
    ],
    productionSecond: [
        'sass:production',
        'concat',
        'uglify',
        'cssmin:production'
    ],
    productionThird: [
        'clean:productionSecond'
    ],

    // Image tasks
    imageFirst: [
        'imagemin'
    ]
};
