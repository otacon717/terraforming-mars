import { IAward } from "./IAward";
import { Player } from "../Player";
import { Game } from "../Game";
import { Phase } from "../Phase";
import { Resources } from "../Resources";

export class Thermalist implements IAward {
    public name: string = "Thermalist";
    public description: string = "Having the most heat resource cubes"
    public getScore(player: Player, _game: Game): number {
	if (_game.phase === Phase.END){
		return player.heat;
	}else
	{
		return player.heat + player.energy + player.getProduction(Resources.HEAT);
	}
    }   
}