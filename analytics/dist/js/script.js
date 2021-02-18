function testWebP(callback) {
    const webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height === 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {
    if (support) {
        document.querySelector('body').classList.add('webp')
    } else {
        document.querySelector('body').classList.add('no-webp');
    }
})
let currentCard = document.querySelector('.footer-screen__list-item.active')
const cards = document.querySelectorAll('.footer-screen__list-item')
cards.forEach(card => {
    card.addEventListener('click', function () {
        currentCard.classList.remove('active')
        currentCard = this
        currentCard.classList.add('active')
    })
})
console.log(currentCard)
