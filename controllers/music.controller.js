var search = require('youtube-search');
var opts = {
    maxResults: 3,
    key: 'AIzaSyAxRXke3Rio0rZUKl2o-Zo-xSwDzb2_vJg'
};

module.exports = {
    searchYoutube: (req, res) => {
        search(req.body.name, opts, function(err, results) {
            if(err) {
                res.json({
                    code: 401,
                    message: 'Error searching',
                    data: err
                })
            } else {
                res.json({
                    code: 201,
                    message: 'Videos found',
                    data: results
                })
            }
        });
    }
}
