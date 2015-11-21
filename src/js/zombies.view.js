(function(angular){
  /*
   * View module
   * Contains the display logic for the fixture list
   */
  angular
    .module('zombies.view', ['view.jade'])
    .directive('zombiesView', zombiesView)
    .controller('ZombiesViewCtrl', ZombiesViewCtrl)
    .filter('default', defaultFilter)
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


  ZombiesViewCtrl.$inject = ['$scope', 'GameController'];
  function ZombiesViewCtrl($scope, game) {
    var ctrl = this;
    game.initalize();

    // Viewport represented by x,y,r
    // (x,y) - the center point of the view
    // r - the radius of the view
    ctrl.viewport = [0,0,3];
    ctrl.view_tiles = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];

    ctrl.update_view = function (){
      var x_offset = ctrl.viewport[0]
          , y_offset = ctrl.viewport[1]
          , radius = ctrl.viewport[2]
          ;

      for (var y = 0; y < radius; y++) {
        var row = ctrl.view_tiles[y];
        for (var x = 0; x < radius; x++) {
          row[x] = game.state.tiles[x+x_offset +":"+ y+y_offset];
        }
      }
    };
  }

  function defaultFilter() {
    return function default_filter(item, def) {
        if (item !== undefined)
          return item;
        return def;
      };
  }

  function zombieTile() {
    return {
      scope: {
        tile: '=',
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
