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