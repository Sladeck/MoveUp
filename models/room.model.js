const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const roomSchema = new mongoose.Schema({
    "name"          : { type: String, required: true},
}, { collection : 'rooms' });

// Fabrication d'un "Modèle" à partir de ce schéma de donnéés
// Un modèle mongoose contient les méthodes permettant d'aller
// chercher/modifier/supprimer dans la base (.find() .sort() .findOne()
// .count() .insert() .insertMany() ... etc)
const roomModel = mongoose.model('Room', roomSchema)

module.exports = roomModel
