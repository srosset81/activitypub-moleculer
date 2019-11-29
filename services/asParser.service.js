"use strict";

const jsonld = require('jsonld');

module.exports = {
    name: "asParser",
    actions: {
        async parse({ params }) {
            let activity = params.jsonld;

            if( activity.type !== 'Create' ) {
                activity = {
                    '@context': 'https://www.w3.org/ns/activitystreams',
                    type: 'Create',
                    object: activity
                }
            }

            return await jsonld.compact(activity, 'https://www.w3.org/ns/activitystreams');
        }
    }
};