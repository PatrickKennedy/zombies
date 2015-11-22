(function(angular){
  /*
   * View module
   * Contains the display logic for the fixture list
   */
  angular
    .module('zombies.cribsheet', ['cribsheet.jade'])
    .directive('zombiesCribSheet', zombiesCribSheet)
    .controller('ZombiesCribSheetCtrl', ZombiesCribSheetCtrl)
  ;

  function zombiesCribSheet() {
    return {
      scope: {},
      templateUrl: 'cribsheet.jade',
      controller: 'ZombiesCribSheetCtrl',
      controllerAs: 'ctrl',
    };
  }


  ZombiesCribSheetCtrl.$inject = ['$scope', 'GameManager'];
  function ZombiesCribSheetCtrl($scope, game) {
    var ctrl = this;
    ctrl.state = game.state;

    $scope.$watch(
      function watch_state() { return game.state; },
      function(new_value, old_value) {
        if (new_value != old_value)
          ctrl.state = game.state;
      }
    );
  }
}(angular));
