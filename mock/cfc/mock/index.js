const path = require('path');
const fs = require('fs');
const DIRNAME = path.dirname(__filename);

module.exports = function(req, res) {
    const subpath = (req.originalUrl || req.url).replace(/^\/(api\/mock2|api)\/|\?.*$/g, '');
    const jsonFile = subpath  + '.json';
    const jsFile = subpath + '.js';

    if (subpath == 'options/users') {
        let json = readJson(jsonFile);
        let term = req.query.term;

        if (term) {
            json.data = json.data.filter(item => item.label.substring(0, term.length) === term);
        }

        return res.json(json);
    } else if (/^sample/.test(subpath)) {
        let file = require.resolve(path.join(DIRNAME, 'sample.js'));
        delete require.cache[file];
        return require(file)(req, res);
    } else if (exist(jsFile)) {
        let file = require.resolve(path.join(DIRNAME, jsFile));
        delete require.cache[file];

        if (req.query.waitSeconds) {
            return setTimeout(function() {
                require(file)(req, res);
            }, parseInt(req.query.waitSeconds, 10) * 1000);
        }

        return require(file)(req, res);
    } if (exist(jsonFile)) {
        if (req.query.waitSeconds) {
            return setTimeout(function() {
                res.json(readJson(jsonFile));
            }, parseInt(req.query.waitSeconds, 10) * 1000);
        }

        return res.json(readJson(jsonFile));
    } else if (/crud\/\d+$/.test(subpath) && req.method === 'DELETE') {
        return res.json({
            status: 0,
            msg: '删除成功'
        })
    }

    res.json(readJson('notFound.json'));
}

function exist(subpath) {
    return fs.existsSync(path.join(DIRNAME, subpath));
}

function readJson(subpath) {
    const content = fs.readFileSync(path.join(DIRNAME, subpath), 'utf8');
    return JSON.parse(content);
}
