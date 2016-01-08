import {BackgroundJobs} from './sheduled-jobs';


import 'collections/all';

Meteor.startup(function(){
	console.log("running startup scripts");
	BackgroundJobs.loadSheduledBackgroundJobs();
	console.log("Started all the background jobs");
});
