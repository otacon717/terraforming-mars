import { expect } from "chai";
import { Splice } from "../../../src/cards/promo/Splice";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { AndOptions } from "../../../src/inputs/AndOptions";
import { Tardigrades } from "../../../src/cards/Tardigrades";
import { PharmacyUnion } from "../../../src/cards/promo/PharmacyUnion";
import { Recyclon } from "../../../src/cards/promo/Recyclon";

describe("Splice", function () {
    let card : Splice, player : Player, player2 : Player, game : Game;

    beforeEach(function() {
        card = new Splice();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
    });

    it("Should play", function () {
        const card2 = new Tardigrades();
        const play = card.play();
        expect(play).to.eq(undefined);

        player.corporationCard = card;

        player2.playedCards.push(card2);
        const action = card.onCardPlayed(player2, game, card2);
        expect(action instanceof OrOptions).to.eq(true);
        if ( ! (action instanceof OrOptions)) return;

        expect(action.options.length).to.eq(2);
        const orOptions = action.options[0] as OrOptions;

        orOptions.cb();
        expect(player2.getResourcesOnCard(card2)).to.eq(1);
        expect(player.megaCredits).to.eq(2);
    });

    it("Should play with multiple microbe tags", function () {
        const card2 = new PharmacyUnion();
        const play = card.play();
        player.corporationCard = card;
        const play2 = card2.play(player, game);
        player2.corporationCard = card2;
        expect(play).to.eq(undefined);
        expect(play2).to.eq(undefined);

        const action = card.onCardPlayed(player2, game, card2);
        expect(action).to.eq(undefined);
        expect(player.megaCredits).to.eq(4);
        expect(player2.megaCredits).to.eq(4);
    });

    it("Should grant Recyclon a Microbe or 2MC", function() {
        const card2 = new Recyclon();
        // Player 1 picks Splice
        const pi = player.getWaitingFor() as AndOptions;
        pi.options[0].cb([card]);
        pi.options[1].cb([]);
        pi.cb();
        // Player 2 picks Recyclon
        const pi2 = player2.getWaitingFor() as AndOptions;
        pi2.options[0].cb([card2]);
        pi2.options[1].cb([]);
        pi2.cb();

        // Default resource on Recyclon and player2's MC
        expect(card2.resourceCount).to.eq(1);
        expect(player2.megaCredits).to.eq(38);

        // Player 2 should have the option to pick a microbe or 2 MC
        const pi3 = player2.getWaitingFor() as OrOptions;
        expect(pi3.options.length).to.eq(2);
        expect(pi3.options[0].title).to.eq("Add a microbe resource to this card");
        expect(pi3.options[1].title).to.eq("Gain 2 MC");

        // Pick the microbe
        pi3.options[0].cb();
        expect(card2.resourceCount).to.eq(2);

        // Pick 2 MC
        pi3.options[1].cb();
        expect(player2.megaCredits).to.eq(40);
    });
});
