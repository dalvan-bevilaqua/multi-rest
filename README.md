# Multi Rest v2

Multi rest is a swiss knife for handling multi-part requests for [restify](http://restify.com), and as all Node.js frameworks use HTTP server at the end so I built this dealing with HTTP requests, this module can handle diffrent files and process them.

| version 2 is received huge update from the last version with the thumbnails for images and videos 

## Features: 
	- Path handler.
	- File naming. 
	- Upload more then one file in the same request. 
	- Thumbnails for images & videos.
	- S3 support for AWS.
	- Upload certain extensions.

## In progress 
	- Handling multiple files under the same fieldname.
	- ......


[![NPM](https://nodei.co/npm/multi-rest.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/multi-rest/)

#### Example for disk:

```javascript

const restify = require('restify');
const Multi = require('multi-rest');
const uuid = require('uuid');

var server = restify.createServer();

var upload_disk = new Multi({
    driver: {
        type: 'local',
        path: "./uploads/"
    },
    filename: (name) => { // the extention will be added automaticlly 
        return uuid.v4();
    },
    filefields: {
        video: {
            type: 'video',
            thumbnail: {
                width: 100,
                time: ['10%'],
                count: 1
            },
            required: false,
            extensions: ['mp4']
        },
        image: {
            type: 'picture',
            thumbnail: {
                width: 400,
                height: 300
            },
            required: false,
            extensions: ['png', 'jpg']
        }
    }
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.post('/upload', upload_disk ,function (req, res, next){
	res.send({success: true, files: req.files, message: "file uploaded :)"});
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

```

#### Example for s3:

check how to configure [AWS-SDK](https://aws.amazon.com/sdk-for-node-js/) for Nodejs

You need to create AWS credentials to ~/.aws/credentials

```
[default]

aws_access_key_id = your_access_key

aws_secret_access_key = your_secret_key

```
#### Test code:

```javascript

const restify = require('restify');
const Multi = require('multi-rest');
const uuid = require('uuid');

var server = restify.createServer();

var upload_s3 = new Multi({
    driver: {
        type: 's3',
        endpoint: 's3-accelerate.amazonaws.com',
        signatureVersion: 'v4',
        region: 'eu-central-1',
        bucketName: 'test',
        path: ''
    },
    filename: (name) => { // the extention will be added automaticlly 
        return uuid.v4();
    },
    filefields: {
        video: {
            type: 'video',
            thumbnail: {
                height: 100,
                time: ['10%', '40%'],
                count: 2
            },
            required: false,
            extensions: ['mp4']
        },
        image: {
            type: 'picture',
            thumbnail: {
                width: 400,
                height: 300
            },
            required: false,
            extensions: ['png', 'jpg']
        }
    }
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

server.post('/upload', upload ,function (req, res, next){
	res.send({success: true, files: req.files, message: "file uploaded :)"});
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

```

#### File naming

##### Random 
This uses a `uuid` v4 library to create the file name
```javascript
function (name) { 
    return uuid.v4();
}
```
##### Same name 
This uses the name of the uploaded file .
```javascript
function (name) { 
    return name;
}
```
##### Plus date
This will add file upload timestamp after the file name.
```javascript
function (name) { 
    return name + new Date();
}
```
##### Date
This use `new Date()` to create the file name (not prefered when uploading more then one file)
```javascript
function (name) { 
    return new Date();
}
```
#### License
Licensed under MIT

#### Author
M. Mahrous developed at [The D. GmbH](https://thed.io)
Feel free to contact me [M. Mahrous](mailto:m.mahrous@thed.io) and improve the code.
