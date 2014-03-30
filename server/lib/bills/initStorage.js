var billsStorage = require("../bills-storage");

function init(config) {
    return billsStorage.init({
        couch: {
            db: config.couch.db
        }
    })
}

function login(config) {
    return billsStorage.login(config.couch.user, config.couch.password);
}


module.exports = function(config) {
    init(config).then( login(config) );
};
