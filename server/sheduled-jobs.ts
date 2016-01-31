import {ICountry} from './countries/country';
import {Countries} from './countries/all';

declare var SyncedCron:any;

export module BackgroundJobs {

	export function loadSheduledBackgroundJobs() {

		//Schedule jobs to update reports
		// SyncedCron.add({
		// 	name: 'Synchronize Our Data With The Source Data.',
		// 	schedule: function(parser: any) {
		// 		// parser is a later.parse object

		// 		return parser.text('every 15 mins');//'every hour starting on the ' + index + 'th min');
		// 	},
		// 	job: function() {
		// 		for (var country of Countries) {
		// 			console.log('synchronizing data for ' + country.name + '...');
		// 			country.synchronizeBills();
		// 		}
		// 		return "yay"
		// 	}
		// });

		Countries[0].indexBills();

		SyncedCron.start();

	}
}
