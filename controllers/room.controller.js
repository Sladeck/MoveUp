const Room = require('../models/room.model');

module.exports = {
    create: (req, res) => {

        const room = {
            "name": req.body.name,
        };

        if (typeof req.body.name === 'undefined') {
            return res.json({
                code: 401,
                message: "It miss a parameter"
            })
        }

        Room.find({"name": room.name})
            .then(roomFound => {
                if (typeof roomFound === 'null' || typeof roomFound == 'undefined' || roomFound.length == 0) {
                    Room.create(room)
                        .then(room => {
                            return res.json({
                                code: 201,
                                message: 'Room created',
                                data: room
                            })
                        })
                        .catch(
                            err => res.json({
                                code: 501,
                                message: err.message
                            })
                        )
                } else {
                    return res.json({
                        code: 401,
                        message: 'A room have already this name',
                    })
                }
            })
            .catch(
                err => res.json({
                    code: 501,
                    message: err.message
                })
            )
    },
    getRooms: (req, res) => {
        if(req.body.name) {
            Room.find({"name": { "$regex": req.body.name, "$options": "i" }}).limit(10)
                .exec()
                .then(rooms => {
                    if (rooms === null || rooms.length === 0)
                        return res.json({
                            code: 401,
                            message: "Room non trouvé"
                        })

                    return res.json({
                        code: 203,
                        message: "Voici les rooms",
                        data: rooms
                    })
                })
                .catch(err => res.json({
                    code: 501,
                    message: err.message
                }))
        } else {
            return res.json({
                code: 402,
                message: "Miss params name",
            })
        }
    },

}
