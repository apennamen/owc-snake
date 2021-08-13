import { List } from 'immutable';

export class BonusGenerator {
  constructor({ maxBonusNb }) {
    this.MAX_BONUS_NB = maxBonusNb;
    this.bonuses = List([]);
  }

  generateBonuses(availableIndexes) {
    if (this.bonuses.size < this.MAX_BONUS_NB) {
      const bonusIndex = availableIndexes.get(
        Math.floor(Math.random() * availableIndexes.size)
      );
      this.bonuses = this.bonuses.push(bonusIndex);
    }

    return this.getBonuses();
  }

  removeBonus(bonusIndex) {
    const elToRemove = this.bonuses.indexOf(bonusIndex);

    this.bonuses = this.bonuses.splice(elToRemove, 1);

    return this.getBonuses();
  }

  getBonuses() {
    return this.bonuses;
  }
}
