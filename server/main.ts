import {BackgroundJobs} from './sheduled-jobs';


import 'collections/all';
declare var Astro;
Meteor.startup(function(){
	Astro.addRoles(['admin','citizen']);
	Astro.mapNewUsersToRoles('citizen');
  console.log("running startup scripts");
  BackgroundJobs.loadSheduledBackgroundJobs();
  console.log("Started all the background jobs");
});
