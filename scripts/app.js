/* global Controllers */
"use strict";

var wwApp = angular.module("wwApp", ["ui.router"]);

wwApp.config(function ($stateProvider, $urlRouterProvider) {
	// Default
	$urlRouterProvider.otherwise("/main");

	// Main menu page
	$stateProvider.state("main", {
		url: "/main",
		templateUrl: "pages/main.html",
	});

	// Scenario
	$urlRouterProvider.when("/scenario", "/scenario/list");
	$stateProvider.state("scenario", Controllers.scenario.base);
	$stateProvider.state("scenario.list_scenarios", Controllers.scenario.list);
	$stateProvider.state("scenario.manage_scenario", Controllers.scenario.manage);

	// People
	$urlRouterProvider.when("/people", "/people/list");
	$stateProvider.state("people", Controllers.people.base);
	$stateProvider.state("people.list_people", Controllers.people.list);
	$stateProvider.state("people.add_people", Controllers.people.add);

	// Game
	$urlRouterProvider.when("/game", "/game/list_people");
	$stateProvider.state("game", Controllers.game.base);
	$stateProvider.state("game.list_people", Controllers.game.people.list);
	$stateProvider.state("game.add_people", Controllers.game.people.add);
	$stateProvider.state("game.list_scenarios", Controllers.game.scenarios.list);
	$stateProvider.state("game.manage_scenario", Controllers.game.scenarios.manage);

});

