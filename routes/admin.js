/**
 * Created by michaelwagler on 2015-03-05.
 *
 * Callback functions for handling admin requests
 *
 *
 *  Mar 08. Added Functionality by Edward:
 *  ---- File Downloading from any FTP link that does not require authentication
 *  ---- Error handling included, Only valid ftp link with files can be downloaded
 *  ---- All downloaded files are temporarily stored in download_data/temp/ folder
 */


var appRoot = require('app-root-path');
var Converter = require(appRoot+'/util/converter.js');
var User = require(appRoot+'/model/user.js');


function get(req, res) {

    User.getAll(function (err, allUsers)
    {

        res.render('admin', {
                title: 'Admin Panel',
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString(),
                listUser:allUsers
            }
        );
    });
}

function deleteUser(req,res){
    var userName = req.body['userName'];
    User.remove(userName,function (err, result)
    {
       if(userName==""){
            req.flash('error', 'username cannot be emptyl!');

            return res.redirect('back');}
       if(err)
       {
           req.flash('error', 'Error in deleting a user');

           return res.redirect('back');
       }

        req.flash('success', 'A user is deleted');
        res.redirect('back');
    });
}

function becomeAdmin(req,res){
    var userName = req.body['userName'];
    User.setPrivilege(userName, 'admin',  function(err, result)
    {
        if(userName==""){
            req.flash('error', 'username cannot be empty!');

            return res.redirect('back');}
        if(err){
            req.flash('error', 'Error when changing user to admin!');

            return res.redirect('back');
        }
        req.flash('success', 'The' + userName +' has become an admin!');
        res.redirect('back');
    });
}

function download(req,res) {
    var link = req.body['link'];
    if(!isAFTPLink(link))
    {
        req.flash('error', 'Link must be a valid FTP link!');
        return res.redirect('/admin');
    }
    else if(!isCSV(link))
    {
        req.flash('error', 'File Extension must be .csv!');
        return res.redirect('/admin');
    }
    else if(!isCrime(link))
    {
        req.flash('error', 'Error, you are not downloading a crime file!');
        return res.redirect('/admin');
    }
    var JSFtp = require("jsftp");

    var ftp = new JSFtp({
            host: getFTPHost(link),
            port: 21, // defaults to 21
            user: "anonymous", // defaults to "anonymous"
            pass: "anonymous@" // defaults to "@"
        });
    var filename = "crime_data.csv";
    var localPath = appRoot+'/download_data/temp/'+filename;


    ftp.get(getFTPLink(link), localPath, function(hadErr) {
        if (hadErr){

            req.flash('error', 'Cannot download file from Data Vancouver website! File not found? Please try again later!');
            return res.redirect('/admin');
        }

        else {

            req.flash('success', 'File copied successfully!');
            res.redirect("/admin");
        }
    });

}

function update(req, res){
    Converter.parseData();

    if(!res){
        req.flash('error', 'Data paring failed. Did u parse a crime data?');
    }
    req.flash('success', 'Data has been parsed and stored successfully!');
    res.redirect("/admin");
}

function getFTPLink(link)
{
    var ftpLink;
    var startposFTPLink = 6;
    for(var i=startposFTPLink; i<link.length;i++)
    {
        if(link.charAt(i)=='/')
        {
            ftpLink= link.substr(i+1);
            return ftpLink;
        }
    }
}

function getFTPHost(link)
{
    var host;
    var startposFTPLink = 6;
    for(var i=startposFTPLink; i<link.length;i++)
    {
        if(link.charAt(i)=='/')
        {
            host= link.substr(0,i);
            host= host.substr(6);
            return host;
        }
    }
    return null;
}


function isAFTPLink(link){
    var aLink = link+"";
    if(aLink=="") return false;
    else return aLink.substr(0, 6).toLowerCase() == "ftp://";

}

function isCrime(link){
    var aLink = link+"";
    var crimeLinkPos = (aLink.length - 14);
    return (aLink.toLowerCase().indexOf("crime")==( crimeLinkPos));

}
function isCSV(link){
    var extension =link.substr(link.length-4).toLowerCase()+"";
    return extension==".csv";
}




module.exports = {
    get: get,
    download: download,
    update: update,
    deleteUser : deleteUser,
    becomeAdmin: becomeAdmin
};