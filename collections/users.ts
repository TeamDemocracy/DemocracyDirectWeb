/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/astronomy-security.d.ts" />
declare var Astro;

var UserProfile = Astro.Class({
    name: 'UserProfile',
    fields: {
        firstName: 'string',
        lastName: 'string'
        /*sätt nått kul här kanske*/
    }
});







//This is a direct map to the dataschema of the meteor account package
//Meteor will enforce the validity of the users collection by itself
//But We need added security when it comes to enforced validation of votingdata.
export var User = Astro.Class({
    name: 'User',
    collection: Meteor.users,
    fields: {
        createdAt: 'date',
        emails: {
            type: 'array',
            default: function() {
                return [];
            }
        },
        profile: {
            type: 'object',
            nested: 'UserProfile',
            default: function() {
                return {};
            }
        },
        nationality: 'string'//this should probably be a relation to a country collection maybe
    },
    relations: {
        roles: {
            type: 'many',
            class: 'RoleMapping',
            local: '_id',
            foreign: 'userId'
        }
    }
});




if (Meteor.isServer) {
    User.extend({
        fields: {
            services: 'object'
        }
    });
    User.setRoleWriteAccess('citizen', true);
}
