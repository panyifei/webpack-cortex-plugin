var path = require('path');
var util = require('./util/util.js');
var fs = require('fs');
var options = {};

var MyConventionResolver = {
    apply: function(compiler) {
        compiler.plugin('module', function(request, callback) {
            if (request.request.indexOf('@cortex') === 0) {
                var pkg_name = request.request.substr(8);
                var cortex_json_file = path.resolve(__dirname, '../../cortex.json');
                var cortex_config=JSON.parse(fs.readFileSync(cortex_json_file));
                var pkg_path = path.resolve(__dirname, '../../neurons/', request.request.substr(8));
                var versions = fs.readdirSync(pkg_path);
                var ver = util.chooseCorrectVersion(cortex_config, versions, pkg_name, options.noBeta , pkg_path);
                var newRequest = {
                    path: path.resolve(__dirname, '../..' ),
                    request: 'neurons/' + pkg_name + '/' + ver + '/'+ pkg_name +'.js',
                    query: request.query,
                    directory: request.directory
                };
                this.doResolve(['file'], newRequest, callback);
            } else {
                callback();
            }
        });
    }
};

function constructor(opt) {
    options = opt;
    return MyConventionResolver;
}

module.exports = constructor;
