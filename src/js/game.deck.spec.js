describe('Game', function() {
  describe('DeckManager', function() {
    beforeEach(module('game.deck'));

    var cards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        , deck
        ;
    beforeEach(inject(function(DeckManager) {
      deck = new DeckManager(cards.slice());
    }));

    it('should have a DeckManager', function() {
      expect(deck).toBeDefined();
    });


    describe('.shuffle', function() {
      afterEach(function(){
        deck.combine().sort();
      });

      it('should return the deck object', function() {
        var r = deck.shuffle();
        expect(r).toEqual(deck);
      });

      it('should randomize the order of the cards', function() {
        deck.shuffle();
        expect(deck.stock).not.toEqual(cards);
      });
    });


    describe('.sort', function() {
      beforeEach(function(){
        deck.shuffle();
      });

      it('should return the deck object', function() {
        var r = deck.sort();
        expect(r).toEqual(deck);
      });

      it('should sort the cards', function() {
        expect(deck.stock).not.toEqual(cards);
        deck.sort();
        expect(deck.stock).toEqual(cards);
      });
    });


    describe('.draw', function() {
      beforeEach(function() {
        deck.stock = cards.slice();
        // Use a hand for easier card management
        this.hand = [];
      });

      it('should return the drawn card', function() {
        var r = deck.draw();
        expect(r).not.toEqual(deck);
      });

      it('should draw from the back/top of the stock', function() {
        var expected_draw = deck.stock.slice(-1);

        this.hand = this.hand.concat(deck.draw());

        expect(this.hand).toEqual(expected_draw);
        expect(deck.stock.length).toEqual(9);
      });

      it('should draw from the front/bottom of the stock', function() {
        var expected_draw = deck.stock.slice(0,1);

        this.hand = this.hand.concat(deck.draw(1, true));

        expect(this.hand).toEqual(expected_draw);
        expect(deck.stock.length).toEqual(9);
      });

      it('should draw multiples from the back/top of the stock', function() {
        var to_draw = 3
            , expected_draw = deck.stock.slice(-to_draw);

        this.hand = this.hand.concat(deck.draw(to_draw));

        expect(this.hand).toEqual(expected_draw);
        expect(deck.stock.length).toEqual(10 - to_draw);
      });

      it('should draw multiples from the front/bottom of the stock', function() {
        var to_draw = 3
            , expected_draw = deck.stock.slice(0, to_draw);

        expected_draw.reverse();

        this.hand = this.hand.concat(deck.draw(to_draw, true));

        expect(this.hand).toEqual(expected_draw);
        expect(deck.stock.length).toEqual(10 - to_draw);
      });
    });

    describe('.deal', function() {
      beforeEach(function() {
        deck.stock = cards.slice();
        // Use a hand for easier card management
        this.hand = [];
      });

      it('should return the drawn card', function() {
        var r = deck.deal();
        expect(r).not.toEqual(deck);
      });

      it('should deal singles to one hand from the back/top of the stock', function() {
        var expected_deal = deck.stock.slice(-1);

        this.hand = this.hand.concat(deck.deal());

        expect(this.hand).toEqual(expected_deal);
        expect(deck.stock.length).toEqual(9);
      });

      it('should deal singles to one hand from the front/bottom of the stock', function() {
        var expected_deal = deck.stock.slice(0,1);

        this.hand = this.hand.concat(deck.deal(1, 1, true));

        expect(this.hand).toEqual(expected_deal);
        expect(deck.stock.length).toEqual(9);
      });

      it('should deal multiples to one hand from the back/top of the stock', function() {
        var to_deal = 3
            , expected_deal = deck.stock.slice(-to_deal);

        expected_deal.reverse();

        this.hand = this.hand.concat(deck.deal(to_deal));

        expect(this.hand).toEqual(expected_deal);
        expect(deck.stock.length).toEqual(10 - to_deal);
      });


      it('should deal multiples to one hand from the front/bottom of the stock', function() {
        var to_deal = 3
            , expected_deal = deck.stock.slice(0, to_deal);

        this.hand = this.hand.concat(deck.deal(to_deal, 1, true));

        expect(this.hand).toEqual(expected_deal);
        expect(deck.stock.length).toEqual(10 - to_deal);
      });

      it('should deal singles to multple hands from the back/top of the stock', function() {
        var to_deal = 1
            , to_hands = 3
            , expected_deal = [[9], [8], [7]]
            , hands
            ;

        hands = deck.deal(to_deal, to_hands);

        expect(hands).toEqual(expected_deal);
        expect(deck.stock.length).toEqual(7);
      });

      it('should deal singles to multple hands from the front/bottom of the stock', function() {
        var to_deal = 1
            , to_hands = 3
            , expected_deal = [[0], [1], [2]]
            , hands
            ;

        hands = deck.deal(to_deal, to_hands, true);

        expect(hands).toEqual(expected_deal);
        expect(deck.stock.length).toEqual(7);
      });

      it('should deal multiples to multple hands from the back/top of the stock', function() {
        var to_deal = 3
            , to_hands = 3
            , expected_deal = [
              [9, 6, 3],
              [8, 5, 2],
              [7, 4, 1],
            ]
            , hands
            ;

        // Hard coding stock because expected results are hard-coded
        deck.stock = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        hands = deck.deal(to_deal, to_hands);

        expect(hands).toEqual(expected_deal);
        expect(deck.stock.length).toEqual(0);
      });

      it('should deal multiples to multple hands from the front/bottom of the stock', function() {
        var to_deal = 3
            , to_hands = 3
            , expected_deal = [
              [1, 4, 7],
              [2, 5, 8],
              [3, 6, 9],
            ]
            , hands
            ;

        // Hard coding stock because expected results are hard-coded
        deck.stock = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        hands = deck.deal(to_deal, to_hands, true);

        expect(hands).toEqual(expected_deal);
        expect(deck.stock.length).toEqual(0);
      });
    });



    describe('.discard', function() {
      beforeEach(function(){
        deck.combine().sort();
        // Use a hand for easier card management
        this.hand = [];
      });

      it('should return the deck object', function() {
        var r = deck.burn();
        expect(r).toEqual(deck);
      });

      it('should add a single card to the back of the burn pile', function() {
        var expected_burn = deck.stock.slice(-1);

        this.hand = this.hand.concat(deck.draw());
        deck.discard(this.hand.shift());

        expect(deck.burn_pile).toEqual(expected_burn);
        expect(deck.burn_pile.length).toEqual(1);
        expect(deck.stock.length).toEqual(9);
      });

      it('should add a single card to the front of the burn pile', function() {
        var expected_burn = deck.stock.slice(-1);

        this.hand = this.hand.concat(deck.draw());
        deck.discard(this.hand.shift(), true);

        expect(deck.burn_pile).toEqual(expected_burn);
        expect(deck.burn_pile.length).toEqual(1);
        expect(deck.stock.length).toEqual(9);
      });

      it('should add multiple cards to the back of the burn pile', function() {
        var to_discard = 3
            , expected_burn = deck.stock.slice(-to_discard);

        this.hand = this.hand.concat(deck.draw(to_discard));
        deck.discard(this.hand.shift());
        deck.discard(this.hand.shift());
        deck.discard(this.hand.shift());

        expect(deck.burn_pile).toEqual(expected_burn);
        expect(deck.burn_pile.length).toEqual(to_discard);
        expect(deck.stock.length).toEqual(10 - to_discard);
      });

      it('should add multiple cards to the front of the burn pile', function() {
        var to_discard = 3
            , expected_burn = deck.stock.slice(-to_discard);

        expected_burn.reverse();

        this.hand = this.hand.concat(deck.draw(to_discard));
        deck.discard(this.hand.shift(), true);
        deck.discard(this.hand.shift(), true);
        deck.discard(this.hand.shift(), true);

        expect(deck.burn_pile).toEqual(expected_burn);
        expect(deck.burn_pile.length).toEqual(to_discard);
        expect(deck.stock.length).toEqual(10 - to_discard);
      });

      it('should add multiple cards at once to the back of the burn pile', function() {
        var to_discard = 3
            , expected_burn = deck.stock.slice(-to_discard);

        this.hand = this.hand.concat(deck.draw(to_discard));
        deck.discard(this.hand.splice(-to_discard));

        expect(deck.burn_pile).toEqual(expected_burn);
        expect(deck.burn_pile.length).toEqual(to_discard);
        expect(deck.stock.length).toEqual(10 - to_discard);
      });

      it('should add multiple cards at once to the front of the burn pile', function() {
        var to_discard = 3
            , expected_burn = deck.stock.slice(-to_discard);

        this.hand = this.hand.concat(deck.draw(to_discard));
        deck.discard(this.hand.splice(-to_discard), true);

        expect(deck.burn_pile).toEqual(expected_burn);
        expect(deck.burn_pile.length).toEqual(to_discard);
        expect(deck.stock.length).toEqual(10 - to_discard);
      });
    });


    describe('.burn', function() {
      afterEach(function(){
        deck.combine().sort();
      });

      it('should return the deck object', function() {
        var r = deck.burn();
        expect(r).toEqual(deck);
      });

      it('should move one card from the stock to the burn pile', function() {
        deck.burn();
        expect(deck.stock.length).toEqual(9);
        expect(deck.burn_pile.length).toEqual(1);
      });

      it('should move three cards from the stock to the burn pile', function() {
        var to_burn = 3
            , expected_burn = deck.stock.slice(-to_burn);

        deck.burn(to_burn);

        expect(deck.burn_pile).toEqual(expected_burn);
        expect(deck.burn_pile.length).toEqual(to_burn);
        expect(deck.stock.length).toEqual(10 - to_burn);
      });
    });


    describe('.combine', function() {
      afterEach(function(){
        deck.sort();
      });

      it('should return the deck object', function() {
        var r = deck.burn();
        expect(r).toEqual(deck);
      });

      it('should append the burn pile to the stock', function() {
        var burn_ref;
        deck.burn(3);
        burn_ref = deck.burn_pile.slice();
        deck.combine();
        expect(deck.stock.length).toEqual(10);
        expect(deck.stock.slice(-3)).toEqual(burn_ref);
      });

      it('should prepend the burn pile to the stock', function() {
        var burn_ref;
        deck.burn(3);
        burn_ref = deck.burn_pile.slice();
        deck.combine(true);
        expect(deck.stock.length).toEqual(10);
        expect(deck.stock.slice(0, 3)).toEqual(burn_ref);
      });
    });
  });
});
