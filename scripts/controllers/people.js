/* global Controllers */
/* global Global */
"use strict";

Controllers.people = {};

Controllers.people.base = {
	url: "/people",
	templateUrl: "pages/people.html",
};

Controllers.people.list = {
	url: "/list",
	templateUrl: "pages/people.list.html",
	controller: function ($scope, $state) {
		$scope.people = Global.peopleStore.people;
		$scope.removePerson = function (name) {
			Global.peopleStore.removePerson(name);
			Global.reload($scope, $state);
		};
	},
};

Controllers.people.add = {
	url: "/add",
	templateUrl: "pages/people.add.html",
	controller: function ($scope, $state) {
		$scope.peopleToAdd = "";
		$scope.addPeople = function () {
			Global.peopleStore.addPeople($scope.peopleToAdd);
			$state.go("^.list_people");
		};
	},
};
