/**
 * Created by pandys01 on 28/04/2016.
 */

function displayPanels(settings){
    var objAllConfigs = settings;

    $.each(objAllConfigs, function(key){   // deleting the .json from the config names at the end.
        objAllConfigs[key.substring(0, key.length - 5)] = objAllConfigs[key];
        delete objAllConfigs[key];
    });

    var strBuildPanels = '';
    strBuildPanels += '<table class="table" id="table"><thead><tr><th>Tal Configs</th><th></th></tr></thead><tbody>';


    var strGlyphicon = "glyphicon-ok-circle";
    $.each(objAllConfigs, function(key, value){     // loop through each device in the json
        var strEachBuildPanels = '';
        strEachBuildPanels += '<tr id="devicepanel-'+key+'"><td style="width: 65%"><div class="panel panel-primary"><div class="panel-heading">';
        strEachBuildPanels += '<h3 class="panel-title"><span class="glyphicon '+strGlyphicon+'"></span>   '+key+'</h3>';
        strEachBuildPanels += '<span class="pull-right clickable panel-collapsed"><i class="glyphicon glyphicon-chevron-up"></i></span></div>';
        strEachBuildPanels += '<div class="panel-body"><ul class="nav nav-pills">';

        $.each(value, function(versions, confs){ // loop through each version in the device BUILDING the LIST
            var version = versions.replace(/\./g, '');
            var strGlyph = "glyphicon-remove";
            var strLabel = "label-danger";
            if (versions != "CurrentDevVersion" && versions != "iplayer"){                             // for all the versions except CDV

                var delta = jsondiffpatch.diff(value["CurrentDevVersion"], confs);
                if (delta == undefined){ // define success or failure
                    strGlyph = "glyphicon-ok";
                    strLabel = "label-success";
                }
                strEachBuildPanels += '<li role="presentation" devicename="pilliplayer-'+key+'" onclick="tapconfig(this)"><a href="#pill-'+key+'-'+version+'"  data-toggle="tab">'+versions+'   <span class="label '+strLabel+'"><span class="glyphicon '+strGlyph+'"></span></span></a></li>';

            }
        });
        strEachBuildPanels += '<li role="presentation" devicename="pilliplayer-'+key+'" onclick="cleartapconfig(this)"><a href="#pillclear-'+key+'"  data-toggle="tab">Clear</a></li>'; // adding a clear pill to clear the contents of the jumbotron.
        strEachBuildPanels += '</ul><div class="tab-content">';

        $.each(value, function(versions, confs){ // loop through each version in the device BUILDING the diff Panels
            var version = versions.replace(/\./g, '');
            if (versions != "CurrentDevVersion"){                             // for all the versions except CDV
                strEachBuildPanels += '<div class="tab-pane" id="pill-'+key+'-'+version+'"><div class="jumbotron">';
                strEachBuildPanels += '<div id="diffcontent-'+key+'-'+version+'"></div></div></div>';
            }
        });
        strEachBuildPanels += '<div class="tab-pane" id="pillclear-'+key+'"></div>';

        strEachBuildPanels += '</div></div></div></td>';
        strEachBuildPanels += '<td id="tap_config-'+key+'"><div class="panel panel-primary" id="pilliplayer-'+key+'" style="display:none" ><div class="panel-heading"><h3 class="panel-title"> Tap config </h3>';
        strEachBuildPanels += '<span class="pull-right clickable panel-collapsed"><i class="glyphicon glyphicon-chevron-up" data-toggle="collapse"></i></span></div>';

        if( value["iplayer"] == undefined )  {

            strEachBuildPanels += '<div class="panel-body"><textarea class ="form-control" disabled rows="30">No iPlayer precert config for this device.</textarea></div></div></div>';
        }
        else{
            strEachBuildPanels += '<div class="panel-body"><textarea class ="form-control" disabled rows="30">'+JSON.stringify(value["iplayer"],null,4)+'</textarea></div></div></div>';
        }

        strEachBuildPanels += '</td></tr>';

        strBuildPanels += strEachBuildPanels;

    });
    strBuildPanels += '</tbody></table>';
    $('#generatePanels').append(strBuildPanels);

}

function applyDiffs(settings){
    var objAllConfigs = settings;

     $.each(objAllConfigs, function(key, value){     // loop through each device in the json

        $.each(value, function(versions, confs){ // loop through each version in the device AND ADD THE DIFFS INSIDE.
            var version = versions.replace(/\./g, '');
            if (versions != "CurrentDevVersion"){                             // for all the versions except CDV

                var delta = jsondiffpatch.diff(value["CurrentDevVersion"], confs);
                if (delta != undefined){ // define success or failure
                    document.getElementById('diffcontent-'+key+'-'+version).innerHTML = jsondiffpatch.formatters.html.format(delta, value["CurrentDevVersion"]);
                }
                else{
                    delta = jsondiffpatch.diff({}, value["CurrentDevVersion"]);
                    document.getElementById('diffcontent-'+key+'-'+version).innerHTML = jsondiffpatch.formatters.html.format(delta, value["CurrentDevVersion"]);
                }

            }
        });

    });

}


