import { Meteor } from 'meteor/meteor';
import { Chats, Messages } from '../lib/collections';
 
Meteor.methods({
  newMessage(message) {
 
    const messageId = Messages.insert(message);
    //FIXME, Chats.update is not working for users when using 'meteor mongo' on commmand line
    Chats.update(message.chatId, { $set: { lastMessage: message } });

    return messageId;
  },
  userSearch(queryString) {
    //simple search for users, currently searches usernames
    var query = {
      $where: "this.username.includes('"+queryString+"')"
    };
    var fields = { //limits what the search will return
      username: 1,
      emails: 1,
      profile: 1
    };
    
    var results = Meteor.users.find(query, {'fields': fields});
    return results.fetch();
  }
});