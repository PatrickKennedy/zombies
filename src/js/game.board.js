(function(angular){
  /*
   * Grid module
   * Contains playing field state and logic
   */
  angular
    .module('game.board', ['game.config'])
    .service('BoardManager', BoardManager)
    .factory('BoardNullTile', BoardNullTile)
    .factory('BoardTile', BoardTile)
  ;


  BoardManager.$inject = ['GameConfig', 'BoardNullTile',];
  function BoardManager(config, NullTile) {
    var ctrl = this;

    ctrl.placeholders = {
      indoor: new NullTile({placeable: true, outdoor: false}),
      ourdoor: new NullTile({placeable: true, outdoor: true}),
    };

    ctrl.defaults = {
      tiles: {},
      actor: '0:0',
      events: 0,
    };

    ctrl.tiles = {};
    ctrl.actor = '0:0';

    ctrl.initalize = function () {
      // ugly ugly ugly horrible initalization but everything assumes
      // the board doesn't have a state object but I want to keep defaults
      // externally configurable.
      // todo: build proper initalization or actually use a state object. fml.
      var defaults = angular.copy(ctrl.defaults);
      ctrl.tiles = defaults.tiles;
      ctrl.actor = defaults.actor;
      ctrl.events = defaults.events;
    };

    ctrl.move_actor = function (point) {
      var actor_point = ctrl.point(ctrl.actor)
          , coord = ctrl.coord[point]
          , tile = ctrl.tiles[coord]
          ;

      if (ctrl.walkable(actor_point, point))
        ctrl.actor = ctrl.coord(point);
    };

    ctrl.place_tile = function (point, tile) {
      // todo: add overwrite checks
      var coord = ctrl.coord(point)
          , enter_tile = ctrl.tiles[coord]
          , exit_coord
          , exit_tile
          ;

      // if there are no tiles then enter_tile will always be false-y
      // we want to let the first tile pass unquestioned
      if (Object.keys(ctrl.tiles).length > 0 && !(enter_tile && enter_tile.placeable))
        return false;

      ctrl.tiles[coord] = tile;
      for (var i = 0; i < tile.exits.length; i++) {
        var vector = tile.get_vector(tile.exits[i])
            , exit_point = [
              point[0] + vector[0],
              point[1] + vector[1],
            ]
            ;
        exit_coord = ctrl.coord(exit_point);
        exit_tile = ctrl.tiles[exit_coord];
        if (!exit_tile)
          ctrl.tiles[exit_coord] = ctrl.placeholders.indoor;
      }

      ctrl.events += 1;
      return true;
    };

    ctrl.coord = function(point) {
      return point[0] +":"+ point[1];
    };

    ctrl.point = function(coord) {
      var matches = coord.match(/([-\d]+)?:([-\d]+)?/);
      return [+matches[1], +matches[2]];
    };

    ctrl.near = function(p1, p2) {
      // Calculate the distance long a and b in c2 = a2 + b2
      var dist = Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);

      return (dist >= 0) && (dist <= 1);
    };

    ctrl.walkable = function(p1, p2) {
      var t1 = ctrl.tiles[ctrl.coord(p1)]
          , t2 = ctrl.tiles[ctrl.coord(p2)]
          , vec = [p2[0] - p1[0], p2[1] - p1[1]]
          , dir_coord = ctrl.coord(vec)
          ;
      // todo: add error throwing for better UI feedback
      if (!t1 || !t2 || !ctrl.near(p1, p2))
        return false;

      exit = t1.vector_map[dir_coord];
      return t1.has_exit(exit) && t2.has_exit((exit + 2) % 4);
    };
  }

  function BoardNullTile() {
    var Tile = function(config) {
      this.placeable = config.placeable;
      this.outdoor = config.outdoor;
    };

    return Tile;
  }

  function BoardTile() {
    var vectors = [
          [0, -1],  // 0 = North
          [1, 0],  // 1 = East
          [0, 1], // 2 = South
          [-1, 0], // 3 = West
        ]
        , vector_map = {
          '0:-1': 0,
          '1:0': 1,
          '0:1': 2,
          '-1:0': 3,
        }
        ;

    var Tile = function(config) {
      this.id = config.id;
      this.name = config.name;
      this.exits = config.exits;
      this.text = config.text;
      this.callbacks = config.callbacks;

      this.rotation = config.rotation || 0;

      this.vectors = vectors;
      this.vector_map = vector_map;
    };

    Tile.prototype.get_vector = function (v) {
      v += 4; // To allow for CCW rotation up to 360 degrees CCW
      return this.vectors[(v + this.rotation) % 4];
    };

    Tile.prototype.get_exit = function (coord) {
      return this.vector_map[coord];
    };

    Tile.prototype.has_exit = function (coord) {
      if (isNaN(coord))
        coord = this.vector_map[coord];
      coord = +coord;

      return this.exits.indexOf(coord) >= 0;
    };

    return Tile;
  }
}(angular));
