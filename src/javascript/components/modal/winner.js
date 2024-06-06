import { createFighterImage } from '../fighterPreview';
import showModal from './modal';

function reloadPage() {
    document.location.reload();
}

export default function showWinnerModal(fighter) {
    const fighterImg = createFighterImage(fighter);
    showModal({
        title: `${fighter.name}  wins!`,
        bodyElement: fighterImg,
        onClose: reloadPage
    });
}
