(function() {
	'use strict';

	angular
		.module('democracy-direct')
		.component('diUserSidenav', {
			templateUrl: 'client/components/user-sidenav/user-sidenav.html',
			controller: UserSidenavController,
			controllerAs: 'us',
			bindings: {
			},
			replace:true
		});

	/* @ngInject */
	function UserSidenavController($scope, $reactive,$auth) {
		var us = this;
		console.log(us.anagram,us.currentUser);
		activate();

		////////////////

		function activate() {
			$reactive(us).attach($scope);
		}
		console.log(us);

		us.helpers({
				currentUser: () => {
					//eval and select the services that should be selected
					return Meteor.user();
				}
			});

		//mockup notification data
		us.notifications = [
			{
				type:"comment",
				title:"Marcus har kommenterat din kommentar",
				description:"Du har fel! Jag tycker att det är så här..."
			},
			{
				type:"comment",
				title:"Fred har kommenterat din kommentar",
				description:"Du har fel! Jag tycker att det är så här..."
			},
			{
				type:"upvote",
				title:"Marcus har röstat upp din kommentar",
				description:""
			},
			{
				type:"upvote",
				title:"Marcus har röstat upp din kommentar",
				description:""
			},
			{
				type:"upvote",
				title:"Marcus har röstat upp din kommentar",
				description:""
			},
			{
				type:"downvote",
				title:"Marcus har röstat ner din kommentar",
				description:""
			},
			{
				type:"comment",
				title:"Lena har svarat på din kommentar",
				description:"Jag håller helt med, man kan säga så här..."
			}
		];
		us.autorun(function(){
			if(us.getReactively('currentUser.profile.firstName') && us.getReactively('currentUser.profile.lastName')){
				us.anagram = us.getReactively('currentUser.profile.firstName').match(/\b(\w)/g).join('').toUpperCase() + us.getReactively('currentUser.profile.lastName').match(/\b(\w)/g).join('').toUpperCase();
			}
		});
	}
})();
