module.exports = {
    options: {
        force: true
    },

    developmentZero: [
        "client/dist/",
        "client/css/"
    ],

    productionZero: [
        "client/dist/",
        "client/css/"
    ],

    productionSecond: [
        //"client/dist/application.js"
    ]
};
