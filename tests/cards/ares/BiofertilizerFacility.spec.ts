import { expect } from "chai";

import { CardName } from "../../../src/CardName";
import { BiofertilizerFacility } from "../../../src/cards/ares/BiofertilizerFacility";
import { CardType } from "../../../src/cards/CardType";
import { IProjectCard } from "../../../src/cards/IProjectCard";
import { Tags } from "../../../src/cards/Tags";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { SelectResourceCard } from "../../../src/interrupts/SelectResourceCard";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";
import { ResourceType } from "../../../src/ResourceType";
import { SpaceBonus } from "../../../src/SpaceBonus";
import { TileType } from "../../../src/TileType";
import { ARES_OPTIONS_NO_HAZARDS } from "../../ares/AresTestHelper";

describe("BiofertilizerFacility", function () {
  let card : BiofertilizerFacility, player : Player, game : Game;

  const scienceTagCard: IProjectCard = {
    name: CardName.ACQUIRED_COMPANY,
    cardType: CardType.ACTIVE,
    cost: 0,
    tags: [Tags.SCIENCE],
    play: () => undefined
  };

  const microbeHost: IProjectCard = {
    name: CardName.ACQUIRED_SPACE_AGENCY,
    cardType: CardType.ACTIVE,
    cost: 0,
    tags: [],
    resourceType: ResourceType.MICROBE,
    resourceCount: 0,
    play: () => undefined
  }

  beforeEach(function() {
    card = new BiofertilizerFacility();
    player = new Player("test", Color.BLUE, false);
    game = new Game("foobar", [player, player], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it("Can't play without a science tag", function () {
    expect(card.canPlay(player, game)).to.eq(false);
  });

  it("Play", function () {
    // Set up the cards.
    // Adds the necessary Science tag.
    player.playCard(game, scienceTagCard);
    player.playCard(game, microbeHost);

    // Initial expectations that will change after playing the card.
    expect(player.getProduction(Resources.PLANTS)).is.eq(0);
    expect(microbeHost.resourceCount || 0).is.eq(0);
    expect(game.interrupts).is.empty;

    expect(card.canPlay(player, game)).to.eq(true);
    const action = card.play(player, game);
    expect(player.getProduction(Resources.PLANTS)).is.eq(1);

    const citySpace = game.board.getAvailableSpacesForCity(player)[0];
    action.cb(citySpace);

    expect(citySpace.player).to.eq(player);
    expect(citySpace.tile!.tileType).to.eq(TileType.BIOFERTILIZER_FACILITY);
    expect(citySpace.adjacency).to.deep.eq({bonus: [SpaceBonus.PLANT, SpaceBonus.MICROBE]});

    const selectResourceCard = game.interrupts.pop()! as SelectResourceCard;
    selectResourceCard.generatePlayerInput();

    expect(microbeHost.resourceCount).is.eq(2);
  });

});
