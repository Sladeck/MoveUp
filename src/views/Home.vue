<template>
  <main id="home-view">
        <h1>Find a room</h1>

        <form name="findRoom" @submit.prevent>
            <input type="text" name="roomName" placeholder="NAME OF THE ROOM" v-model="roomName">
            <input type="submit" name="submit" v-on:click="searchRoom(roomName)"  value="Search this room">
        </form>

        <div id="findRoom" style="margin-top: 10px">
          <room-card :roomslist="roomslist" v-for="room in roomslist"></room-card>
          <!--<user-card :user="user" v-for="(user, index) in filteredUsers" :key="user.id" /> -->
        </div>

        <hr style="margin-bottom: 50px;">

        <div style="vertical-align:top;display:inline-block;overflow:scroll-y;padding:10px;">
        	<div id="conversation"></div>
            <div id="musicBlock" style="display:none">
                <form name="findMusic" @submit.prevent>
                    <input type="text" name="musicName" placeholder="NAME OF THE MUSIC" v-model="musicName">
                    <input type="submit" name="submit" class="btn" v-on:click="findMusic(musicName)" value="Search this music">
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
import RoomCard from './roomCard.vue'

export default {

  name: 'home-view',

  components: { RoomCard },

  data () {
    return {
      roomName: '',
      musicName: '',
      roomslist: [],
      nickname: '',
      usersList: [],
    }
  },

  sockets: {
    connect: function(){
      this.$socket.on('connect', function() {
        console.log("Connected successfully to the room");
      })
    },
    getUsersList: function(){
      this.$socket.on('get-users-list', function(value){
        console.log(value)
        usersList = value
      });
    }
  },

  methods: {
    searchRoom: function(nickname) {
      /*function renderJoin(id, name) {
        return `
        <form name="joinRoom" @submit.prevent>
            <div>${name}</div>
            <input type="submit" name="submit" v-on:click="joinRoom('hi','hi')" value="Join this room">
        </form>
        `
      };*/
      $('#findRoom').html('')
      $.ajax({
        type: "POST",
        url: "http://localhost:3001/room/get",
        data: {
          name: nickname,
        },
        success: function(data) {
          if(data.code == 203) {
            this.roomslist = []
            for (var i = 0; i < data.data.length; i++) {
              var test = data.data[i]
              this.roomslist.push({test})
              //$('#findRoom').append(renderJoin(data.data[i]._id, data.data[i].name))
              //$('#findRoom').append('<div><div>'+data.data[i].name+'</div><a href="#" v-on:click="joinRoom(\''+data.data[i]._id+'\',\''+data.data[i].name+'\')">Join</a></div>')
            }
            console.log(this.roomslist);
          } else {
            $('#findRoom').html('<div>Nothing here</div>')
          }
        },
        error: function(data) {
          $('#findRoom').html('<div>Error</div>')
        },
        dataType: "json"
      });
    },
    joinRoom: function(roomId, roomName) {
      console.log("here")
      this.$socket.emit('joinRoom', {username: username, roomId: roomId, roomName: roomName});
      $('#roomName').html('<div>'+roomName+'</div>');
      $('#quitRoom, #musicBlock, #chat').css('display', 'block');
      $('form[name="findRoom"]').css('display','none');
      $('#findRoom').html('');
    }
  },

}

  /*methods: {

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
      $('#conversation, #roomName, #users').html('');
  		$('#quitRoom').css('display','none');
  		$('form[name="findRoom"]').css('display','block');
  		$('#musicBlock').css('display','none');
      console.log("Disconnected from the room");
    },

    findRoom() {

      $('#findRoom').html('')
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
                $('#findRoom').append('<div><div>'+data.data[i].name+'</div><a href="#" onclick="joinRoom(\''+data.data[i]._id+'\',\''+data.data[i].name+'\')">Join</a></div>')
              }
            } else {
              $('#findRoom').html('<div>Nothing here</div>')
            }
          },
          error: function(data) {
            $('#findRoom').html('<div>Error</div>')
          },
          dataType: "json"
        });

    },

    findVideo() {
    $('form[name="findMusic"] input[type="submit"]').prop('disabled', true);
		//call ajax find room
		$('#videosFound').html('')
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
            $('#videosFound').append(returnVideos(data.data[i].title, data.data[i].channelTitle, data.data[i].thumbnails.high.url, data.data[i].id))
            $('form[name="findMusic"] input[type="submit"]').prop('disabled', false);
          }
        } else {
          console.log(data)
          $('#videosFound').html('<div>Nothing here</div>')
        }
      },
      error: function(data) {
        console.log(data)
        $('#videosFound').html('<div>Error</div>')
      },
      dataType: "json"
    });
  },

    addMusic() {
      this.$socket.emit('addMusic', obj);
  		$('#videosFound').html('');
  		$('input[name="musicName"]').value;
    },

    updateChat() {
      this.$socket.on("updatechat", function(username, data) {
        $("#conversation").append('<b>'+username+':</b> '+data+'<br />');
      })
    },

    userList() {
      this.$socket.on("user-list", function(userList) {
        console.log(usersList);
        $('#users').html('<div>'+usersList+'</div>');
      })
    },

    playList() {
      this.$socket.on("playlist-list", function(playlist) {
        $('#playlist').html("")
    		for(var i = 0; i < playlist.length; i++) {
    			$('#playlist').append(`<div>${playlist[i].title}</div>`)
    		}
      })
    },

  }
}


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
	});*/

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
