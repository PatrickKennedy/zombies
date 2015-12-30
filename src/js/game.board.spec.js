describe('Game', function() {
  describe('Board', function() {
    var board
        , Tile
        , example_tiles
        , test_tiles
        ;

    beforeEach(module('game.board'));

    beforeEach(inject(function(BoardManager, BoardTile) {
      board = BoardManager;
      Tile = BoardTile;
      example_tiles = {
          n:  new Tile({ exits: [0], }),
          ne: new Tile({ exits: [0, 1], }),
          e:  new Tile({ exits: [1], }),
          se: new Tile({ exits: [1, 2], }),
          s:  new Tile({ exits: [2], }),
          sw: new Tile({ exits: [2, 3], }),
          w:  new Tile({ exits: [3], }),
          nw: new Tile({ exits: [0, 3], }),
          ns: new Tile({ exits: [0, 2], }),
          ew: new Tile({ exits: [1, 3], }),
          new_: new Tile({ exits: [0, 1, 3], }),
          nesw: new Tile({ exits: [0, 1, 2, 3], }),
        };
      this.generate_tiles = function() {
        var dirs = [
          'n', 'ne', 'e', 'se', 's', 'sw',
          'w', 'nw', 'ns', 'ew', 'new_', 'nesw'
        ];
        var exits = [
          [0], [0, 1], [1], [1, 2], [2], [2, 3],
          [3], [0, 3], [0, 2], [1, 3], [0, 1, 3], [0, 1, 2, 3],
        ];
        var test_tiles = {};
        dirs.forEach(function(dir, index){
          test_tiles[dir] = new Tile({ id: dir, exits: exits[index] });
        });

        return test_tiles;
      };
    }));

    it('should have a BoardManager', function() {
      expect(board).toBeDefined();
    });
    it('should have a BoardTile', function() {
      expect(Tile).toBeDefined();
    });

    describe('Tile', function() {
      beforeEach(function (){
        test_tiles = this.generate_tiles();
      });

      describe('.exits', function() {
        it('should return exits rotated by tile.rotations', function(){
          expect(new Tile({ exits: [0], rotation: 1 }).exits).toEqual([1]);
          expect(new Tile({ exits: [0, 1], rotation: 2 }).exits).toEqual([2, 3]);
          expect(new Tile({ exits: [0, 2], rotation: 3 }).exits).toEqual([1, 3]);
          expect(new Tile({ exits: [0, 3], rotation: 4 }).exits).toEqual([0, 3]);
        });

        it('should update exits when tile.rotations is assigned post-creation', function(){
          test_tiles.s.rotation = -2;
          expect(test_tiles.s.exits).toEqual([0]);

          test_tiles.nw.rotation = 3;
          expect(test_tiles.nw.exits).toEqual([2, 3]);

          test_tiles.ne.rotation = -1;
          expect(test_tiles.ne.exits).toEqual([0, 3]);

          test_tiles.ew.rotation = 1;
          expect(test_tiles.ew.exits).toEqual([0, 2]);
        });

        it('should allow nevative rotations', function(){
          expect(new Tile({ exits: [0], rotation: -1 }).exits).toEqual([3]);
          expect(new Tile({ exits: [0, 1], rotation: -2 }).exits).toEqual([2, 3]);
          expect(new Tile({ exits: [0, 2], rotation: -3 }).exits).toEqual([1, 3]);
          expect(new Tile({ exits: [0, 3], rotation: -4 }).exits).toEqual([0, 3]);
        });
      });

    });

    describe('Manager', function() {
      beforeEach(function (){
        test_tiles = this.generate_tiles();
      });

      describe('.coord', function (){
        it('should convert a point to a string coordinate', function(){
          expect(board.coord([0, 0])).toEqual('0:0');
          expect(board.coord([14, -5])).toEqual('14:-5');
        });
      });

      describe('.point', function (){
        it('should convert a string coordinate to a point', function(){
          expect(board.point('0:0')).toEqual([0, 0]);
          expect(board.point('14:-5')).toEqual([14, -5]);
        });
      });

      describe('.placeable', function (){
        beforeEach(function (){
          board.initalize();
          test_tiles = this.generate_tiles();
        });

        it('should return true if no tiles are on the board', function(){
          expect(board.placeable([0,0], test_tiles.n)).toBe(true);
        });

        it('should return false if not placing on top of a placable NullTile', function(){
          board.place_tile([0,0], test_tiles.n);
          expect(function(){ board.placeable([0,-2], test_tiles.s); }).toThrow();
        });

        it('should return false if tiles dont have matching exits', function(){
          board.place_tile([0,0], test_tiles.n);
          expect(function(){ board.placeable([0,-1], test_tiles.n); }).toThrow();
        });

        it('should return true if placing on top of a placeable NullTile with matching exits', function(){
          board.place_tile([0,0], test_tiles.n);
          expect(board.placeable([0,-1], test_tiles.s)).toBe(true);
        });

        it('should return false if tiles dont have matching exits after rotation', function(){
          board.place_tile([0,0], test_tiles.n);
          test_tiles.s.rotation = 1;
          expect(function(){ board.placeable([0,-1], test_tiles.s); }).toThrow();
        });

        it('should return true if placing a rotated tile with matching exits', function(){
          board.place_tile([0,0], test_tiles.n);
          test_tiles.w.rotation = -1;
          expect(board.placeable([0,-1], test_tiles.w)).toBe(true);
        });

        it('should return true if placing on top of a placeable NullTile with matching exits', function(){
          test_tiles.new_.rotation = -1;
          expect(board.placeable([0,0], test_tiles.new_)).toBe(true);
          board.place_tile([0,0], test_tiles.new_);

          test_tiles.nw.rotation = 3;
          expect(board.placeable([0,-1], test_tiles.nw)).toBe(true);
          board.place_tile([0,-1], test_tiles.nw);

          test_tiles.sw.rotation = -1;
          expect(board.placeable([-1,-1], test_tiles.sw)).toBe(true);
          board.place_tile([-1,-1], test_tiles.sw);

          test_tiles.ew.rotation = 1;
          expect(board.placeable([-1,0], test_tiles.ew)).toBe(true);
          board.place_tile([-1,0], test_tiles.ew);
        });
      });

      describe('.place_tile', function (){
        beforeEach(function (){
          board.initalize();
          test_tiles = this.generate_tiles();
        });

        it('should place the tile in the board and update surrounding tiles', function(){
          board.place_tile([0, 0], test_tiles.n);

          expect(board.tiles['0:0']).toBe(test_tiles.n);
          expect(board.tiles['0:-1']).toBe(board.placeholders.indoor);
        });

        it('should place the tile in the board if there is a connection', function(){
          board.place_tile([0, 0], test_tiles.n);
          board.place_tile([0, -1], test_tiles.s);

          expect(board.tiles['0:0']).toBe(test_tiles.n);
          expect(board.tiles['0:-1']).toBe(test_tiles.s);
        });

        it('should not place the tile in the board if there is no connection', function(){
          board.place_tile([0, 0], test_tiles.n);

          expect(function(){ board.place_tile([0, 1], test_tiles.s); }).toThrowError("not a placeable cell");
          expect(board.tiles['0:1']).not.toBe(test_tiles.s);
        });

        it('should place the rotated tile in the board and update surrounding tiles', function(){
          test_tiles.n.rotation = 1;
          board.place_tile([0, 0], test_tiles.n);

          expect(board.tiles['0:0']).toBe(test_tiles.n);
          expect(board.tiles['1:0']).toBe(board.placeholders.indoor);
        });

        it('should not overwrite existing tiles with placeholders', function(){
          board.place_tile([0, 0], test_tiles.n);
          expect(board.tiles['0:0']).toBe(test_tiles.n);
          expect(board.tiles['0:-1']).toBe(board.placeholders.indoor);

          board.place_tile([0, -1], test_tiles.s);
          expect(board.tiles['0:-1']).toBe(test_tiles.s);
          expect(board.tiles['0:0']).toBe(test_tiles.n);
        });

      });

      describe('.near', function (){
        it('should return 1 if two points are next to one another', function(){
          expect(board.near([0, 0], [0, 1])).toBe(1);
          expect(board.near([0, 0], [0, -1])).toBe(1);
          expect(board.near([-1, 0], [0, 1])).toBe(0);
          expect(board.near([-14, 7], [-13, 7])).toBe(1);
          expect(board.near([-14, 8], [13, 8])).toBe(0);
        });

        it('should return 1 if two points are within 2 units of one another', function(){
          expect(board.near([0, 0], [0, 1], 2)).toBe(1);
          expect(board.near([0, 0], [0, 2], 2)).toBe(1);
          expect(board.near([-1, 0], [0, 1], 2)).toBe(1);
          expect(board.near([-14, 7], [-13, 7], 2)).toBe(1);
          expect(board.near([-14, 8], [13, 8], 2)).toBe(0);
        });

        it('should return -1 if two points are on the same point', function(){
          expect(board.near([0, 0], [0, 0])).toBe(-1);
          expect(board.near([1, -1], [1, -1])).toBe(-1);
          expect(board.near([-14, 7], [-14, 7])).toBe(-1);
        });
      });

      describe('.walkable', function (){
        beforeEach(function (){
          board.place_tile([0,0], test_tiles.nw);
          board.place_tile([0,-1], test_tiles.sw);
          board.place_tile([-1,-1], test_tiles.se);
          board.place_tile([-1,0], test_tiles.ns);
        });

        it('should return true if two tiles have exits facing each other', function(){
          expect(board.walkable([0,0], [0, -1])).toBe(true);
          expect(board.walkable([0,-1], [-1, -1])).toBe(true);
          expect(board.walkable([0,0], [-1, 0])).toBe(false);
          expect(board.walkable([-1,-1], [0, 0])).toBe(false);
          expect(board.walkable([-1,-2], [0, 0])).toBe(false);
        });
      });

      describe('.walkable /w rotation', function (){
        beforeEach(function (){
          test_tiles = this.generate_tiles();

          test_tiles.new_.rotation = -1;
          board.place_tile([0,0], test_tiles.new_);

          test_tiles.nw.rotation = 3;
          board.place_tile([0,-1], test_tiles.nw);

          test_tiles.sw.rotation = -1;
          board.place_tile([-1,-1], test_tiles.sw);

          test_tiles.ew.rotation = 1;
          board.place_tile([-1,0], test_tiles.ew);
        });

        it('should return true if two tiles have exits facing each other', function(){
          expect(board.walkable([0,0], [0, -1])).toBe(true);
          expect(board.walkable([0,-1], [-1, -1])).toBe(true);
          expect(board.walkable([0,0], [-1, 0])).toBe(false);
          expect(board.walkable([-1,-1], [0, 0])).toBe(false);
          expect(board.walkable([-1,-2], [0, 0])).toBe(false);
        });
      });

    });
  });
});
