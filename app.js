'use strict';

var Donations = require('./donations'),
    db = require('./db'),
    _ = require('ramda')

let connection = db.connect();

function fetchAllDonations(page) {

    if (!page) {
        page = 1;
    }

    Donations.fetchDonations(page)

        .then((donations)=> {

            if (_.isEmpty(donations)) {

                console.log('koniec!!');
                return false;
            }

            connection.then(db.insertMany(_.__, donations));

            console.log('strona', page);

            fetchAllDonations(page + 1)

        })
        .catch((error) => {

            console.log('ERROR', error);
            console.log('retrying again', page);
            fetchAllDonations(page);
        })
}


fetchAllDonations();

//

