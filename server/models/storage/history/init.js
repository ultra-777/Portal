
"use strict";

function init(executeQueryHandler, executeFileQueryHandler){
    executeQueryHandler('CREATE SCHEMA IF NOT EXISTS "history"');
}

module.exports = {
    init: init
};
