(function() {
	'use strict';

	angular
		.module('democracy-direct')
		.component('diNavbar', {
			templateUrl: 'client/components/navbar/navbar.html',
			controller: NavbarController,
			controllerAs: 'nb',
			bindings: {
			}
		});

	/* @ngInject */
	function NavbarController($scope, $reactive,$auth,$mdSidenav) {
		var nb = this;
		console.log(nb.anagram,nb.currentUser);
		activate();

		////////////////

		function activate() {
			$reactive(nb).attach($scope);
		}

		nb.toggleUserSidenav = function(){
			$mdSidenav('user-sidenav').toggle();
		};



		nb.helpers({
				currentUser: () => {
					return Meteor.user();
				}
			});

		nb.autorun(function(){
			if(nb.getReactively('currentUser.profile.firstName') && nb.getReactively('currentUser.profile.lastName')){
				nb.anagram = nb.getReactively('currentUser.profile.firstName').match(/\b(\w)/g).join('').toUpperCase() + nb.getReactively('currentUser.profile.lastName').match(/\b(\w)/g).join('').toUpperCase();
			}
		});
	}
})();
