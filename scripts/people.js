/* global Global */
"use strict";

Global.peopleStore = {
	peopleList: [],
	addPeople: function (list, skipSave) {
		var toAdd = list.split("\n"),
			added = [],
			i, name;

		for (i = 0; i < toAdd.length; i++) {
			name = toAdd[i].trim();
			if ( name && (Global.peopleStore.peopleList.indexOf(name) === -1) ) {
				Global.peopleStore.peopleList.push(name);
				added.push(name);
			}
		}

		Global.peopleStore.peopleList.sort(function (a, b) {
			return a.toLowerCase() > b.toLowerCase();
		});

		if ( !skipSave ) { Global.peopleStore.save(); }

		return added;
	},
	removePerson: function (name, skipSave) {
		var i = Global.peopleStore.peopleList.indexOf(name);

		if ( i !== -1 ) {
			Global.peopleStore.peopleList.splice(i, 1);
		}

		if ( !skipSave ) { Global.peopleStore.save(); }
	},
	save: function () {
		Global.dataStore.store("people", Global.peopleStore.peopleList.join("\n"));	
	}
};

Object.defineProperty(Global.peopleStore, "people", {
	get: function () {
		// Clone list of people, so that the original isn't touched
		return Global.peopleStore.peopleList.slice(0);
	}
});

Global.dataStore.get("people", function (list) {
	if (list) {
		Global.peopleStore.addPeople(list, true);
	}
});