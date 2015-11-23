(function(angular){
  /*
   * View module
   * Contains the logic for displaying the game board through a viewport
   */
  angular
    .module('zombies.view', [])
    .directive('zombiesView', zombiesView)
    .controller('ZombiesViewCtrl', ZombiesViewCtrl)
    .directive('zombieTile', zombieTile)
    .controller('ZombiesTileCtrl', ZombiesTileCtrl)
  ;

  function zombiesView() {
    return {
      templateUrl: 'view.jade',
      controller: 'ZombiesViewCtrl',
      controllerAs: 'ctrl',
    };
  }


  ZombiesViewCtrl.$inject = ['$scope', 'GameManager'];
  function ZombiesViewCtrl($scope, game) {
    var ctrl = this;

    // Viewport represented by x,y,r
    // (x,y) - the center point of the view
    // r - the radius of the view
    ctrl.viewport = [0,1,3];
    ctrl.view_tiles = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];

    ctrl.initialize = function (){};

    ctrl.update_view = function (){
      console.log("updating view");
      var x_offset = ctrl.viewport[0]
          , y_offset = ctrl.viewport[1]
          , radius = ctrl.viewport[2]
          , diam = (radius - 1) / 2
          ;

      for (var y = 0; y < radius; y++) {
        for (var x = 0; x < radius; x++) {
          // the board uses a standard cartesian coordinates system
          // this is possible because objects are referenced by keys rather
          // than stored in an array, but an unfortunate side effect is that
          // the coordinates sytems don't match in the y-axis.
          var flip_y = radius-1-y;
          ctrl.view_tiles[flip_y][x] = game.board.tiles[(x+x_offset-diam) +":"+ (y+y_offset-diam)];
        }
      }
    };

    $scope.$watch(
      function () { return game.board.tiles; },
      function(new_value, old_value) {
        if (new_value != old_value)
          ctrl.update_view();
      }
    );
  }


  function zombieTile() {
    return {
      scope: {},
      bindToController: {
        tile: '=ngModel',
      },
      templateUrl: 'tile.jade',
      controller: 'ZombiesTileCtrl',
      controllerAs: 'ctrl',
    };
  }

  ZombiesTileCtrl.$inject = ['$scope'];
  function ZombiesTileCtrl($scope) {
    var ctrl = this;
  }
}(angular));
