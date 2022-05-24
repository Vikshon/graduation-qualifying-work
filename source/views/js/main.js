const basket = document.querySelector('.links-header__basket');
const basketModalOrder = document.querySelector('.modal-basket__order');
let menu;

window.addEventListener('load', async () => {
    menu = await FetchTable('dishes');
    CheckRole();
    GenerateMenu();
})

function CheckRole() {
    acc = localStorage.getItem('acc');
    if (!acc)
        return;
}

function GroupMenu() {
    let newMenu = [];
    menu.forEach(el => {
        el.Price = [+el.Price];
        el.Size = [+el.Size];
        el.Weight = [+el.Weight];
        el.id = [+el.id];

        let isExists = newMenu.find(e => e.Name === el.Name);
        if (isExists) {
            isExists.Price.push(el.Price[0]);
            isExists.Size.push(el.Size[0]);
            isExists.Weight.push(el.Weight[0]);
            isExists.id.push(el.id[0]);
            return;
        }
        newMenu.push(el);
    });
    menu = newMenu;
}

function GenerateMenu() {
    GroupMenu();
    menu.forEach(el => {
        let newSlot = document.createElement('div');
        newSlot.classList.add('menu__slot', 'slot');
        newSlot.innerHTML = slotPattern(el);
        let slotAvailableSizes = newSlot.querySelector('.slot__availableSizes');
        slotAvailableSizes.addEventListener('change', ChangePizzaSize);
        let subDishesCount = el.id;
        for (let i in subDishesCount) {
            slotAvailableSizes.innerHTML += `
                <label class="--unselectable" dish_id=${el.id[i]} dish_w=${el.Weight[i]} dish_p=${el.Price[i]}>
                    <input type="radio" name="size-${el.id[0]}">
                    <span class="checkmark"></span>
                    <span class="size">${el.Size[i]}cm</span>
                </label>
            `;
        }
        newSlot.querySelector('input').setAttribute('checked', true);
        newSlot.querySelector('.slot__basketAdd').addEventListener('click', AddToBasket);
        const menuContainer = document.querySelector('.menu__container');
        menuContainer.appendChild(newSlot);
    });
}

function slotPattern(el) {
    return `
            <div class="preview">
                <img src="./images/menu-previews/pizza-'${el.Name}'.webp" alt="pizza-'${el.Name}">
            </div>
            <div class="slot__info">
                <div class="slot__name">${el.Name}</div>
                <div class="slot__description">${el.Description}</div>
                <div class="slot__controls">
                    <div class="slot__size">
                        <div class="slot__availableSizes">
                        </div>
                        <div class="slot__weight">${el.Weight[0]}g</div>
                    </div>
                    <div class="slot__total">
                        <div class="slot__cost">${el.Price[0]} ₽</div>
                        <button class="slot__basketAdd">В корзину</button>
                    </div>
                </div>
            </div>
        `;
}

const CalculateCost = (currentValue, slotPrice) => slotPrice * +currentValue;

