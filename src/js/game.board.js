(function(angular){
  /*
   * Grid module
   * Contains playing field state and logic
   */
  angular
    .module('game.board', ['game.config', 'game.plugins'])
    .service('BoardManager', BoardManager)
    .factory('BoardNullTile', BoardNullTile)
    .factory('BoardTile', BoardTile)
  ;


  BoardManager.$inject = ['GameConfig', 'BoardNullTile', 'PluginMount'];
  function BoardManager(config, NullTile, Mount) {
    var ctrl = this;

    ctrl.placeholders = {
      indoor: new NullTile({placeable: true, outdoor: false}),
      ourdoor: new NullTile({placeable: true, outdoor: true}),
    };

    ctrl.defaults = {
      tiles: {},
      events: 0,
    };

    ctrl.tiles = {};

    ctrl.initalize = function () {
      // ugly ugly ugly horrible initalization but everything assumes
      // the board doesn't have a state object but I want to keep defaults
      // externally configurable.
      // todo: build proper initalization or actually use a state object. fml.
      var defaults = angular.copy(ctrl.defaults);
      ctrl.tiles = defaults.tiles;
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

    ctrl.placeable = function (point, tile) {
      var coord = ctrl.coord(point)
          , enter_tile = ctrl.tiles[coord]
          , exit_coord
          , exit_tile
          , connects
          ;

      // the first tile is always placeable
      if (Object.keys(ctrl.tiles).length === 0)
        return true;

      // every tile that must be placed in an acceptable location
      // a tile must exist in the location
      if (!enter_tile)
        throw new Error('not a placeable cell');


      if (!enter_tile.placeable)
        throw new Error('tile already exist');

      // check to make sure the tile is reachable from the other tiles
      // TODO: replace with a configurable handler
      connects = Mount.get('game.board.placable.connects').run(ctrl, point, tile);

      if (!connects)
        throw new Error('tile does not connect to another tile');

      return true;
    };

    ctrl.assign_tile = function (point, tile) {
      var coord = ctrl.coord(point)
          , exit_coord
          , exit_tile
          ;

      ctrl.tiles[coord] = tile;
      tile.exits.forEach(function(exit){
        var vector = tile.vectors[exit]
            , exit_point = [
              point[0] + vector[0],
              point[1] + vector[1],
            ]
            ;
        exit_coord = ctrl.coord(exit_point);
        exit_tile = ctrl.tiles[exit_coord];
        // TODO: replace with some configurable handler
        if (!exit_tile)
          ctrl.tiles[exit_coord] = ctrl.placeholders.indoor;
      }, this);
    };

    ctrl.place_tile = function (point, tile) {
      try {
        ctrl.placeable(point, tile);
      } catch(e) {
        // HACK:FIXME: Ignores information about error that should be conveyed
        // to the end user.
        throw e;
      }

      ctrl.assign_tile(point, tile);
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

    ctrl.near = function(p1, p2, nearness) {
      nearness = (typeof nearness === 'undefined') ? 1 : nearness;

      // Calculate the distance along a and b in c2 = a2 + b2
      var dist = Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);

      // position is the same, position is within nearness, position > nearness
      return dist === 0 ? -1 : dist <= nearness ? 1 : 0;
    };

    ctrl.walkable = function(p1, p2) {
      var t1 = ctrl.tiles[ctrl.coord(p1)]
          , t2 = ctrl.tiles[ctrl.coord(p2)]
          , vec = [p2[0] - p1[0], p2[1] - p1[1]]
          , dir_coord = ctrl.coord(vec)
          ;
      // todo: add error throwing for better UI feedback
      if (!t1 || !t2 || ctrl.near(p1, p2) !== 1)
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
    // xxx: vectors either need to be defined on object or set as a read-only property
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
      this.text = config.text;
      this.callbacks = config.callbacks;

      // ensure rotations are always a value between 0 and 3
      var _rotation;
      Object.defineProperty(this, "rotation", {
        get: function () {
          return _rotation;
        },
        set: function (new_rotation) {
          _rotation = (
            new_rotation < 0 ?
              // convert CCW rotations to CW rotation
              new_rotation & 1 ?
                // odd rotations need to be mirrored
                Math.abs(new_rotation) + 2 :
                // even rotations always have the same result
                Math.abs(new_rotation) :
              new_rotation
          ) % 4;
        },
        enumerable: true,
      });
      this.rotation = config.rotation || 0;


      // pre-compute exits for each rotation
      var _exits = [];
      Object.defineProperty(this, "exits", {
        get: function () {
          return _exits[_rotation];
        },
        set: function (new_exits) {
          _exits = [0, 1, 2, 3].map(function (rotation) {
            var tmp = new_exits.map(function(exit) {
              return (exit + rotation) % 4;
            });
            tmp.sort();
            return tmp;
          });
        },
        enumerable: true,
      });
      this.exits = config.exits;

      this.vectors = vectors;
      this.vector_map = vector_map;
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
