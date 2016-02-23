'use strict';

var request = require('request'),
    Promise = require('promise'),
    moment = require('moment'),
    _ = require('ramda');


let fetchRawPage = (page) => {

        var resolve = null,
            promise = new Promise(function (res, rej) {
                resolve = res;
            });

        request({
            url: 'https://www.siepomaga.pl/en/emil', //URL to hit
            qs: {page: page, slug: 'emil', '_': '1456183348239'}, //Query string data
            method: 'GET', //Specify the method
            headers: { //We can define headers too
                'Cookie': '_session_id=c430f9619048942ff95e7de44e63ddeb; request_method=GET; __utmt=1; __utma=195776302.501580812.1452631052.1456047635.1456176482.40; __utmb=195776302.2.10.1456176482; __utmc=195776302; __utmz=195776302.1456176482.40.5.utmcsr=facebook.com|utmccn=(referral)|utmcmd=referral|utmcct=/',
                'X-CSRF-Token': '3sWd2db2sWKsrgxQwuVYbmmbuqRTD2yq/XPWwf4pwQY=',
                'Accept-Language': 'en-US,en;q=0.8,pl;q=0.6,ru;q=0.4,fr;q=0.2',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36',
                'Accept': 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01',
                'Referer': 'https://www.siepomaga.pl/emil',
                'X-Requested-With': 'XMLHttpRequest',
                'Connection': 'keep-alive'
            }
        }, function (error, response, body) {
            if (error) {
                console.log(error);
            }
            resolve(body);
        });

        return promise;

    },
    regexps = {
        date: "date\\\\\\'>([^<]+)<",
        donor: "name\\\\\\'>([^<]+)\\\\n<",
        amount: "amount\\\\\\'>[^>]+>([^(zł\\ )]+)"
    },
    fetchFirstGroup = _.curry((regexp, source) => _.match(regexp, source)[1]),

    findAllFirstRegexpGroup = _.curry((regexp, source) => {

        return _.pipe(
            _.match(new RegExp(regexp, 'gi')),
            _.map(fetchFirstGroup(new RegExp(regexp, 'i')))
        )(source);
    }),

    rawPageToDonations = (rawPageBody) => {

        let data = _.mapObjIndexed(findAllFirstRegexpGroup(_.__, rawPageBody))(regexps);

        return _.pipe(
            _.values,
            _.reduce((acc, next) => {
                if (_.isEmpty(acc)) {
                    return next;
                }
                return _.zip(acc, next);
            }, []),
            _.map(_.flatten),
            _.map(_.zipObj(_.keys(data)))
        )(data);
    },

    createDonation = _.evolve({
        date: (date) => moment(date).toDate().getTime(),
        amount: Number
    }),

    fetchDonations = (page) => {

        return fetchRawPage(page)
            .then(rawPageToDonations)
            .then(_.map(createDonation))
    };


module.exports = {
    fetchDonations: fetchDonations
};
