'use strict';

angular
    .module('root')
    .service('dataServiceImpl', [
        '$http',
        '$q',
        function (http, q) {

            this.httpRequest = function (method, url, data) {
                var defer = q.defer();

                var header = {
                    method: method,
                    url: /*apiUrl + '/' +*/ url,
                    contentType: 'application/json'
                };

                if ((data !== null) && (data !== undefined)) {
                    var dataObject = {};
                    for (var key in data) {
                        dataObject[key] = data[key];
                    }
                    header.data = dataObject;
                }

                http(header)
                    .then(function (response) {
                            defer.resolve(response.data);
                        },
                        function (response) {
                            var message =
                                response.data ?
                                    response.data.messageDetail
                                        ? response.data.messageDetail
                                        : response.data.message
                                    : response;
                            defer.reject(message);
                        });
                return defer.promise;
            };

        }
    ]);
