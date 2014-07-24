/* jshint globalstrict: true */
"use strict";

var peopleStore = {
	peopleList: [],
	addPeople: function (list, skipSave) {
		var toAdd = list.split("\n"),
			added = [],
			i, name;

		for (i = 0; i < toAdd.length; i++) {
			name = toAdd[i].trim();
			if ( name && (peopleStore.peopleList.indexOf(name) === -1) ) {
				peopleStore.peopleList.push(name);
				added.push(name);
			}
		}

		peopleStore.peopleList.sort(function (a, b) {
			return a.toLowerCase() > b.toLowerCase();
		});

		if ( !skipSave ) { peopleStore.save(); }

		return added;
	},
	removePerson: function (name, skipSave) {
		var i = peopleStore.peopleList.indexOf(name);

		if ( i !== -1 ) {
			peopleStore.peopleList.splice(i, 1);
		}

		if ( !skipSave ) { peopleStore.save(); }
	},
	save: function () {
		dataStore.store("people", peopleStore.peopleList.join("\n"));	
	}
};

Object.defineProperty(peopleStore, "people", {
	get: function () {
		// Clone list of people, so that the original isn't touched
		return peopleStore.peopleList.slice(0);
	}
});

dataStore.get("people", function (list) {
	if (list) {
		peopleStore.addPeople(list, true);
	}
});