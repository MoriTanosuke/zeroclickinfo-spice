(function (env) {
    "use strict";
    env.ddg_spice_doi = function(api_result){

        if (!api_result || !api_result.DOI || !api_result.author || !api_result.title || api_result.error) {
            return Spice.failed('doi');
        }

        Spice.add({
            id: "doi",

            name: "Reference", // Or Science?
            data: api_result,
            meta: {
                sourceName: "dx.doi.org",
                sourceUrl: api_result.URL
            },
            normalize: function(item) {
                return {
                    title: api_result.title,
                };
            },
            templates: {
                group: 'list_detail',
                options: {
                    content: 'record',
                    moreAt: false
                }
            }
        });
    };
}(this));

function format_author(author) {
    if (author.family) {
        var ret = "";
        if (author.given) {
            ret += author.given + " ";
        }
        if (author['dropping-particle']) {
            ret += author['dropping-particle'] + " ";
        }
        if (author['non-dropping-particle']) {
            ret += author['non-dropping-particle'] + " ";
        }
        ret += author.family;
        if (author.suffix) {
            ret += " " + author.suffix;
        }
        return ret;
    } else {
        return author.literal
    }
}

function format_authors(authors) {
    var i = 0;
    var ret = "";
    while (authors.length - i > 3) {
        ret += format_author(authors[i]);
        ret += ", ";
        i++;
    }
    while (authors.length - i > 1) {
        ret += format_author(authors[i]);
        ret += " and ";
        i++;
    }
    ret += format_author(authors[i]);
    return ret;
}


// This uses the dummy doi_bibtex spice to lookup the bibliography data in
// bibtex format
function fetch_bibtex(doi) {
    nrj("/js/spice/doi_bibtex/" + doi);
}

// And this is the return call, showing the bibtex display field.
function ddg_spice_doi_bibtex(bibtex) {
    document.getElementById('bibtex').style.display = 'block';
    document.getElementById('bibtex').innerHTML = h(bibtex);

}