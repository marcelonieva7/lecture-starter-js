import createElement from '../helpers/domHelper';

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    if (fighter) {
        const fighterInfoContainer = createElement({
            tagName: 'div',
            className: 'fighter-preview___info-container'
        });

        const fighterImage = createFighterImage(fighter);

        const fighterInfoList = createElement({
            tagName: 'ul',
            className: 'fighter-preview___info'
        });

        const fighterName = createElement({
            tagName: 'li',
            className: 'fighter-preview___name'
        });
        fighterName.innerText = fighter.name;

        const fighterHealth = createElement({
            tagName: 'li',
            className: 'fighter-preview___health'
        });
        fighterHealth.innerText = 'Health';
        const healthBar = createElement({
            tagName: 'progress',
            className: 'fighter-preview___health-bar',
            attributes: { max: 100, value: fighter.health }
        });

        const fighterAttack = createElement({
            tagName: 'li',
            className: 'fighter-preview___attack'
        });
        fighterAttack.innerText = 'Attack';
        const attackBar = createElement({
            tagName: 'progress',
            className: 'fighter-preview___attack-bar',
            attributes: { max: 10, value: fighter.attack }
        });

        const fighterDefense = createElement({
            tagName: 'li',
            className: 'fighter-preview___defense'
        });
        fighterDefense.innerText = 'Defense';
        const defenseBar = createElement({
            tagName: 'progress',
            className: 'fighter-preview___defense-bar',
            attributes: { max: 10, value: fighter.defense }
        });

        fighterHealth.appendChild(healthBar);
        fighterAttack.appendChild(attackBar);
        fighterDefense.appendChild(defenseBar);

        fighterInfoList.append(fighterName, fighterHealth, fighterAttack, fighterDefense);

        fighterInfoContainer.append(fighterInfoList, fighterImage);

        fighterElement.append(fighterInfoContainer);
    }

    return fighterElement;
}
