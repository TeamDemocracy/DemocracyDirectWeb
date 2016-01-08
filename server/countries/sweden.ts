/// <reference path="../../typings/meteor/meteor.d.ts" />

import {ICountry} from './country';

class Sweden implements ICountry {

  //The name of the country
  name:string = 'sweden';
  //The url from which one would collect the simple description of a descision
  commiteeReportsUrlBase:string = 'http://data.riksdagen.se/dokumentlista/?avd=dokument&doktyp=bet&Facets=2&a=s&sortorder=desc&sort=datum&utformat=json&sz=200'; // &p=30
  //The url base to use when constructing the dokuentstatus url
  documentStatusUrlBase:string = 'http://data.riksdagen.se/dokumentstatus/'; // + docID.json
  //The url base for debatevideo
  debateStreamUrlBase:string = 'http://www.riksdagen.se/Templates/Pages/embedwebtv.aspx?did='; // + docID (H310251 for example)

  //MARK: PARSER FUNCTIONS
  // Functions that interperates input data and morphs, validates and formats a desired output

  static parseMainDataDoc(){
    console.log("it works!!");
  }




  //MARK: FLOW FUNCTIONS
  // functions that pass data around to different parsing or fetching functions.


  /*
  This function will attempt to update
  all the descisions that the system does not have already.
  */
  synchronizeOurDataWithSource():void {
    //1. get the latest commiteeReport from mongo
    //2. request all the reports that have been published after the last saved report
    //3. foreach report fetch the dokumentstatus.json file using the documentStatusUrlBase and the report id
    //3,1. parse the docstatus file and format the report object that will be saved to mongo
    //3,2. Save the new report
    console.log("syncronizing");

    console.log(HTTP.get(this.commiteeReportsUrlBase));
    //get the latest datastream from riksdagen.se
    try{
      console.log(this.commiteeReportsUrlBase);
      var riksdagenLatestData = HTTP.get(this.commiteeReportsUrlBase);
      console.log(riksdagenLatestData.content);
    }catch(err){
      console.log(err);
    }
  }
}

export var sweden: Sweden = new Sweden();
