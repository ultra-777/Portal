'use strict';

angular
    .module('home')
    .controller('homeController', [
        '$scope',
        '$rootScope',
        '$timeout',
        'headerService',
        'commonSmtpService',
        'commonMessageBoxService',
	function(scope, rootScope, timeout, headerService, smtp, messageBox) {

        var vm = this;
        vm.currentTime = null;
        vm.currentTimeLine = null;
        vm.showMessage = showMessage;

        function trackTime() {
            vm.currentTime = new Date();
            vm.currentTimeLine = vm.currentTime.toLocaleString();
            timeout(trackTime, 1000);
        };

        function showMessage(){
            smtp.send({
                from: 'mail@uniwebex.com',
                to: 'ultra-777@yandex.ru',
                subject: 'test email',
                type: 'text/html',
                content: '<h1><b><i>Cheers ...</i></b></h1>',
                attachments: [
                    {   // use URL as an attachment
                        filename: 'license1.txt',
                        path: 'https://raw.github.com/andris9/Nodemailer/master/LICENSE'
                    },
                    {   // use URL as an attachment
                        filename: 'license2.txt',
                        path: 'https://raw.github.com/andris9/Nodemailer/master/LICENSE'
                    },
                    {   // use URL as an attachment
                        filename: 'license3.txt',
                        path: 'https://raw.github.com/andris9/Nodemailer/master/LICENSE'
                    }
                ]
            });
            // messageBox.show('message', 'title');
        }

        function initialize() {
            vm.data = 'home data';
            trackTime();
        }

        initialize();

    }

]);