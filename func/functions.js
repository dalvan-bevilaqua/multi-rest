"use strict";

const fileExtension = require('file-extension');
const Thumbler = require('thumbler');
const uuid = require('uuid');
const fs = require('fs-extra');

const f = {};

f.check = function check(files, field, options, callback) {
	if (typeof(files) === 'undefined' || typeof(files[field]) === 'undefined') {
		// check if the field is medtory or not
		if (options.used == "maybe") {
			return callback(null, false);
		} else if (options.used == "must") {
			return callback({code: "ExternalError", messege: "Cannot read property '" + field + "' of undefined"}, null)
		}
	}else {
		return callback(null, true);
	}
}

f.thumbnail =function (path, options, callback){
	fs.mkdirpSync(options.uploadDir+'thumbnails/');
	Thumbler({
		type: options.thumbnail.type, 
		input: path,
		output: options.uploadDir+'thumbnails/'+uuid.v4()+'.jpeg', 
		time: '00:00:01',
		size: options.thumbnail.size, 
	}, function(err, path){
	    if (err) return callback(err, null);
	    return callback(null, path)
	});
}


// renaming the file
f.filename = function (name, options){
	if (options.filename == "random") {
		return uuid.v4() + '.' + fileExtension(name);
	}else if (options.filename == "same") {
		return name.replace(fileExtension(name), '') + fileExtension(name);
	}else if (options.filename == "plus_date") {
		return name.replace('.' + fileExtension(name), '') + '_' + new Date().toString().replace(/ /g, '_') + '.' + fileExtension(name);
	} else {
		return uuid.v4() + '.' + fileExtension(name);
	}
}

// clean the file object from unwanted attributes 
f.restructure = function (file){
	return {
		path: file.path,
		type: file.type, 
		size: file.size,
		name: file.name,
		thumbnail: file.thumbnail || null
	};
}

// clean files from the system 
f.clean = function(files) {
	files.forEach(function(file){
		fs.unlinkSync(file);
	})
}
module.exports = f;