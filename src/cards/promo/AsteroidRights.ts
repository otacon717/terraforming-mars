import { IProjectCard } from '../IProjectCard';
import { IActionCard, ICard, IResourceCard } from '../ICard';
import { CardName } from '../../CardName';
import { CardType } from '../CardType';
import { ResourceType } from '../../ResourceType';
import { Tags } from '../Tags';
import { Player } from '../../Player';
import { Resources } from '../../Resources';
import { Game } from '../../Game';
import { LogHelper } from '../../components/LogHelper';
import { SelectCard } from '../../inputs/SelectCard';
import { OrOptions } from '../../inputs/OrOptions';
import { SelectOption } from '../../inputs/SelectOption';

export class AsteroidRights implements IActionCard, IProjectCard, IResourceCard {
    public name: CardName = CardName.ASTEROID_RIGHTS;
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.EARTH, Tags.SPACE];
    public resourceType: ResourceType = ResourceType.ASTEROID;
    public resourceCount: number = 0;
    public cardType: CardType = CardType.ACTIVE;

    public play() {
        this.resourceCount = 2;
        return undefined;
    }

    public canAct(player: Player): boolean {
        return player.canAfford(1) || this.resourceCount > 0;
    }

    public action(player: Player, game: Game) {
        const canAddAsteroid = player.canAfford(1);
        const hasAsteroids = this.resourceCount > 0;
        const asteroidCards = player.getResourceCards(ResourceType.ASTEROID);

        const spendAsteroidOption = new SelectOption("Remove 1 asteroid on this card to increase MC production 1 step OR gain 2 titanium", "Remove asteroid", () => {
            this.resourceCount--;

            return new OrOptions(
                new SelectOption(
                    "Increase MC production 1 step",
                    "Select",
                    () => {
                        player.addProduction(Resources.MEGACREDITS);
                        LogHelper.logRemoveResource(game, player, this, 1, "increase MC production 1 step");
                        return undefined;
                    }
                ),
                new SelectOption(
                    "Gain 2 titanium",
                    "Select",
                    () => {
                        player.titanium += 2;
                        LogHelper.logRemoveResource(game, player, this, 1, "gain 2 titanium");
                        return undefined;
                    }
                ),
            );
        });

        const addAsteroidToSelf = new SelectOption("Add 1 asteroid to this card", "Add asteroid", () => {
            game.addSelectHowToPayInterrupt(player, 1, false, false, "Select how to pay for asteroid");
            player.addResourceTo(this);
            LogHelper.logAddResource(game, player, this);

            return undefined;
        });

        const addAsteroidOption = new SelectCard(
            "Select card to add 1 asteroid",
            "Add asteroid",
            asteroidCards,
            (foundCards: Array<ICard>) => {
                game.addSelectHowToPayInterrupt(player, 1, false, false, "Select how to pay for asteroid");
                player.addResourceTo(foundCards[0], 1);
                LogHelper.logAddResource(game, player, foundCards[0]);

                return undefined;
            }
        );

        // Spend asteroid
        if (!canAddAsteroid) return spendAsteroidOption.cb();

        // Add asteroid to any card
        if (!hasAsteroids) {
            if (asteroidCards.length === 1) return addAsteroidToSelf.cb();
            return addAsteroidOption;
        }

        const opts: Array<SelectOption | SelectCard<ICard>> = [];
        opts.push(spendAsteroidOption);
        asteroidCards.length === 1 ? opts.push(addAsteroidToSelf) : opts.push(addAsteroidOption);

        return new OrOptions(...opts);
    }
}