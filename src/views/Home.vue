<template>
  <main id="home-view">
        <h1>Find a room</h1>

        <form name="findRoom">
            <input type="text" name="roomName" placeholder="NAME OF THE ROOM">
            <input type="submit" name="submit" value="Search this room">
        </form>

        <div id="findRoom" style="margin-top: 10px"></div>

        <hr style="margin-bottom: 50px;">

        <div style="vertical-align:top;display:inline-block;overflow:scroll-y;padding:10px;">
        	<div id="conversation"></div>
            <div id="musicBlock" style="display:none">
                <form name="findMusic">
                    <input type="text" name="musicName" placeholder="NAME OF THE MUSIC">
                    <input type="submit" name="submit" class="btn" value="Search this music">
                </form>
                <div id="videosFound" style="margin-top: 80px;"></div>
            </div>
        </div>

        <hr style="margin-top: 50px">

        <span>Nom de la room : </span><div style="margin-top: 20px; display: inline-block; color: red;" id="roomName"></div><br>
        <span>Qui est dans la room : </span><div style="margin-top: 20px; display: inline-block; color: red;" id="users"></div><br>
        <span>Playlist : </span><div style="margin-top: 20px; display: inline-block; color: red;" id="playlist"></div><br>
        <div style="margin-top: 20px; display: none; text-decoration: underline; cursor: pointer; color: red;" id="quitRoom">QUITROOM</div>

  </main>
</template>


<script>
import axios         from 'axios'

export default {
  name: 'home-view',
  methods: {

    returnVideos(title, channelTitle, url, id) {
      return `
        <div class="videos" data-id="${id}">
          <div class="id" data-id="${id}"></div>
          <div class="title" data-title="${title}">Title :<br> ${title}</div><br>
          <div class="channelTitle" data-channelTitle="${channelTitle}">Nom de la chaine :<br> ${channelTitle}</div><br>
          <img src="${url}" style="width:100%"><br>
          <div>Id :<br> ${id}</div>
          <button id="addMusic">Add</button>
        </div>
      `
    },

    connect() {
      this.$socket.on('connect', function() {
        console.log("Connected successfully to the room");
      })
    },

    disconnect() {
      this.$socket.emit('disconnectRoom');
      document.getElementById('#conversation, #roomName, #users').html('');
  		document.getElementById('#quitRoom').css('display','none');
  		document.getElementById('form[name="findRoom"]').css('display','block');
  		document.getElementById('#musicBlock').css('display','none');
      console.log("Disconnected from the room");
    },

    findRoom() {
      /*
      document.getElementById('#findRoom').html('')
        $.ajax({
          type: "POST",
          url: "http://localhost:3001/room/get",
          data: {
            name: document.getElementsByTagName('input[name="roomName"]').value,
            jwt: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNWExNThiOGJhYzU1OTYxMTgxZmEzNzFjIiwiaWF0IjoxNTExMzYxNDE5fQ.AoYpb1iqRGeFUAJM4-36zV9psX0xtwDbBbINhlxgTsQ",
          },
          success: function(data) {
            if(data.code == 203) {
              for (var i = 0; i < data.data.length; i++) {
                document.getElementById('#findRoom').append('<div><div>'+data.data[i].name+'</div><a href="#" onclick="joinRoom(\''+data.data[i]._id+'\',\''+data.data[i].name+'\')">Join</a></div>')
              }
            } else {
              document.getElementById('#findRoom').html('<div>Nothing here</div>')
            }
          },
          error: function(data) {
            document.getElementById('#findRoom').html('<div>Error</div>')
          },
          dataType: "json"
        });
        */
    },

    findVideo() {
      document.getElementsByTagName('form[name="findMusic"] input[type="submit"]').prop('disabled', true);
		//call ajax find room
		document.getElementsById('#videosFound').html('')
		$.ajax({
			type: "POST",
			url: "http://localhost:3001/music/search/youtube",
			data: {
				name: document.getElementsByTagName('input[name="musicName"]').value,
				jwt: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNWExNThiOGJhYzU1OTYxMTgxZmEzNzFjIiwiaWF0IjoxNTExMzYxNDE5fQ.AoYpb1iqRGeFUAJM4-36zV9psX0xtwDbBbINhlxgTsQ",
			},
			success: function(data) {
				if(data.code == 201) {
					for (var i = 0; i < data.data.length; i++) {
						// video[data.data[i].id] = {
						// 	id: data.data[i].id,
						// 	title: data.data[i].title,
						// 	channel: data.data[i].channelTitle,
						// }
						document.getElementsById('#videosFound').append(returnVideos(data.data[i].title, data.data[i].channelTitle, data.data[i].thumbnails.high.url, data.data[i].id))
						document.getElementsByTagName('form[name="findMusic"] input[type="submit"]').prop('disabled', false);
					}
				} else {
					console.log(data)
					document.getElementsById('#videosFound').html('<div>Nothing here</div>')
				}
			},
			error: function(data) {
				console.log(data)
				document.getElementsById('#videosFound').html('<div>Error</div>')
			},
			dataType: "json"
		});
    }

    addMusic() {
      this.$socket.emit('addMusic', obj);
  		document.getElementById('#videosFound').html('');
  		document.getElementsByTagName('input[name="musicName"]').value;
    },

    updateChat() {
      this.$socket.on("updatechat", function(username, data) {
        document.getElementById("#conversation").append('<b>'+username+':</b> '+data+'<br />');
      })
    },

    userList() {
      this.$socket.on("user-list", function(userList) {
        console.log(usersList);
        document.getElementById('#users').html('<div>'+usersList+'</div>');
      })
    },

    playList() {
      this.$socket.on("playlist-list", function(playlist) {
        $('#playlist').html("")
    		for(var i = 0; i < playlist.length; i++) {
    			document.getElementById('#playlist').append(`<div>${playlist[i].title}</div>`)
    		}
      })
    }

  }
}
/*

// when the client clicks SEND
	$('#datasend').click(function() {
		var message = $('#data').val();
		$('#data').val('');
		// tell server to execute 'sendchat' and send along one parameter
		socket.emit('sendchat', message);
	});

	// when the client hits ENTER on their keyboard
	$('#data').keypress(function(e) {
		if(e.which == 13) {
			$(this).blur();
			$('#datasend').focus().click();
		}
	});

document.getElementById('#addMusic').addEventListener('click' ,function() {
		var pointed = $(this).closest('.videos');
		var id = pointed.attr('data-id');
		var title = pointed.find('.title').attr('data-title');
		var channel = pointed.find('.channelTitle').attr('data-channelTitle');
		var obj = {
			id: id,
			title: title,
			channel: channel
		};

		this.$socket.emit('addMusic', obj);
		document.getElementById('#videosFound').html('');
		document.getElementById('input[name="musicName"]').value;
	});
*/
</script>

<style lang="css">
.btn {
  display: inline-block;
  padding: 0.5em 1.4em;
  color: #fff;
  text-decoration: none;
  border-radius: 2px;
  border: none;
  cursor: pointer;
  background: linear-gradient(to bottom, #42b983, #128953);
}
.btn:hover {
  background: linear-gradient(to bottom, #42b983 50%, #128953);
}
.btn:active {
  background: linear-gradient(to bottom, #128953, #42b983 50%);
}
</style>
