module.exports = function(grunt) {

    grunt.initConfig({

        folder_list: {
            options: {
                files: true,
                folder: true
            },
            files: {
                src: ['**'],
                dest: 'public/settings/folders.json',
                cwd: 'dataset/'
            }
        }
    });


    grunt.loadNpmTasks('grunt-folder-list');
    grunt.registerTask('getfolders', 'folder_list');


    grunt.registerTask('generatefolders', 'generates the array of required folders', function () {
        var cwd = "dataset/";
        var folderPaths = "public/settings/folders.json";
        var objfolderPaths = grunt.file.readJSON(folderPaths);


        // get the relevant folders for computing.
        var arrFolderLocations = [];
        objfolderPaths.forEach(function (entry) {
            if (entry["depth"] == 1 && entry["location"] != "" && entry["location"] != "devices" && entry["type"] == "dir") {
                arrFolderLocations.push(entry["location"]);
            }

        });
        //console.log(arrFolderLocations);

        // get precert files for currentDevVersion
        var arrCurrentdevFiles = [];
        objfolderPaths.forEach(function (entry) {
            if (entry["filetype"] == "json" && entry["type"] == "file" && entry["filename"] != "configschema.json" && entry["location"].indexOf("CurrentDevVersion") > -1 && entry["location"].indexOf("precert") > -1) {
                arrCurrentdevFiles.push(entry["filename"]);
            }

        });
        console.log(arrCurrentdevFiles);

        // write stuff in jsons
        var objCombinedJson = {};

        arrCurrentdevFiles.forEach(function (brandmodel) {  // for each brand and model in current dev version find
            var objDeviceJson = {};
            arrFolderLocations.forEach(function (talversions) {

                objfolderPaths.forEach(function (entry) {
                    if (entry["filetype"] == "json" && entry["type"] == "file" && entry["filename"] != "configschema.json" && entry["filename"] == brandmodel && entry["location"].indexOf(talversions) > -1 && entry["location"].indexOf("precert") > -1) {
                        objDeviceJson[talversions] = grunt.file.readJSON(cwd + entry["location"]);
                    }
                });

            });
            objCombinedJson[brandmodel] = objDeviceJson;
        });
        console.log(objCombinedJson);
        grunt.file.write("public/settings/configscombined.json", JSON.stringify(objCombinedJson, null, '\t'));

    });

}