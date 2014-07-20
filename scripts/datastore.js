/* jshint globalstrict: true */
"use strict";

var dataStore = {
	get: function (key, callback) {
		var data = localStorage[key];
		if (data) {
			data = JSON.parse(data);
		}
		callback(data);
	},
	remove: function (key) {
		delete localStorage[key];
	},
	store: function (key, value) {
		localStorage[key] = JSON.stringify(value);
	},
};