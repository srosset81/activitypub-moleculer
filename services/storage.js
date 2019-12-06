"use strict";

const jsonld = require('jsonld');
const fetch = require('node-fetch');
const { SparqlJsonParser } = require('sparqljson-parse');

module.exports = {
    name: "storage",
    settings: {
        sparqlEndpoint: process.env.SPARQL_ENDPOINT
    },
    actions: {
        async insert({ params }) {
            const rdf = await jsonld.toRDF(params.resource, {format: 'application/n-quads'})

            return await fetch(this.settings.sparqlEndpoint + 'update', {
                method: 'POST',
                body: `INSERT DATA { ${rdf} }`,
                headers: {
                    'Content-Type': 'application/sparql-update',
                    'Authorization': 'Basic ' + Buffer.from('admin:admin').toString('base64')
                }
            });
        },
        async query({ params }) {
            const result = await fetch(this.settings.sparqlEndpoint + 'query', {
                method: 'POST',
                body: 'query=' + params.query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': 'Basic ' + Buffer.from('admin:admin').toString('base64')
                }
            });

            const jsonResult = await result.json();

            return await this.sparqlJsonParser.parseJsonResults(jsonResult);
        }
    },
    started() {
        this.sparqlJsonParser = new SparqlJsonParser();
    }
};