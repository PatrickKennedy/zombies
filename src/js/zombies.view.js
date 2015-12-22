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

    ctrl.defaults = {
      // Viewport represented by x,y,r
      // (x,y) - the center point of the view
      // r - the radius of the view
      viewport: [0,-1,3],
      view_tiles: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ],

      preview_tiles: {},
      point_map: {},
    };

    ctrl.state = angular.copy(ctrl.defaults);

    ctrl.initialize = function (){
      ctrl.state = angular.copy(ctrl.defaults);
    };

    $scope.$on('initalize_game', ctrl.initalize);

    ctrl.update_view = function (){
      console.log("updating view");
      var x_offset = ctrl.state.viewport[0]
          , y_offset = ctrl.state.viewport[1]
          , radius = ctrl.state.viewport[2]
          , diam = (radius - 1) / 2
          ;

      for (var y = 0; y < radius; y++) {
        var row = ctrl.state.view_tiles[y];
        for (var x = 0; x < radius; x++) {
          var coord = (x+x_offset-diam) +":"+ (y+y_offset-diam);
          row[x] = ctrl.state.preview_tiles[coord] || game.board.tiles[coord];
          ctrl.state.point_map[x +":"+ y] = [(x+x_offset-diam), (y+y_offset-diam)];
        }
      }
    };

    $scope.$watch(
      // tiles can't be removed in Zombies
      function () { return game.board.events; },
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
      if (!game.state.hand)
        return;

      console.log("attempting to place tile at ", ctrl.coord, ctrl.view.state.point_map[ctrl.coord]);
      try {
        game.board.place_tile(ctrl.view.state.point_map[ctrl.coord], game.state.hand);
        game.state.hand = null;
        ctrl.remove_preview();
      } catch(e) {
        console.log(e);
      }
    };

    ctrl.preview_tile = function() {
      var preview = angular.copy(game.state.hand)
          , board_coord = game.board.coord(ctrl.view.state.point_map[ctrl.coord])
          ;

      if (!preview)
        return;

      console.log("placing preview");
      preview.preview = true;
      ctrl.view.state.preview_tiles[board_coord] = preview;
      ctrl.view.update_view();
    };

    ctrl.remove_preview = function() {
      var board_coord = game.board.coord(ctrl.view.state.point_map[ctrl.coord])
          , preview = ctrl.view.state.preview_tiles[board_coord]
          ;

      if (!preview)
        return;

      console.log("removing preview");
      ctrl.view.state.preview_tiles[board_coord] = undefined;
      ctrl.view.update_view();
    };

    ctrl.rotate_preview = function(rotation) {
      var board_coord = game.board.coord(ctrl.view.state.point_map[ctrl.coord])
          , tile = ctrl.view.state.preview_tiles[board_coord]
          ;

      if (!tile)
        return;

      console.log("updating rotation");
      tile.rotation = rotation;
      ctrl.view.update_view();
    };
  }
}(angular));
