describe('Game', function() {
  describe('Board', function() {
    beforeEach(module('game.board'));

    describe('Tile', function() {

      var tile;
      beforeEach(inject(function(BoardTile) {
        tile = BoardTile;
      }));

      it('should have a BoardTile', function() {
        expect(tile).toBeDefined();
      });

    });

    describe('Manager', function() {
      var board
          , Tile
          , test_tiles
          ;

      beforeEach(inject(function(BoardManager, BoardTile) {
        board = BoardManager;
        Tile = BoardTile;
        test_tiles = {
            n:  new BoardTile({ exits: [0], }),
            ne: new BoardTile({ exits: [0, 1], }),
            e:  new BoardTile({ exits: [1], }),
            se: new BoardTile({ exits: [1, 2], }),
            s:  new BoardTile({ exits: [2], }),
            sw: new BoardTile({ exits: [2, 3], }),
            w:  new BoardTile({ exits: [3], }),
            ns: new BoardTile({ exits: [0, 2], }),
            ew: new BoardTile({ exits: [1, 3], }),
            "new": new BoardTile({ exits: [0, 2, 3], }),
            nesw: new BoardTile({ exits: [0, 1, 2, 3], }),
        };
      }));

      it('should have a BoardManager', function() {
        expect(board).toBeDefined();
        expect(Tile).toBeDefined();
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

      describe('.near', function (){
        it('should return true if two points are next to one another', function(){
          expect(board.near([0, 0], [0, 1])).toBe(true);
          expect(board.near([0, 0], [0, -1])).toBe(true);
          expect(board.near([-1, 0], [0, 1])).toBe(false);
          expect(board.near([-14, 7], [-13, 7])).toBe(true);
          expect(board.near([-14, 8], [13, 8])).toBe(false);
        });
      });

      describe('.walkable', function (){
        beforeEach(function (){
          board.tiles = {
            '0:0': test_tiles.n,
            '0:1': test_tiles.sw,
            '-1:1': test_tiles.se,
            '-1:0': test_tiles.ns,
          };
        });

        it('should return true if two tiles have exits facing each other', function(){
          expect(board.walkable([0,0], [0, 1])).toBe(true);
          expect(board.walkable([0,1], [-1, 1])).toBe(true);
          expect(board.walkable([0,0], [-1, 0])).toBe(false);
          expect(board.walkable([-1,1], [0, 0])).toBe(false);
          expect(board.walkable([-1,2], [0, 0])).toBe(false);
        });
      });

      describe('.place_tile', function (){
        beforeEach(function (){
          board.tiles = {};
        });

        it('should place the tile in the board and update surrounding tiles', function(){
          var tile = test_tiles.n;
          board.place_tile([0, 0], tile);

          expect(board.tiles['0:0']).toBe(tile);
          expect(board.tiles['0:1']).toBe(board.placeholders.indoor);
        });

        it('should place the rotated tile in the board and update surrounding tiles', function(){
          var tile = test_tiles.n;
          tile.rotation = 1;
          board.place_tile([0, 0], tile);

          expect(board.tiles['0:0']).toBe(tile);
          expect(board.tiles['1:0']).toBe(board.placeholders.indoor);
        });
      });
    });
  });
});
