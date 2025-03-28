const users = require('./UserSchema');
const mongoose = require('mongoose');

const messageSchema = new  mongoose.Schema({
  email : {
    type : String,
    unique : true,
  },
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: { type: String },
      timestamp: { type: Date, default: Date.now },
      viewed: { type: Boolean, default: false }
    }
  ],
  notifications : {
    type : Number,
    default : 0,
  }
});

messageSchema.methods.sendMessage = async function (senderId, content){
  this.messages.push({ sender: senderId, content : content });
  this.notifications += 1;
  await this.save();
}

messageSchema.methods.markmessagesAsViewed = async function () {
  this.messages.forEach((msg) => {
    msg.viewed = true
    this.notifications -= 1
  });
  await this.save();
}


module.exports = mongoose.model('userChats' , messageSchema);