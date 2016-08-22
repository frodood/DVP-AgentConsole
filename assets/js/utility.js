/**
 * Created by Damith on 8/16/2016.
 */

function getJSONData(http, file, callback) {
    http.get('assets/json/' + file + '.json').success(function (data) {
        callback(data.d);
    })
}

