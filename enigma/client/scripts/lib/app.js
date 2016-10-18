// code adapted from: https://www.angular-meteor.com/tutorials/whatsapp/

import 'angular-animate';
import 'angular-meteor';
import 'angular-moment';
import 'angular-sanitize';
import 'angular-ui-router';
import 'ionic-scripts';
import Angular from 'angular';
import Loader from 'angular-ecmascript/module-loader'
import { Meteor } from 'meteor/meteor';
 
import ChatsCtrl from '../controllers/chats.controller';
import ChatCtrl from '../controllers/chat.controller';
import CalendarFilter from '../filters/calendar.filter';
import RoutesConfig from '../routes';
 
const App = 'ENIGMA';
 
Angular.module(App, [
  'angular-meteor',
  'angularMoment',
  'ionic'
]);

new Loader(App)
	.load(ChatsCtrl)
	.load(ChatCtrl)
	.load(CalendarFilter)
	.load(RoutesConfig)

if (Meteor.isCordova) {
  Angular.element(document).on('deviceready', onReady);
}
else {
  Angular.element(document).ready(onReady);
}
 
function onReady() {
  Angular.bootstrap(document, [App]);
}