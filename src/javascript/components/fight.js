import controls from '../../constants/controls';

export function getHitPower(fighter) {
    const criticalHitChance = Math.random() + 1;
    return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
    const dodgeChance = Math.random() + 1;
    return fighter.defense * dodgeChance;
}

export function getCriticalDamagePwr(fighter) {
    return 2 * fighter.attack;
}

export function getDamage(attacker, defender) {
    const blockPower = getBlockPower(defender);
    const hitPower = getHitPower(attacker);
    const damage = hitPower > blockPower ? hitPower - blockPower : 0;
    return damage;
}

class FighterStatus {
    static CRITICAL_HIT_COOLDOWN = 10000;

    constructor(fighter, attacking, blocking, keysCombination, lastCriticalHitTime, position) {
        this.fighter = fighter;
        this.health = parseFloat(fighter.health);
        this.attacking = attacking;
        this.attack = fighter.attack;
        this.defense = fighter.defense;
        this.blocking = blocking;
        this.keysCombination = {
            [keysCombination[0]]: false,
            [keysCombination[1]]: false,
            [keysCombination[2]]: false
        };
        this.lastCriticalHitTime = lastCriticalHitTime;
        this.position = position;
    }

    setAttacking(isAttacking) {
        this.attacking = isAttacking;
    }

    subtractHealth(damage) {
        this.health -= damage;
    }

    setBlocking(isBlocking) {
        this.blocking = isBlocking;
    }

    isCriticalHitReady() {
        const now = Date.now();
        const isReady = FighterStatus.CRITICAL_HIT_COOLDOWN < now - this.lastCriticalHitTime;
        const isCombo = Object.values(this.keysCombination).every(keyStatus => keyStatus);
        return isReady && isCombo;
    }

    updateLastCriticalTime() {
        this.lastCriticalHitTime = Date.now();
    }

    toggleKeyStatus(key) {
        this.keysCombination[key] = !this.keysCombination[key];
    }
}

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        const firstFighterStatus = new FighterStatus(
            firstFighter,
            false,
            false,
            controls.PlayerOneCriticalHitCombination,
            0,
            'left'
        );
        const secondFighterStatus = new FighterStatus(
            secondFighter,
            false,
            false,
            controls.PlayerTwoCriticalHitCombination,
            0,
            'right'
        );

        // code to pass linter check, delete later
        if (firstFighterStatus.health > secondFighterStatus.health) resolve(firstFighter);
        // code to pass linter check, delete later
    });
}
