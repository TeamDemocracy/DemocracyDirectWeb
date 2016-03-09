(function() {
	'use strict';
	angular
		.module('democracy-direct')
		.component('resetpw', {
			templateUrl: 'client/components/auth/reset-password/reset-password.html',
			controller: ResetPasswordController,
			controllerAs: 'resetpw',
			bindings: {
			}
		});
		
	/* @ngInject */
	function ResetPasswordController ($scope, $reactive, $state) {
	      $reactive(this).attach($scope);

		  this.credentials = {
	        email: ''
	      };
	      this.error = '';
	      this.reset = () => {
	        Accounts.forgotPassword(this.credentials, (err) => {
	          if (err) {
	            this.error = err;
	          }
	          else {
	            $state.go('login');
	          }
	        });
	      };
	    }

})()
