
import * as Countries from './countries/index'

export module BackgroundJobs{

  export function loadSheduledBackgroundJobs(){
  declare var SyncedCron;
  //Schedule jobs to update reports
  console.log(Countries);
    SyncedCron.add({
      name: 'Synchronize Our Data With The Source Data.',
      schedule: function(parser) {
        // parser is a later.parse object

        return parser.text('every 15 mins');//'every hour starting on the ' + index + 'th min');
      },
      job: function() {
        //Get all the country functions
        //console.log(Countries);
        for(var country in Countries){
          console.log(Countries[country])
          Countries[country].synchronizeOurDataWithSource();
        }
        return "yay"
      }
    });
    SyncedCron.start();
  }
}
