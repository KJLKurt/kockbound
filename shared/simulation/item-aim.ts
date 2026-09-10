import type {Input,Player} from '../game-types/index.ts';
import {validAim} from '../game-types/input.ts';
export function itemDirection(player:Player,command?:Input){
  const direction=validAim(command?.aim)?command!.aim!:command;
  const length=direction?Math.hypot(direction.x,direction.z):0;
  return length>.01?{dx:direction!.x/length,dz:direction!.z/length}:{dx:player.facingX,dz:player.facingZ};
}
