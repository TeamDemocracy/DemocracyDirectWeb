/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/astronomy-security.d.ts" />

export var Comments = new Mongo.Collection('comments');

declare var Astro;


export var Comment = Astro.Class({
  name: 'Comment',
  collection: Comments,
  typeField: 'type',
  fields: {
    text:'string',
    //upVotes:['number'],
    parentId:{
      type:'string',
      optional:true
    },
    userId:{
      type:'string'
    }
  },
  relations: {
    replies: {
      type: 'many',
      class: 'Comment',
      local: '_id',
      foreign: 'parentId'
    }
  },
  behaviors: ['timestamp']
});
if (Meteor.isServer){
	var acl = new ACL();
	    acl.get('controls').push(new OLC({read:false}));
		var role = Role.find({name:'citizen'});
		acl.get('controls').push(new OLC({type:{name:'role',id:role._id},read:true}));
	Comment.extend({
	    security:{
	      implementsACL:true,
	      defaultACL:acl //if defaultACL is not configured meteor-astronomy-security will add the property and set it to new ACL()
	    }
	});

  Comment.setPublicReadAccess(true);
  //Comment.setPublicWriteAccess(false); the default value for any class level control i false
  Comment.setRoleWriteAccess('citizen',true); // if initiated the clc will start of by being false for eveyrthing
  Comment.setRoleReadAccess('citizen',true);
  console.log(Comment.getSecurityConfig().CLP);
  Comment.generateSecureMethodsAndPublications();
}
//console.log(Comment);
//console.log("comment instance");
//console.log(new Comment({text:"hello"});
/*
By extending the Comment Astro class I make sure that all comments live inside the same collection
*/
export var BillComment = Comment.inherit({
	name: 'BillComment',
	fields: {
		billId:'string'
	},
	behaviors: ['timestamp']
});
export var DebateComment = Comment.inherit({
	name: 'DebateComment',
	fields: {
		billId:'string'
	},
	behaviors: ['timestamp']
});
