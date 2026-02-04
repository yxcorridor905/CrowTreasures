import React from 'react';
import { Coins, Gem, Sword, Scroll, Feather, Key, FlaskConical, Triangle } from 'lucide-react';
import { TreasureType } from '../types';

interface TreasureIconProps {
  type: TreasureType;
  className?: string;
  color?: string;
}

export const TreasureIcon: React.FC<TreasureIconProps> = ({ type, className, color }) => {
  const style = { color: color || 'currentColor' };

  switch (type) {
    case TreasureType.COIN:
      return <Coins className={className} style={style} />;
    case TreasureType.GEM:
      return <Gem className={className} style={style} />;
    case TreasureType.SWORD:
      return <Sword className={className} style={style} />;
    case TreasureType.SCROLL:
      return <Scroll className={className} style={style} />;
    case TreasureType.FEATHER:
      return <Feather className={className} style={style} />;
    case TreasureType.KEY:
      return <Key className={className} style={style} />;
    case TreasureType.POTION:
      return <FlaskConical className={className} style={style} />;
    case TreasureType.ARTIFACT:
    default:
      return <Triangle className={className} style={style} />;
  }
};
