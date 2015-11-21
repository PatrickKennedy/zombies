(function(angular){
  /*
   * Deck module
   * Contains individual deck state and logic
   *
   * The Deck pays attention to humanistic elements of interacting with a deck
   * of cards. For the purposes of this module the order of cards is defined
   * to be the same whether face up or face down.
   *
   * The front of the card is the direction of the front of the deck array.
   * i.e. .pop()'ing off a face-down deck will return the top card
   * and .pop()'ing off a face-up deck will return the bottom card
   *
   * Understanding this we can then better introspect the movement of cards
   * through different interactions with the deck.
   *
   * For example, dealing cards reverses the order the cards were orignally
   * in in the deck where as drawing one card at a time into a hand preserves
   * that order.
   *
   * Note: Any references to top/bottom in the module or tests assume the deck
   * is face down.
   */
  angular
    .module('game.deck', [])
    .factory('DeckManager', DeckManager)
  ;


  DeckManager.$inject = [];
  function DeckManager() {
    var Deck = function(stock) {
      this.stock = stock;
      this.burn_pile = [];
    };

    Deck.prototype.shuffle = function (){
      // mezclar2 - from http://jsperf.com/array-shuffle-comparator/14
      var arr = this.stock;
      for (
        var i, tmp, n = arr.length;
        n;
        i = Math.floor(Math.random() * n), tmp = arr[--n], arr[n] = arr[i], arr[i] = tmp
      );
      return this;
    };

    Deck.prototype.sort = function (fn){
        fn = fn || this.fn || function(a, b) { return a - b; };

      this.stock.sort(fn);
      return this;
    };

    Deck.prototype.combine = function (prepend){
      if (prepend === true)
        this.stock = this.burn_pile.concat(this.stock);
      else
        this.stock = this.stock.concat(this.burn_pile);

      this.burn_pile = [];

      return this;
    };

    Deck.prototype.draw = function (to_draw, from_front){
      var hand;

      to_draw = to_draw || 1;

      hand = this.stock.splice(from_front ? 0 : -to_draw, to_draw);

      if (from_front)
        hand.reverse();

      return hand;
    };

    Deck.prototype.deal = function (to_deal, to_hands, from_front){
      var hands = []
          , pile
          ;

      to_deal = to_deal || 1;
      to_hands = to_hands || 1;

      // XXX: Desperately needs error raising here
      // specifically if (to_deal % to_hands) != 0
      to_deal *= to_hands;

      pile = this.stock.splice(from_front ? 0 : -to_deal, to_deal);

      for (var x = 0, hand; x < to_deal; x++) {
        if (x < to_hands)
          hands.push([]);
        hand = x % to_hands;
        hands[hand].push(from_front ? pile.shift() : pile.pop());
      }

      return to_hands > 1 ? hands : hands[0];
    };

    Deck.prototype.discard = function (cards, prepend){
      if (cards.length === undefined) {
        cards = [cards];
      }

      if (prepend)
        this.burn_pile = cards.concat(this.burn_pile);
      else
        this.burn_pile = this.burn_pile.concat(cards);
      return this;
    };

    Deck.prototype.burn = function (to_burn, prepend){
      if (to_burn === undefined)
        to_burn = 1;
      if (prepend)
        this.burn_pile = this.stock.splice(-to_burn).concat(this.burn_pile);
      else
        this.burn_pile = this.burn_pile.concat(this.stock.splice(-to_burn));

      return this;
    };

    return Deck;
  }
}(angular));
