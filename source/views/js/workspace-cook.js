const h2 = document.querySelector('h2');
const contentInfo = document.querySelector('.content__info');
const tabOrders = document.querySelector('.tabs__orders');
tabOrders.addEventListener('click', GenerateOrders);
let orders;
let ordersList;
let products;
let recipes;
let dishes;
let employees;
let ingredientLists;

window.addEventListener('load', async () => {
    // ! REFACTOR multi-await fetch TO promise.all
    products = await FetchTable('products');
    dishes = await FetchTable('dishes');
    recipes = await FetchTable('recipes');
    employees = await FetchTable('employees');
    console.log(employees)

    // GroupMenu();
})

async function GenerateOrders() {
    // ! TODO SELECT o.*, e.Name FROM `orders` AS o LEFT JOIN `employees` AS e ON o.Waiter = e.id;
    contentInfo.innerHTML = `<div class="orders__rows"></div>`;
    h2.innerText = "Список заказов";
    orders = await FetchTable('orders');
    console.log(orders)
    ordersList = await FetchTable('orders-list');
    ingredientLists = await FetchTable('ingredient-lists');

    GenerateOrdersRow();
}

function GenerateOrdersRow() {
    orders.forEach(order => {
        // TODO: Если повар уже приступил к заказу, его отменят, то у него он просто пропадет. То есть, отмененные заказы можно не убирать сразу, а как-то иначе
        if (order.State === 'Закрыт' || order.State === 'Отменен' )
            return;
        let date = new Date(order.Date);
        let dateCorrect = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`;
        let employee = employees.find(e => e.id === order['Waiter id']).Name;
        let newRow = document.createElement('div');
        let orderList = ordersList.filter(o => o['Order id'] === order.id)/* .map(d => [d['Dish id'], d.Amount]) */;
        newRow.classList.add('content__row', 'order');
        newRow.innerHTML = RowTemplate(dateCorrect, employee, orderList);
        SelectOrderState(order.State, newRow);
        ListDishesTemplate(orderList, newRow);
        contentInfo.querySelector('.orders__rows').appendChild(newRow);
    });
}

function SelectOrderState(state, newRow) {
    const option = newRow.querySelector(`option[value="${state}"]`);
    option.setAttribute('selected', '');
    if (state === "Закрыт" || state === "Отменен")
        option.parentElement.setAttribute('disabled', '');
}

function RowTemplate(date, waiter) {
    return `<span class="order__date">Дата: ${date}</span>
            <span class="order__date">Официант: ${waiter}</span>
            <span class="order__state">Статус: <select>
                <option value="Получен">Получен</option>
                <option value="Готовится">Готовится</option>
                <option value="Готов">Готов</option>
                <option value="Доставлен" disabled>Доставлен</option>
                <option value="Закрыт" disabled>Закрыт</option>
                <option value="Отменен" disabled>Отменен</option></select></span>
            <span class="order__arrowIcon"></span>
            <div class="order__list list">
                <span class="list__header">Состав заказа:</span>
                <div class="list__dishes"></div>
            </div>`;
}

function ListDishesTemplate(orderList, newRow) {
    for (let dish of orderList) {
        let dishName = dishes.find(d => d.id === dish['Dish id']).Name;
        let ingredientsListId = recipes.find(r => r['Dish id'] === dish['Dish id'])['Ingredient list id'];
        let dishIngredients = ingredientLists.filter(i => i['List id'] === ingredientsListId);
        let newDish = document.createElement('div');
        newDish.classList.add('list__dish', 'dish');
        newDish.innerHTML += `
            <h4 class="dish__header">Пицца "${dishName}" - ${dish.Amount} шт.</h4>
            <ul class="dish__ingredients">Состав:</ul>`;
        let ul = newDish.querySelector('.dish__ingredients');
        for (let i of dishIngredients) {
            let ingredientName = products.find(p => p.id === i['Product id']).Name;
            ul.innerHTML += `<li>${ingredientName} - ${i.Amount} ${i.Unit}</li>`
        }
        newRow.querySelector('.list__dishes').appendChild(newDish);
    }
    return;
}

/* function ListDishesTemplate(orderList, newRow) {
    for (let dish of orderList) {
        let dishName = dishes.find(d => d.id === dish['Dish id']).Name;
        let dishIngredients = recipes.filter(r => r['Dish ID'] === dish['Dish id']);
        let newDish = document.createElement('div');
        newDish.classList.add('list__dish', 'dish');
        newDish.innerHTML += `<h4 class="dish__header">Пицца "${dishName}" - ${dish.Amount} шт.</h4>
                                <ul class="dish__ingredients">Состав:</ul>`;
        let ul = newDish.querySelector('.dish__ingredients');
        console.log('asd', dishIngredients)
        for (let i of dishIngredients) {
            let ingredientName = products.find(p => p.id === i['Product ID']).Name;
            let ingredientAmount = i.Amount;
            let ingredientUnit = products.find(p => p.id === i['Product ID']).Unit;
            ul.innerHTML += `<li>${ingredientName} - ${ingredientAmount} ${ingredientUnit}</li>`
        }
        newRow.querySelector('.list__dishes').appendChild(newDish);
    }
    return;
} */

function GroupMenu() {
    let newMenu = [];
    dishes.forEach(el => {
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
    dishes = newMenu;
}