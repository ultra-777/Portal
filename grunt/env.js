module.exports = {
    options : {
        //Shared Options Hash
    }
    ,development: {
        NODE_ENV:       'development',
        PORT:           80,
        PORT_SSL:       443,
        STORAGE_PATH:   'data',
        ROOT_ALIAS:     '$'
    }
    ,production: {
        NODE_ENV:       'production',
        PORT:           80,
        PORT_SSL:       443,
        STORAGE_PATH:   'data',
        ROOT_ALIAS:     '$'
    }
};
