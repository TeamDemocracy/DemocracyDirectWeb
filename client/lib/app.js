(function() {
	'use strict';

	angular
		.module('democracy-direct', [
			'ngMaterial',
			'angular-meteor',
			'angular-meteor.auth',
			'ngSanitize',
			'ui.router',
			'angularUtils.directives.dirPagination'
		]);
})();
