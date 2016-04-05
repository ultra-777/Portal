'use strict';

module.exports = function(app) {
	// Root routing
	var explorer = require('../../server/controllers/explorer');
    app.route('/explorer').get(explorer.root);
    app.route('/explorer/root').post(explorer.root);
    app.route('/explorer/node').post(explorer.node);
    app.route('/explorer/moveChild').post(explorer.moveChild);
    app.route('/explorer/newFolder').post(explorer.newFolder);
    app.route('/explorer/delete').post(explorer.delete);
    app.route('/explorer/rename').post(explorer.rename);
    app.route('/explorer/download').get(explorer.download);
    app.route('/explorer/initBlob').post(explorer.initBlob);
    app.route('/explorer/addBlobChunk').post(explorer.addBlobChunk);
    app.route('/explorer/releaseBlob').post(explorer.releaseBlob);
    app.route('/explorer/uploadFile').post(explorer.uploadFile);
};