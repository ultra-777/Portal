module.exports = {
    options: {
        force: true
    },

    developmentZero: [
        "client/dist/",
        "client/css/",
        "client/images/"
    ],

    productionZero: [
        "client/dist/",
        "client/css/",
        "client/images/"
    ],

    productionSecond: [
        //"client/dist/application.js"
    ]
};
