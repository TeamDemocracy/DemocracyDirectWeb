/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, View} from 'angular2/core';

import {Comments} from 'collections/all';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';


@Component({
    selector: 'parties-form'
})
@View({
    templateUrl: 'client/parties-form/parties-form.html',
    directives: [FORM_DIRECTIVES]
})
export class PartiesForm {
    partiesForm: ControlGroup;

    constructor() {
        var fb = new FormBuilder();
        this.partiesForm = fb.group({
            text: ['', Validators.required]
        });
    }

    addParty(party) {
      console.log(party);
        if (this.partiesForm.valid) {
          console.log("is valid");
          
            try{
              Meteor.call('insertComment',{
                  text: party.text,
                  userId: Meteor.userId()
              })
            }catch (err){
              console.log(err);
            }


            (<Control>this.partiesForm.controls['text']).updateValue('');
        }
    }
}
