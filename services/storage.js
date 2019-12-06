'use strict';

const jsonld = require('jsonld');
const fetch = require('node-fetch');
const { SparqlJsonParser } = require('sparqljson-parse');

module.exports = {
  name: 'storage',
  settings: {
    sparqlEndpoint: process.env.SPARQL_ENDPOINT,
    jenaUser: 'admin',
    jenaPassword: 'admin'
  },
  actions: {
    async insert({ params }) {
      // Transforms JSONLD to RDF
      const rdf = await jsonld.toRDF(params.resource, { format: 'application/n-quads' });

      return await fetch(this.settings.sparqlEndpoint + 'update', {
        method: 'POST',
        body: `INSERT DATA { ${rdf} }`,
        headers: {
          'Content-Type': 'application/sparql-update',
          Authorization: this.getJenaAuthorization()
        }
      });
    },
    async query({ params }) {
      const result = await fetch(this.settings.sparqlEndpoint + 'query', {
        method: 'POST',
        body: 'query=' + params.query,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Authorization: this.getJenaAuthorization()
        }
      });

      const jsonResult = await result.json();

      // Return more readable JSON results
      return await this.sparqlJsonParser.parseJsonResults(jsonResult);
    }
  },
  methods: {
    getJenaAuthorization() {
      return 'Basic ' + Buffer.from(this.settings.jenaUser + ':' + this.settings.jenaPassword).toString('base64');
    }
  },
  started() {
    this.sparqlJsonParser = new SparqlJsonParser();
  }
};
