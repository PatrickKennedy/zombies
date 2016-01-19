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
      console.log('initialize zombies.view');
      ctrl.state = angular.copy(ctrl.defaults);
    };

    $scope.$on('initialize_game', ctrl.initialize);

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

    ctrl.shift_view = function (vector) {
      ctrl.state.viewport[0] += vector[0];
      ctrl.state.viewport[1] += vector[1];
      ctrl.update_view();
    };

    ctrl.center_on = function (point) {
      ctrl.state.viewport[0] = point[0];
      ctrl.state.viewport[1] = point[1];
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
    Object.defineProperty(ctrl, "board_coord", {
      get: function () { return game.board.coord(ctrl.board_point); },
      enumerable: true,
    });

    Object.defineProperty(ctrl, "board_point", {
      get: function () { return ctrl.view.state.point_map[ctrl.coord]; },
      enumerable: true,
    });

    Object.defineProperty(ctrl, "actor_here", {
      get: function () {
        if (!game.state || !game.state.player)
          return false;
        return game.state.player.position == game.board.coord(ctrl.view.state.point_map[ctrl.coord]);
      },
      enumerable: true,
    });

    Object.defineProperty(ctrl, "interactable", {
      get: function () {
        if (!game.state.running || !ctrl.tile || !game.state.player.can_move)
          return false;

        if (game.state.hand) {
          return ctrl.tile.preview;
        } else {
          return !ctrl.tile.placeable &&
                  game.board.walkable(
                    game.board.point(game.state.player.position),
                    game.board.point(ctrl.board_coord)
                  )
                  ;
        }
      },
      enumerable: true,
    });

    Object.defineProperty(ctrl, "ng_classes", {
      get: function () {
        var class_tests = {
          present: ctrl.tile,
          placeable: ctrl.tile && ctrl.tile.placeable,
          preview: ctrl.tile && ctrl.tile.preview,
          interactable: ctrl.interactable,
        };

        return Object.keys(class_tests)
                .map(function(cls) { return class_tests[cls] ? cls : ""; })
                .join(' ');
      },
      enumerable: true,
    });


    ctrl.do_stuff = function() {
      console.log("do something with the tile at ", ctrl.coord);
      if (game.state.hand)
        return ctrl.place_tile();

      return ctrl.move_player();
    };

    // TODO: Add verbose error throwing. See: game.board.placeable
    ctrl.move_player = function() {
      if (game.move_player(ctrl.board_coord)) {
        ctrl.view.center_on(ctrl.board_point);
        ctrl.view.update_view();
        return true;
      }

      return false;
    };

    ctrl.place_tile = function() {
      if (!game.state.hand)
        return;

      if (game.place_tile(ctrl.board_point, game.state.hand)) {
        ctrl.remove_preview();
      }

    };

    ctrl.preview_tile = function() {
      var preview = angular.copy(game.state.hand)
          , board_coord = ctrl.board_coord
          , board_tile = game.board.tiles[board_coord]
          ;

      if (!preview || !board_tile || !board_tile.placeable)
        return;

      // XXX: Traditional copy methods (angular/sugar) only copy the
      // property's value and not the descriptor, meaning it misses get/setters
      // HACK:FIXME: An unintented, albeit helpful, side effect of the follow is
      // properies on the previews reference the storage values on the original
      // object in the hand. This means we don't have to update that value
      // but may cause problems down the line.
      // The solution to this is make another tile object that copies the tile's
      // values and maintains it's own properties. bleh.
      Object.defineProperty(preview, 'rotation',
        Object.getOwnPropertyDescriptor(game.state.hand, 'rotation'));

      Object.defineProperty(preview, 'exits',
        Object.getOwnPropertyDescriptor(game.state.hand, 'exits'));

      console.log("placing preview");
      preview.preview = true;
      ctrl.view.state.preview_tiles[board_coord] = preview;
      ctrl.view.update_view();
    };

    ctrl.remove_preview = function() {
      var board_coord = ctrl.board_coord
          , preview = ctrl.view.state.preview_tiles[board_coord]
          ;

      if (!preview)
        return;

      console.log("removing preview | rotation ["+ ctrl.view.state.preview_tiles[board_coord].rotation +"]");
      ctrl.view.state.preview_tiles[board_coord] = undefined;
      ctrl.view.update_view();
    };

    ctrl.rotate_preview = function(rotation) {
      var board_coord = ctrl.board_coord
          , preview = ctrl.view.state.preview_tiles[board_coord]
          ;

      if (!preview)
        return;

      console.log("updating rotation ["+ rotation +"]");
      preview.rotation = rotation;
      ctrl.view.update_view();
    };
  }
}(angular));
