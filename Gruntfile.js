module.exports = function(grunt) {

    grunt.initConfig({

        folder_list: {
            custom_folders_options: {
                options: {
                    files: true,
                    folder: true
                },
                files: [
                    {
                        src: ['**'],
                        dest: 'public/settings/talfiles.json',
                        cwd: 'dataset/tal-device-config/webapp/htdocs/deviceconfig/'
                    },
                    {
                        src: ['**'],
                        dest: 'public/settings/iplayerfiles.json',
                        cwd: 'dataset/tap-config/webapp/htdocs/config/'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-folder-list');

    grunt.registerTask('generatefolders', 'generates the combined.json without iplayer', function () {
        var cwd = "dataset/tal-device-config/webapp/htdocs/deviceconfig/";
        var icwd = "dataset/tap-config/webapp/htdocs/config/";
        var objiplayerfolderPaths = grunt.file.readJSON("public/settings/iplayerfiles.json");
        var objfolderPaths = grunt.file.readJSON("public/settings/talfiles.json");


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

        // write stuff in jsons
        var objCombinedJson = {};

        arrCurrentdevFiles.forEach(function (brandmodel) {  // for each brand and model in current dev version find
            var objDeviceJson = {};
            arrFolderLocations.forEach(function (talversions) { // for each TAL version

                objfolderPaths.forEach(function (entry) {
                    if (entry["filetype"] == "json" && entry["type"] == "file" && entry["filename"] != "configschema.json" && entry["filename"] == brandmodel && entry["location"].indexOf(talversions) > -1 && entry["location"].indexOf("precert") > -1) {
                        objDeviceJson[talversions] = grunt.file.readJSON(cwd + entry["location"]);
                    }
                });

            });

            objiplayerfolderPaths.forEach(function (entry) {
                if (entry["filetype"] == "json" && entry["type"] == "file" && entry["filename"] != "devices-precert.json" && entry["filename"] == brandmodel && entry["location"].indexOf("precert") > -1) {
                    objDeviceJson["iplayer"] = grunt.file.readJSON(icwd + entry["location"]);
                }
            });

            objCombinedJson[brandmodel] = objDeviceJson;
        });
        console.log("Combined and now writing the file");
        grunt.file.write("public/settings/configscombined.json", JSON.stringify(objCombinedJson, null, '\t'));

    });

    grunt.registerTask('getitdone', ['folder_list','generatefolders']);
}