'use strict';

const jsonld = require('jsonld');
const uuid = require('uuid/v1');
const fetch = require('node-fetch');

module.exports = {
  name: 'outbox',
  settings: {
    homeUrl: process.env.HOME_URL || 'http://localhost:3000/'
  },
  dependencies: ['storage'],
  routes: {
    aliases: {
      'POST outbox': 'outbox.post',
      'GET outbox': 'outbox.list'
    }
  },
  actions: {
    async post({ params, broker }) {
      let activity;

      if (params.type !== 'Create') {
        activity = {
          '@context': 'https://www.w3.org/ns/activitystreams',
          id: this.generateId('activity/'),
          type: 'Create',
          object: {
            id: this.generateId('object/'),
            ...params
          }
        };
      } else {
        activity = {
          id: this.generateId('activity/'),
          ...params
        };
      }

      const result = await broker.call('storage.insert', { resource: activity });

      if (result.status >= 200 && result.status < 300) {
        return await jsonld.compact(activity, 'https://www.w3.org/ns/activitystreams');
      } else {
        throw result;
      }
    },
    async list({ broker }) {
      const results = await broker.call('storage.query', {
        query: `
                PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                PREFIX as: <https://www.w3.org/ns/activitystreams#>
                SELECT  ?activity ?object ?type
                WHERE {
                  ?activity rdf:type as:Create ;
                            rdf:type ?type ;
                            as:object ?object .
                }
            `
      });

      const orderedCollection = {
        '@context': 'https://www.w3.org/ns/activitystreams',
        type: 'OrderedCollection',
        totalItems: results.length,
        orderedItems: results.map(result => ({
          id: result.activity.value,
          type: result.type.value,
          object: result.object.value
        }))
      };

      return await jsonld.compact(orderedCollection, 'https://www.w3.org/ns/activitystreams');
    }
  },
  methods: {
    generateId(path = '') {
      return this.settings.homeUrl + path + uuid().substring(0, 8);
    }
  }
};
