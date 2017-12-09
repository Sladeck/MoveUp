require('colors');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const roomController = require('./controllers/room.controller');
const musicController = require('./controllers/music.controller');

var roomsList = {}

//      actual model room
// {
//     "5a159563e700a0142c0870eb" : {
//         users: [],
//         roomName: '',
//         musics: []
//     }
// }

//      actual model music
// {
//     musics : [{
//          id: '',
//          title: '',
//          channel: '',
//          added_by: {},
//          vote: '',
//     }]
// }

/*
    //NOTE:
        socket.emit : envoit des instructions qu'à soit.
        socket.broadcast.to : envoit des instructions à tout le monde (dans la room grâce au "to()") sauf soit-même.
        io.sockets.to : envoit des intrucstions à tout le monde sans restrictions.
*/

io.sockets.on('connection', function (socket) {
    console.log("hey")
	socket.on('joinRoom', function(data) {
		if (data.username !== socket.username) {
            socket.username = data.username;
    		socket.room = data.roomId;

    		if(roomsList[data.roomId] == undefined) {
    			roomsList[`${data.roomId}`] = { users: [data.username]}
    		} else {
    			roomsList[data.roomId].users.push(data.username)
    		}

    		socket.join(data.roomId)
    		socket.emit('updatechat', 'SERVER', `you have connected to "${data.roomName}" with id : ${data.roomId}`);
    		socket.broadcast.to(data.roomId).emit('updatechat', 'SERVER', data.username + ' has connected to this room');

            io.sockets.to(data.roomId).emit('users-list', roomsList[data.roomId].users)
		}
	})

    socket.on('addMusic', function(data) {

        // var obj = {
		// 	id: data.id,
		// 	title: data.title,
		// 	channel: data.channel
		// }

        if(roomsList[`${socket.room}`].musics == undefined) {
            roomsList[`${socket.room}`].musics = [{id: data.id,title: data.title,channel: data.channel}]
        } else {
            roomsList[`${socket.room}`].musics.push({id: data.id, title: data.title, channel: data.channel})
        }

        io.sockets.to(socket.room).emit('updatechat', socket.username, `add a new music, his name is : "${data.title}"`)
        io.sockets.to(socket.room).emit('playlist-list', roomsList[socket.room].musics)
    })

    socket.on('get-users-list', function () {
        io.sockets.to(socket.room).emit('users-list', roomsList[socket.room].users);
    });

    socket.on('get-playlist-list', function () {
        io.sockets.to(socket.room).emit('playlist-list', roomsList[socket.room]);
    });

	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.to(socket.room).emit('updatechat', socket.username, data);
	});

    socket.on('disconnectRoom', function() {
        if(roomsList[socket.room] !== undefined) {
            roomsList[socket.room].users = roomsList[socket.room].users.filter(user => user !== socket.username);

            //io.emit('users-list', usersList[socket.room]);
            socket.broadcast.to(socket.room).emit('users-list', roomsList[socket.room].users)

            // update list of users in chat, client-side
            io.sockets.to(socket.room).emit('updateusers', roomsList[socket.room].users);
            // echo globally that this client has left
            socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username + ' has disconnected');
            socket.leave(socket.room);
            socket.room = null;
            socket.username = null;
        }
    })

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
        if (socket.username !== undefined) {
            if(roomsList[socket.room] !== undefined) {
                // remove the username from global usernames list
                roomsList[socket.room].users = roomsList[socket.room].users.filter(user => user !== socket.username);

                socket.broadcast.to(socket.room).emit('users-list', roomsList[socket.room].users)

                // update list of users in chat, client-side
                io.sockets.to(socket.room).emit('updateusers', roomsList[socket.room].users);
                // echo globally that this client has left
                socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username + ' has disconnected');
                socket.leave(socket.room);
            }
        }
	});
});

var port = process.env.PORT || 3001;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({
    extended: true              // to support URL-encoded bodies
}));

app.use(bodyParser.json());     // to support JSON-encoded bodies

mongoose.Promise = global.Promise

mongoose
    .connect('mongodb://localhost:27017/moveup', {useMongoClient:true})
    .then( () => console.log("Connected to MongoDB".bgGreen+"\n") )
    .then(http.listen(port, function(){
        const message = 'Socket server on http://localhost:' + port;
        console.log(message.bgGreen+"\n");
    }))
    .catch(err => console.log(err.message.red))

app.post('/room/create', roomController.create)
app.post('/room/get', roomController.getRooms)
app.post('/music/search/youtube', musicController.searchYoutube)
