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
        extractions.push(path.join(Config.manifestPath, 'manifest'));        
    }

    return extractions;
}

// Next, we'll append chunks.
function addChunks(entry, extractions) {
    let chunks = []
    if (Config.commons.length) {
        Config.commons.forEach(chunk => {
            chunk.config.chunks = Object
            .keys(entry)
            .filter(entrypath => !extractions.includes(entrypath)) // Omit vendor libs from chunks
            .filter(entrypath => {
                if(typeof chunk.matchCase === "string") {
                    return entrypath.includes(path.normalize(chunk.matchCase));
                } else if(chunk.matchCase instanceof RegExp) {    
                    return RegExp(chunk.matchCase).test(entrypath) ;
                } else if(Array.isArray(chunk.matchCase)) {
                    let includes = false;
                    chunk.matchCase.forEach(match => {
                        if(entrypath.includes(match)) {
                            return includes = true;
                        }
                    })
                    return includes;
                }
                return false;                    
            })
            chunks.push(chunk.config);
        });
    }
    return chunks;
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
    entry = entry.get();
    let chunks = addChunks(entry, extractions);
    addStylesheets();

    return {
        entry,
        extractions,
        chunks
    };
};
