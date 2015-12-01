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
    ctrl.viewport = [0,-1,3];
    ctrl.view_tiles = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];

    ctrl.preview_tiles = {};
    ctrl.point_map = {};

    ctrl.initialize = function (){};

    ctrl.update_view = function (){
      console.log("updating view");
      var x_offset = ctrl.viewport[0]
          , y_offset = ctrl.viewport[1]
          , radius = ctrl.viewport[2]
          , diam = (radius - 1) / 2
          ;

      for (var y = 0; y < radius; y++) {
        var row = ctrl.view_tiles[y];
        for (var x = 0; x < radius; x++) {
          var coord = (x+x_offset-diam) +":"+ (y+y_offset-diam);
          row[x] = ctrl.preview_tiles[coord] || game.board.tiles[coord];
          ctrl.point_map[x +":"+ y] = [(x+x_offset-diam), (y+y_offset-diam)];
        }
      }
    };

    $scope.$watch(
      // tiles can't be removed in Zombies
      function () { return Object.keys(game.board.tiles).length; },
      function(new_value, old_value) {
        if (new_value != old_value)
          console.log("Tiles dirty");
          ctrl.update_view();
      }
    );
  }


  function zombieTile() {
    return {
      scope: {},
      bindToController: {
        tile: '=',
        view: '=',
        coord: '@',
      },
      templateUrl: 'tile.jade',
      controller: 'ZombiesTileCtrl',
      controllerAs: 'ctrl',
    };
  }

  ZombiesTileCtrl.$inject = ['GameManager'];
  function ZombiesTileCtrl(game) {
    var ctrl = this;
    ctrl.place_tile = function() {
      if (!game.hand)
        return;
      console.log("attempting to place tile at ", ctrl.coord, ctrl.view.point_map[ctrl.coord]);
      game.board.place_tile(ctrl.view.point_map[ctrl.coord], game.hand);
    };

    ctrl.rotate_preview = function(rotation) {
      console.log(rotation);
    };
  }
}(angular));
