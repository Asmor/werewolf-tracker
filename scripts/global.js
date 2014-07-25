/* exported Controllers */
/* exported Global */
"use strict";

var Controllers = {},
	Global = {
		reload: function ($scope, $state) {
			$state.transitionTo($state.current, $scope, {
				reload: true,
				// Todo: figure out what inherit and notify do
				inherit: false,
				notify: true,
			});
		},
	};