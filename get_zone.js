// zone1970.tab.json

(function(){
    'use strict';

    const https = require('https');
    const fs = require('fs');
    const moment = require('moment-timezone');

    let data = '';


    function write_file (text) {
        fs.writeFile(
            'zone1970.tab.json',
            text);
    }

    function format (dto) {
        return JSON.stringify(dto, null, 4);
    }

    function parse(text) {
        return text
            .split('\n')

            .filter(x =>
                // remove comments comment
                !x.startsWith('#')
            )

            .map(x =>
                x.split('\t')
            )

            .filter(x =>
                x.length >= 2
            )

            .map(x =>
                // take only names
                x[2]
            )

            .map(x =>
                [
                    x,
                    moment.tz.zone(x).offset(new Date())
                ]
            )

            .sort( (a, b) =>
                a[1] - b[1]
            )

            .map(x =>
                {
                    return {
                        offset: x[1],
                        offset_string: moment(new Date()).tz(x[0]).format('Z'),
                        name: x[0]
                    };
                }
            );
    }




    https.get(
        'https://raw.githubusercontent.com/eggert/tz/master/zone1970.tab',
        response =>
            response

                .on('data',
                    chunck => ( data += chunck )
                )

                .on('end', () =>
                    write_file( format( parse(data) ) )
                )
    );

}());
