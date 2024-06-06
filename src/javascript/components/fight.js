import controls from '../../constants/controls';
import { getHealthBar, getFighterImg, animateCriticalBar } from '../helpers/domHelper';

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

        function updateFightStatus(attackerStatus, defenderStatus, isCritical) {
            const damage = isCritical
                ? getCriticalDamagePwr(attackerStatus.fighter)
                : getDamage(attackerStatus.fighter, defenderStatus.fighter);

            defenderStatus.subtractHealth(damage);
            const healthBar = getHealthBar(defenderStatus.position);
            const newWidth = (defenderStatus.health / defenderStatus.fighter.health) * 100;
            if (newWidth <= 10) healthBar.style.backgroundColor = 'red';
            healthBar.style.width = `${newWidth}%`;

            if (defenderStatus.health <= 0) {
                healthBar.style.width = '0';
                getFighterImg(defenderStatus.position).style = 'filter: grayscale(1)';
                resolve(attackerStatus.fighter);
            }
        }

        function attack(attackerStatus, defenderStatus) {
            const isAttBlocking = attackerStatus.blocking;
            const isDefBlocking = defenderStatus.blocking;
            const imgFighter = getFighterImg(attackerStatus.position);
            if (!isAttBlocking) {
                attackerStatus.setAttacking(true);
                imgFighter.classList.add('fighter-preview___attack');

                if (!isDefBlocking) {
                    updateFightStatus(attackerStatus, defenderStatus);
                }

                attackerStatus.setAttacking(false);
            }

            setTimeout(() => {
                imgFighter.classList.remove('fighter-preview___attack');
            }, 300);
        }

        function block(fighterStatus) {
            fighterStatus.setBlocking(true);
            const imgFighter = getFighterImg(fighterStatus.position);
            imgFighter.classList.add('fighter-preview___defense');
        }

        function criticalAttack(key, attackerStatus, defenderStatus) {
            const { position } = attackerStatus;
            attackerStatus.toggleKeyStatus(key);
            if (attackerStatus.isCriticalHitReady() && !attackerStatus.blocking) {
                attackerStatus.updateLastCriticalTime();
                const attackerImg = getFighterImg(attackerStatus.position);
                const hadouken = document.getElementById(`${position}-fighter-hadouken`);
                attackerImg.classList.add('fighter-preview___critical-attack');
                hadouken.classList.add(`${position}-fighter-hadouken`);
                animateCriticalBar(position);
                updateFightStatus(attackerStatus, defenderStatus, true);

                setTimeout(() => {
                    attackerImg.classList.remove('fighter-preview___critical-attack');
                    hadouken.classList.remove(`${position}-fighter-hadouken`);
                }, 900);
            }
        }

        const {
            PlayerOneAttack,
            PlayerOneBlock,
            PlayerTwoAttack,
            PlayerTwoBlock,
            PlayerOneCriticalHitCombination,
            PlayerTwoCriticalHitCombination
        } = controls;
        const [P1CriticalKey1, P1CriticalKey2, P1CriticalKey3] = PlayerOneCriticalHitCombination;
        const [P2CriticalKey1, P2CriticalKey2, P2CriticalKey3] = PlayerTwoCriticalHitCombination;

        const keyDownActions = {
            [PlayerOneAttack]: () => attack(firstFighterStatus, secondFighterStatus),
            [PlayerOneBlock]: () => block(firstFighterStatus),

            [PlayerTwoAttack]: () => attack(secondFighterStatus, firstFighterStatus),
            [PlayerTwoBlock]: () => block(secondFighterStatus),

            [P1CriticalKey1]: () => criticalAttack(P1CriticalKey1, firstFighterStatus, secondFighterStatus),
            [P1CriticalKey2]: () => criticalAttack(P1CriticalKey2, firstFighterStatus, secondFighterStatus),
            [P1CriticalKey3]: () => criticalAttack(P1CriticalKey3, firstFighterStatus, secondFighterStatus),

            [P2CriticalKey1]: () => criticalAttack(P2CriticalKey1, secondFighterStatus, firstFighterStatus),
            [P2CriticalKey2]: () => criticalAttack(P2CriticalKey2, secondFighterStatus, firstFighterStatus),
            [P2CriticalKey3]: () => criticalAttack(P2CriticalKey3, secondFighterStatus, firstFighterStatus)
        };

        document.addEventListener('keydown', event => {
            if (keyDownActions[event.code] && !event.repeat) keyDownActions[event.code]();
        });
    });
}
