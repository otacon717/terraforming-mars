import { IAward } from "./IAward";
import { Player } from "../Player";
import { Game } from "../Game";
import { Phase } from "../Phase";
import { Resources } from "../Resources";

export class Miner implements IAward {
    public name: string = "Miner";
    public description: string = "Having the most steel and titanium resource cubes"
    public getScore(player: Player, _game: Game): number {
	if (_game.phase === Phase.END){
		return player.steel + player.titanium;
	}else
	{
		return player.steel + player.titanium + player.getProduction(Resources.STEEL) + player.getProduction(Resources.TITANIUM);
	}
		
    }   
}