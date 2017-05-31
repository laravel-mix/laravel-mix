let Entry = require('./Entry');
let entry;


// We'll start by filtering through all the JS compilation
// requests from the user, and building up the main entry
// object for Webpack.
function addScripts() {
    if (Config.js.length) {
        Config.js.forEach(js => {
            entry.addFromOutput(
                js.entry.map(file => file.path()),
                js.output,
                js.entry[0]
            );
        });
    } else {
        entry.addDefault();
    }
}


// Next, we'll append any requested vendor library extractions.
function addVendors() {
    let extractions = Config.extractions.map(entry.addExtraction.bind(entry));

    // If we are extracting vendor libraries, then we also need
    // to extract Webpack's manifest file to assist with caching.
    if (extractions.length) {
        extractions.push(path.join(entry.base, 'manifest'));
    }

    return extractions;
}


// Finally, we'll append all Sass/Less/Stylus references,
// and they'll neatly be extracted to their own files.
function addStylesheets() {
    Object.keys(Config.preprocessors).filter(p => p !== 'fastSass').forEach(type => {
        Config.preprocessors[type].forEach(preprocessor => {
            entry.add(entry.keys()[0], preprocessor.src.path());
        });
    });
}


module.exports = function () {
    entry = new Entry();

    addScripts();
    let extractions = addVendors();
    addStylesheets();

    return {
        entry: entry.get(),
        extractions
    };
};
