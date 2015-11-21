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
    ctrl.player = game.state.player;
  }
}(angular));
