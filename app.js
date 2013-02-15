var im = require('imagemagick'),
	fs = require('fs'),
	path = require('path'),
	jsonlint = require('jsonlint'),
	async = require('async');

var KnowreSpriteFile = function() {
	this.fileName;
	this.top;
	this.height;
	this.width;
}

var KnowreSprite = function() {
	this.initialize();
}

_ = KnowreSprite.prototype;

_.initialize = function() {
	var that = this;

	this.targetDirectoryName = "image",
	this.targetDirectory = path.normalize(__dirname + "/" + this.targetDirectoryName);

	this.destinationDirectory = path.normalize(__dirname),
	this.resultantJsonName = this.destinationDirectory + "/" + this.targetDirectoryName + ".json";

	this.counter = 0;


	fs.readFile(that.resultantJsonName, function(err, data) {
		if(err) { 
			that.initializeSprite();
		} else if(!err) {
			that.updateChanges(data);
		}
	});
};

_.initializeSprite = function() {
	var that = this;


	fs.readdir(that.targetDirectory, function(err, files) {
		var inputDirectory = [],
			inputTitle = [],
			jsonContent = [];

		
		for(var i = 0; i < files.length; i++) {
			var fileName = files[i];				
				
			inputDirectory.push(that.targetDirectory + "/" + fileName);
			inputTitle.push(fileName);
		}

		async.mapSeries(inputDirectory, im.identify, function(err, data) {
			var top = 0;

			for(var i = 0; i < data.length; i++) {
				jsonContent[i] = new KnowreSpriteFile();

				jsonContent[i].fileName = inputTitle[i];
				jsonContent[i].top = top;
				jsonContent[i].height = data[i].height;
				jsonContent[i].width = data[i].width;

				top = top + data[i].height;
			}

			fs.writeFile(
				path.normalize(that.resultantJsonName),
				JSON.stringify(jsonContent),
				'utf-8', function() {
					//옵션 넣는곳ㅋ
					inputDirectory.push("-background");
					inputDirectory.push("none");
					inputDirectory.push("-append");
					inputDirectory.push(path.normalize(that.destinationDirectory + "/" + "output.png"));

					im.convert(inputDirectory, function(err, data) {
						if(err)
							console.log(err);
					});
				}
			);			
		});
	});
}

_.updateChanges = function(data) {
	this.updateRemoval(JSON.parse(data));
	//this.updateAddition(JSON.parse(data));
}

_.updateRemoval = function(data) {
	var jsonData = data,
		that = this;

	var removedFiles = [];

	fs.readdir(that.targetDirectory, function(err, files) {
		for(var i = 0; i < jsonData.length; i++) {
			if(!that.in_array(jsonData[i].fileName, files)) {
				var convertInput = [];

				jsonData[i].fileName = jsonData[i].fileName.replace(".png", "") + "_removed.png";

				im.convert(convertInput)
			};
		}
		console.log(jsonData);
	});
}

_.updateAddition = function(data) {
	var jsonData = data,
		that = this;

	
}

_.in_array = function(needle, haystack) {
	for(var key in haystack) {
		if(needle === haystack[key])
			return true;
	}
	return false;
}

var knowreSprite = new KnowreSprite();



/*
fs.readFile(resultantJsonName, function(err, data) {
	if(err) {
		fs.readdir(targetDirectory, function(err, files) {
			var inputDirectory = [],
				jsonContent = {};

			var top = 0;

			for(var i = 0; i < files.length; i++) {
				var fileName = files[i];
				jsonContent[fileName] = {};

				inputDirectory.push(targetDirectory + "/" + fileName);

				
				(function(fileName) {
					im.identify(inputDirectory[i], function(err, data) {
						jsonContent[fileName]["top"] = top;
						jsonContent[fileName]["height"] = data.height;
						jsonContent[fileName]["width"] = data.width;




						top = top + data.height;
					});
				})(fileName);
			}

//			setTimeout(function() {
				fs.writeFile(
					path.normalize(resultantJsonName),
					JSON.stringify(jsonContent),
					'utf-8')
//			)}, 3000);
		});
	} else if (!err) {
		console.log(JSON.parse(data));
	}
});

*/

/*
fs.readdir(targetDirectory, function(err, files) {
	var input  = [];

	for(var i = 0; i < files.length; i++) {
		input.push(targetDirectory + "/" + files[i]);
	}

	input.push("-append");
	input.push(destinationDirectory + "/" + "output.png");

	im.convert(input, function(err, data) {
		if(err)
			console.log(err);
	});
});
*/




/*
im.convert(
	["logo_beta_s.png", "title_feed_click.png", "-append", "output.png"]
);
*/

/*
im.convert(
	["-geometry", "+23+0", "logo_beta_s.png", "title_feed_click.png", "output.png"]
)*/

/*
im.convert([directory + "/title_feed_click.png", "-resize", "100x100", "dddddd.png"], function(err, stdout) {

})

im.identify(directory + "/title_feed_click.png", function(err, data) {
	console.log(data.width, data.height);
});*/


/*	im.identify(inputDirectory[i], function(err, data) {
					jsonContent[fileName]["top"] = top;
					jsonContent[fileName]["height"] = data.height;
					jsonContent[fileName]["width"] = data.width;

					top = top + data.height;

					that.counter++;

					if(fileslength == that.counter) {
						fs.writeFile(
							path.normalize(that.resultantJsonName),
							JSON.stringify(jsonContent),
							'utf-8'
						)
					}				

				});		*/