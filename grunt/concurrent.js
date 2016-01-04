module.exports = {

    // Task options
    options: {
        limit: 8
        ,logConcurrentOutput: true
    },

    // Dev tasks
    developmentFirst: [
        'clean'
        ,'jshint'
    ],
    developmentSecond: [
        'sass:development'
        ,'less:development'
        //,'copy'
    ],
    developmentThird: [
        'concat'
    ],

    productionZero: [
        'clean:productionZero'
    ],

    // Production tasks
    productionFirst: [
        'jshint'
        ,'sass:production'
        ,'less:production'
    ],
    productionSecond: [
        'concat'
    ],
    productionThird: [
        'cssmin:production'
        ,'uglify'
    ],

    // Image tasks
    imageFirst: [
        'imagemin'
    ]
};
