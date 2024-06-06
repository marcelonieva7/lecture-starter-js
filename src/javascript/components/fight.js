import controls from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over

        // code to pass linter check, delete later
        console.error(controls);
        if (firstFighter.health > secondFighter.health) resolve(firstFighter);
        // code to pass linter check, delete later
    });
}

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
