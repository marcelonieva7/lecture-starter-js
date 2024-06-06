import controls from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over

        // code to pass linter check, delete later
        if (firstFighter.health > secondFighter.health) resolve(firstFighter);
        // code to pass linter check, delete later
    });
}

export function getHitPower(fighter) {
    // return hit power

    // code to pass linter check, delete later
    return [controls.PlayerOneAttack, fighter.health];
    // code to pass linter, delete later
}

export function getBlockPower(fighter) {
    // return block power

    // code to pass linter check, delete later
    return [controls.PlayerOneAttack, fighter.health];
    // code to pass linter, delete later
}

export function getDamage(attacker, defender) {
    const blockPower = getBlockPower(defender);
    const hitPower = getHitPower(attacker);
    const damage = hitPower > blockPower ? hitPower - blockPower : 0;
    return damage;
}
