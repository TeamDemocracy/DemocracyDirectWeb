(function() {
	'use strict';

	angular
		.module('democracy-direct')
		.component('login', {
			templateUrl: 'client/components/auth/login/login.html',
			controller: LoginController,
			controllerAs: 'login',
			bindings: {}
		});

	/* @ngInject */
	function LoginController($scope, $reactive, $state) {
		var login = this;
		$reactive(login).attach($scope);

		login.credentials = {
			email: '',
			password: ''
		};

		login.error = '';

		login.login = () => {
			Meteor.loginWithPassword(login.credentials.email, login.credentials.password, (err) => {
				if (err) {
					login.error = err;
				} else {
					$state.go('bills.list');
				}
			});
		};
	}
})()