function AddToBasket() {
    // ! TODO -->
    /* if (!menu)
        console.log('menu error'); */    
    let slot = event.target.closest('.slot__info');
    let slotName = slot.querySelector('.slot__name').innerText;
    let slotChecked = slot.querySelector('input:checked').parentElement.querySelector('.size').innerText.slice(0, 2);
    let slotPrice = slot.querySelector('.slot__cost').innerText;
    slotPrice = +slotPrice.slice(0, slotPrice.lastIndexOf(' '));

    let choosen = menu.find(el => el.Name === slotName);
    let indexOfSize = choosen.Size.indexOf(+slotChecked);
    let price = choosen.Price[indexOfSize];

    // Copyies check
    let rows = Array.from(document.querySelector('.modal-basket__order').children);
    console.log(rows)
    let isDuplicate = rows.find(el => el.getAttribute('slot_n') === slotName && el.getAttribute('slot_s') === slotChecked);
    if (isDuplicate) {
        isDuplicate.querySelector('input').value = +isDuplicate.querySelector('input').value + 1;
        let priceBlock = isDuplicate.closest('.order-row').querySelector('.order-row__cost');
        priceBlock.innerText = +priceBlock.innerText.slice(0, priceBlock.innerText.lastIndexOf(' ')) + slotPrice + ' ₽';
        CalculateTotalSum();
        return;
    }
    // 

    const newRow = document.createElement('div');
    newRow.classList.add(`order-row`);
    newRow.setAttribute('slot_n', slotName);
    newRow.setAttribute('slot_s', slotChecked);
    newRow.setAttribute('slot_p', slotPrice);
    newRow.innerHTML +=
        `<div class="order-row__pizza-info">
            <h4 class="pizza-info__title">${slotName}</h4>
            <div class="pizza-info__sizes">${slotChecked}cm</div>
        </div>
        <div class="order-row__amount">
            <span class="order-row__amount-controls less"><img src="./images/icons/arrow-left_icon.svg" alt="less"></span>
            <input class="order-row__amount-counter" type="number" min="0" max="99" value="1">
            <span class="order-row__amount-controls more"><img src="./images/icons/arrow-right_icon.svg" alt="more"></span>
        </div>
        <div class="order-row__cost">${price} ₽</div>`;
    // newRow.addEventListener('input', SlotAmountChange);
    newRow.querySelector('span.order-row__amount-controls.less').addEventListener('click', () => basketAmountDecrement(event.target));
    newRow.querySelector('span.order-row__amount-controls.more').addEventListener('click', () => basketAmountIncrement(event.target));
    basketModalOrder.appendChild(newRow);

    // Icon changing
    basket.querySelector('img').src = './images/icons/basket_icon-filled.svg';
    //
    CalculateTotalSum();
}

// ! TODO: If i'm not on the main page i still can use header basket, but increment and decrement wouldn't work
function basketAmountDecrement(e) {
    let input = e.closest('.order-row__amount-controls.less').parentElement.querySelector('input');
    let cost = e.closest('.order-row').querySelector('.order-row__cost');
    let currentValue = +input.value;
    let slotPrice = e.closest('.order-row').getAttribute('slot_p');
    if (currentValue === 1) {
        e.closest('.order-row').remove();
        CalculateTotalSum();
        // Icon changing
        let rows = document.querySelector('.modal-basket__order').children.length;
        if (rows === 0)
            basket.querySelector('img').src = './images/icons/basket_icon.svg';
        //
        return;
    }
    input.value = --currentValue;
    let newCost = CalculateCost(currentValue, slotPrice);
    cost.innerText = newCost + "₽";
    CalculateTotalSum();
}

function basketAmountIncrement(e) {
    let input = e.closest('.order-row__amount-controls.more').parentElement.querySelector('input');
    let cost = e.closest('.order-row').querySelector('.order-row__cost');
    let currentValue = +input.value;
    let slotPrice = e.closest('.order-row').getAttribute('slot_p');
    if (currentValue === 99)
        return;
    input.value = ++currentValue;
    let newCost = CalculateCost(currentValue, slotPrice);
    cost.innerText = +newCost + "₽";
    CalculateTotalSum();
}

function ChangePizzaSize() {
    let et = event.target;
    const parent = et.closest('.slot__controls');
    const weightDiv = parent.querySelector('.slot__weight');
    const priceDiv = parent.querySelector('.slot__cost');
    const current = et.parentElement;
    
    let newWeight = current.getAttribute('dish_w');
    let newPrice = current.getAttribute('dish_p');
    
    weightDiv.innerText = newWeight + 'g';
    priceDiv.innerText = newPrice + ' ₽';
}

function CalculateTotalSum() {
    // const orderBlock = basketModalOrder;
    const totalSumBlock = document.querySelector('span.modal-basket__sum');
    let total = 0;
    Array.from(basketModalOrder.children).forEach(row => {
        let rowCost = row.querySelector('.order-row__cost').innerText.slice(0, row.querySelector('.order-row__cost').innerText.lastIndexOf(' '));
        total += +rowCost;
    });
    totalSumBlock.innerText = total + ' ₽';
}

async function FetchTable(table) {
    const data = await fetch('/fetch-db', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            /* 'Accept': 'application/x-www-form-urlencoded',
            'Content-Type': 'application/x-www-form-urlencoded', */
        },
        body: JSON.stringify({ q: table })
    })
    .then((res) => res.json());
    console.log(data);
    return data;
}