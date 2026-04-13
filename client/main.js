import { Meteor } from 'meteor/meteor';
import './main.css';
import { mountApp } from '../imports/ui/app';

Meteor.startup(() => {
  mountApp(document.getElementById('app'));
});
