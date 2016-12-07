/**
 * Created by madlord on 16/2/1.
 */
var semver = require('semver');
var fs = require('fs');
var path = require('path');

function chooseCorrectVersion(cortex_config,versions,pkg_name,noBeta,base_path) {
    var rule;
    if (cortex_config.dependencies) {
        rule = cortex_config.dependencies[pkg_name];
    }
    var filtedVersions = [];
    versions.forEach(function (item) {
        if (fs.statSync(base_path+'/'+item).isDirectory()) {
            var version = item;
            if ((!noBeta) || (item.indexOf('beta')==-1)) {
                item = item.split('-')[0];
                try {
                    if (!rule || (rule&&semver.satisfies(item, rule))) {
                        filtedVersions.push(version);
                    }
                } catch (e) {
                    console.warn("file or dir ["+item+"] is weired, but I choose to ignore!");
                }
            }
        }
    });
    filtedVersions.sort();
    return filtedVersions[filtedVersions.length - 1];
}

module.exports={
    chooseCorrectVersion:chooseCorrectVersion
}
