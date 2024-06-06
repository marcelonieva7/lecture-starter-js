export default function createElement({ tagName, className, attributes = {} }) {
    const element = document.createElement(tagName);

    if (className) {
        const classNames = className.split(' ').filter(Boolean); // Include only not empty className values after the splitting
        element.classList.add(...classNames);
    }

    Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]));

    return element;
}

export function getFighterImg(position) {
    const imgFighter = document.querySelector(`.arena___${position}-fighter .fighter-preview___img`);

    if (imgFighter) return imgFighter;
    throw new Error('Img not found');
}

export function getHealthBar(position) {
    const healthBar = document.getElementById(`${position}-fighter-indicator`);
    if (healthBar) return healthBar;
    throw new Error('Health Bar not found');
}

export function animateCriticalBar(position) {
    const progressBar = document.getElementById(`${position}-fighter-critical-indicator`);
    if (progressBar.classList.contains('blink')) {
        progressBar.classList.remove('blink');
    }
    let width = 0;
    const interval = setInterval(() => {
        width += 1;
        progressBar.style.width = `${width}%`;
        if (width >= 100) {
            clearInterval(interval);
            progressBar.classList.add('blink');
        }
    }, 100);
}
