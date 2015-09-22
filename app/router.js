import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('inventory', function() {
    this.route('edit');
    this.route('new');
  });
  this.route('graphs');
});

export default Router;
