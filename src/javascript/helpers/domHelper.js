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
