(function() {
	'use strict';
	angular
		.module('democracy-direct')
		.component('register', {
			templateUrl: 'client/components/auth/register/register.html',
			controller: RegisterController,
			controllerAs: 'register',
			bindings: {}
		});

	/* @ngInject */
	function RegisterController($scope, $reactive, $state) {
		var register = this;
		$reactive(register).attach($scope);
		register.credentials = {
			username: '',
			profile:{
				firstName:'',
				lastName:''
			},
			email: '',
			password: ''
		};
		register.error = '';
		register.register = () => {
			Accounts.createUser(register.credentials, (err) => {
				if (err) {
					register.error = err;
				} else {
					$state.go('bills.list');
				}
			});
		};
	}
})()
