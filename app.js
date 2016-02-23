'use strict';

var Promise = require('promise');

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/emil';

let dbConnect = function(url){

    var resolve,
        reject,
        promise = new Promise(function (res, rej) {
            resolve = res;
            reject = rej;
        });

    MongoClient.connect(url, function (err, db) {

        insertDonations(db,)


        insertDonations(db, function () {
            db.close();
        });
    });

};

let insertDonations = function (db, donations) {

    var resolve,
        reject,
        promise = new Promise(function (res, rej) {
            resolve = res;
            reject = rej;
        });

    db.collection('donations').insertMany([{a: 1}], function (err, result) {

        if (err) {
            return reject(err);
        }

        resolve(result);
    });

    return promise;
};

MongoClient.connect(url, function (err, db) {

    insertDonations(db,)


    insertDonations(db, function () {
        db.close();
    });
});