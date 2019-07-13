(function() {
  'use strict';

  angular
    .module('frontend')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, FileUploader, $http, $window, $log) {
    var vm = this;
    vm.success_msg = false;
    vm.error_msg = false;

    vm.init = function () {
      vm.org = {
        name : '',
        logo: '',
        address: '',
        country: '',
        website: '',
        email: '',
        skills : [],
        csv: '',
        questions : [
          {text : '', checked: false},
          {text : '', checked: false},
          {text : '', checked: false}
        ]
      };
      $window.scrollTo(0, 0);
    }

    vm.init();

    vm.addQuestion = function () {
      var new_question = { text: '', checked: false};
      vm.org.questions.push(new_question);
    }

    vm.delQuestions = function () {
      vm.org.questions.forEach(function (question, index) {
        if(question.checked){
          vm.org.questions.splice(index, 1);
        }
      });
    }

    vm.isValidQuestion = function (index) {
      return vm.questions[index].text.length > 0;
    }

    vm.chooseLogo = function () {
      uploader.clearQueue();
      angular.element('#chooseLogo').trigger('click');
    }

    vm.save = function (form) {
      vm.submitted = true;
      vm.uploader.uploadAll();
      vm.org_form = form;
    }

    vm.saveOrg = function() {
      var skills = [];
      for (var i = 0; i < vm.org.skills.length; i++) {
        if (vm.org.skills[i].text.length > 0) {
          skills.push(vm.org.skills[i].text);
        }
      }
      vm.org.skills = skills;

      var questions = [];
      for (var j = 0; j < vm.org.questions.length; j++) {
        if (vm.org.questions[j].text.length > 0) {
          questions.push(vm.org.questions[j].text);
        }
      }
      vm.org.questions = questions;

      $http({
        url: 'http://localhost:3030/org',
        method: "POST",
        data: vm.org
      })
      .then(function(response) {
          if (response.data.status == "success") {
            vm.success_msg = true;
            vm.init();
            vm.uploader.clearQueue();
            vm.submitted = false;
          }
      }, function() { // optional
          vm.error_msg = true;
      });
    }

    // file upload start --->
    vm.uploader = new FileUploader();
    var uploader = vm.uploader = new FileUploader({
       url: 'http://localhost:3030/org/uploadLogo'
    });

    // FILTERS
    uploader.filters.push({
       name: 'imageFilter',
       fn: function(item /*{File|FileLikeObject}*/) {
           var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
           return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
       }
    });

    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        $log.info('onSuccessItem', fileItem, response, status, headers);
        if (response.status == 'success') {
          vm.org.logo = response.name;
          vm.saveOrg();
        }
    };


    uploader.onErrorItem = function(fileItem, response, status, headers) {
        $log.info('onErrorItem', fileItem, response, status, headers);
        alert('somthing wrong while uploading logo');
    };

    // CALLBACKS

    // uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
    //     console.info('onWhenAddingFileFailed', item, filter, options);
    // };
    // uploader.onAfterAddingFile = function(fileItem) {
    //     console.info('onAfterAddingFile', fileItem);
    // };
    // uploader.onAfterAddingAll = function(addedFileItems) {
    //     console.info('onAfterAddingAll', addedFileItems);
    // };
    // uploader.onBeforeUploadItem = function(item) {
    //     console.info('onBeforeUploadItem', item);
    // };
    // uploader.onProgressItem = function(fileItem, progress) {
    //     console.info('onProgressItem', fileItem, progress);
    // };
    // uploader.onProgressAll = function(progress) {
    //     console.info('onProgressAll', progress);
    // };
    // uploader.onErrorItem = function(fileItem, response, status, headers) {
    //     console.info('onErrorItem', fileItem, response, status, headers);
    // };
    // uploader.onCancelItem = function(fileItem, response, status, headers) {
    //     console.info('onCancelItem', fileItem, response, status, headers);
    // };
    // uploader.onCompleteItem = function(fileItem, response, status, headers) {
    //     console.info('onCompleteItem', fileItem, response, status, headers);
    // };
    // uploader.onCompleteAll = function() {
    //     console.info('onCompleteAll');
    // };

    // file upload end <---

  }
})();
