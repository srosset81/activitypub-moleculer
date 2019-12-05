"use strict";

const express = require("express");

module.exports = {
    name: "www",

    settings: {
        port: process.env.PORT || 3000
    },

    created() {
        this.app = express();
        this.app.use(express.json());
    },

    started() {
        this.app.post('/outbox', async (req, res) => {
            await this.broker.call('outbox.post', { jsonld: req.body })
                .then(result => res.json(result));
        });

        this.app.get('/outbox', async (req, res) => {
            await this.broker.call('outbox.list')
                .then(result => res.send(result));
        });

        this.app.listen(Number(this.settings.port), err => {
            if (err)
                return this.broker.fatal(err);

            this.logger.info(`Server started on port ${this.settings.port}`);
        });
    },

    stopped() {
        if (this.app.listening) {
            this.app.close(err => {
                if (err)
                    return this.logger.error("Server close error!", err);

                this.logger.info("Server stopped!");
            });
        }
    }
};