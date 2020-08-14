import { IAward } from "./IAward";
import { Player } from "../Player";
import { Game } from "../Game";
import { Phase } from "../Phase";
import { Resources } from "../Resources";

export class Industrialist implements IAward {
    public name: string = "Industrialist";
    public description: string = "Having most steel and energy resources"
    public getScore(player: Player, _game: Game): number {
        if (_game.phase === Phase.END){
		return player.steel + player.energy;	
	}else
	{
		return player.steel + player.getProduction(Resources.STEEL) + player.getProduction(Resources.ENERGY);
	}
    }   
}