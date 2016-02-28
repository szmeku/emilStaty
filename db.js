'use strict';

var Promise = require('promise'),
    MongoClient = require('mongodb').MongoClient,
    url = 'mongodb://localhost:27017/emil',
    _ = require('ramda');

let connect = () => {

        var resolve,
            reject,
            promise = new Promise(function (res, rej) {
                resolve = res;
                reject = rej;
            });

        MongoClient.connect(url, function (err, connection) {

            if (err) {
                return reject(err);
            }

            resolve(connection);
        });

        return promise;
    },
    insertMany = _.curry((connection, items) => {

        var resolve,
            reject,
            promise = new Promise(function (res, rej) {
                resolve = res;
                reject = rej;
            });

        connection.collection('donations-testy').insertMany(items, function (err, result) {

            if (err) {
                return reject(err);
            }

            resolve(result);
        });

        return promise;
    });

module.exports = {
    connect: connect,
    insertMany: insertMany
}