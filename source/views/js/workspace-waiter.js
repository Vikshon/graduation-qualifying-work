const h1 = document.querySelector('h1.main__welcome');
const h2 = document.querySelector('h2');
const contentInfo = document.querySelector('.content__info');
const tabOrders = document.querySelector('.tabs__orders');
const settingsOrders = document.querySelector('.tabs__settings');
let orders;
let employees;

window.addEventListener('load', async () => {
    CheckAccess();
    /* acc = localStorage.getItem('acc');
    console.log(window) */
})
tabOrders.addEventListener('click', GenerateOrders);
settingsOrders.addEventListener('click', GenerateSettingsMenu);

async function GenerateOrders() {
    // ! TODO SELECT o.*, e.Name FROM `orders` AS o LEFT JOIN `employees` AS e ON o.Waiter = e.id;
    contentInfo.innerHTML = `<div class="orders__rows"></div>`;
    h2.innerText = "Список заказов";
    orders = await FetchTable('orders');
    employees = await FetchTable('employees');
    GenerateOrdersRow();
}

function GenerateOrdersRow() {
    contentInfo.querySelector('.orders__rows').innerHTML = ``;
    if (orders.length === 0)
        contentInfo.querySelector('.orders__rows').innerHTML += `<h3>Список заказов пуст</h3>`;
    orders.forEach(order => {
        let date = new Date(order.Date);
        let dateCorrect = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`;
        let employee = employees.find(e => e.id === order.Waiter).Name;
        let newRow = document.createElement('div');
        newRow.classList.add('content__row', 'order');
        newRow.innerHTML = RowTemplate(dateCorrect, order['Table Number'], order.Total, employee);
        contentInfo.querySelector('.orders__rows').appendChild(newRow);
        SelectOrderState(order.State, newRow);
    });
}

function RowTemplate(date, table, total, waiter) {
    return `<span class="order__date">Дата: ${date}</span>
            <span class="order__date">Официант: ${waiter}</span>
            <span class="order__table">Столик №${table}</span>
            <span class="order__table">Итог: ${total} ₽</span>
            <span class="order__state">Статус: <select>
                <option value="Получен">Получен</option>
                <option value="Готовится">Готовится</option>
                <option value="Готов">Готов</option>
                <option value="Доставлен">Доставлен</option>
                <option value="Закрыт">Закрыт</option>
                <option value="Отменен">Отменен</option></select></span>
            <span class="order__arrowIcon"></span>`;
}

function SelectOrderState(state, newRow) {
    const option = newRow.querySelector(`option[value="${state}"]`);
    option.setAttribute('selected', '');
    if (state === "Закрыт")
        option.parentElement.setAttribute('disabled', '');
}

function GenerateSettingsMenu() {
    // 
}

function CheckAccess() {
    let paramRoleId = window.location.search.slice(1);
    acc = localStorage.getItem('acc');
    if (!acc)
        return window.location.replace('/no-access');
    [Name, Role] = acc.split(',');
    if (paramRoleId !== Role)
        return window.location.replace('/no-access');
    h1.innerText += ` ${Name}`;
}