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
        let employee = employees.find(e => e.id === order['Waiter id']).Name;
        let newRow = document.createElement('div');
        newRow.classList.add('content__row', 'order');
        newRow.innerHTML = RowTemplate(dateCorrect, order['Table number'], order.Total, employee);
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

async function GenerateSettingsMenu() {
    h2.innerText = 'Данные учетной записи';
    employees = await FetchTable('employees');
    roles = await FetchTable('roles');
    GenerateSettingsForm();
}

function GenerateSettingsForm() {    
    [Name, Role] = acc.split(',');
    let user = employees.find(e => e.Name === Name);
    let userName = Name;
    let userPhoneNumber = user['Phone number'];
    let userPassword = user.Password;
    let jobTitle = roles.find(r => r.id === user['Role id'])['Role name'];
    return contentInfo.innerHTML = `<div class="content__info-container">
                                        <form class="content__form settings-form" action="/edit-account" method="POST">
                                            <label><span class="label__header">Имя</span><input required type="text" maxlength="50" value="${userName}" disabled></label>
                                            <label><span class="label__header">Номер телефона</span><input required type="tel" pattern="[0-9]{11}" maxlength="11" value="${userPhoneNumber}"></label>
                                            <label><span class="label__header">Пароль</span><input required type="text" minlength="6" maxlength="16" value="${userPassword}"></label>
                                            <label><span class="label__header">Должность</span><input required type="text" value="${jobTitle}" disabled></label>
                                            <div class="form__buttons">
                                                <button type="submit" class="submitBtn">Сохранить</button>
                                                <button type="reset" class="resetBtn">Отменить</button>
                                            </div>
                                        </form>
                                    </div>`;
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