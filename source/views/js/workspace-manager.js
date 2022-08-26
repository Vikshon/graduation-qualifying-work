const h1 = document.querySelector('h1.main__welcome');
const h2 = document.querySelector('.content__header h2');
const contentInfo = document.querySelector('.content__info');
const tabRegister = document.querySelector('.tabs__register');
const tabStorage = document.querySelector('.tabs__products-order');
const tabSettings = document.querySelector('.tabs__settings');
const tabDbControl = document.querySelector('.tabs__dbcontrol');
const DbControlSubtabs = document.querySelector('.tabs__dbtables');
let orders;
let ordersList;
let products;
let recipes;
let dishes;
let employees;
let roles;
let ingredientLists;
let storage;
let storageOperations;
let supplyLists;

tabRegister.addEventListener('click', CreateAccount);
tabDbControl.addEventListener('click', () => DbControlSubtabs.classList.toggle('visible'));
tabStorage.addEventListener('click', GenerateStorageMenu);
tabSettings.addEventListener('click', GenerateSettingsMenu);
for (let i of DbControlSubtabs.children)
    i.addEventListener('click', GenerateDBMenu);
window.addEventListener('load', async () => {
    CheckAccess();
    // ! REFACTOR multi-await fetch TO promise.all
    products = await FetchTable('products');
    dishes = await FetchTable('dishes');
    recipes = await FetchTable('recipes');
})

async function CreateAccount() {
    h2.innerText = 'Регистрация нового аккаунта';
    employees = await FetchTable('employees');
    GenerateForm();
    // const registerBtn = contentInfo.querySelector('.submitBtn')
}

function GenerateForm() {
    contentInfo.innerHTML = `<div class="content__info-container">
                                <form class="content__form register-form" action="/register-account" method="POST">
                                    <label><span class="label__header">Имя</span><input name="name" required type="text" maxlength="50"></label>                                    
                                    <label><span class="label__header">Номер телефона</span><input name="phoneNumber" required type="tel" pattern="[0-9]{11}" maxlength="11"></label>
                                    <label><span class="label__header">Пароль</span><input name="password" required type="text" minlength="6" maxlength="16"></label>
                                    <label><span class="label__header">Должность</span><select name="roleId"><option value="1">Официант</option><option value="2">Повар</option><option value="3">Менеджер</option></select></label>
                                    <div class="form__buttons">
                                        <button type="submit" class="submitBtn">Создать</button>
                                        <button type="reset" class="resetBtn">Очистить</button>
                                    </div>
                                </form>
                            </div>`;
}

async function GenerateDBMenu(e) {
    let tableName = e.target.innerText;
    let variableLink;
    switch (tableName) {
        case 'Orders':
            orders = await FetchTable('orders');
            variableLink = orders;
            break;
        case 'OrdersList':
            ordersList = await FetchTable('orders-list');
            variableLink = ordersList;
            break;
        case 'Products':
            products = await FetchTable('products');
            variableLink = products;
            break;
        case 'Recipes':
            recipes = await FetchTable('recipes');
            variableLink = recipes;
            break;
        case 'Dishes':
            dishes = await FetchTable('dishes');
            variableLink = dishes;
            break;
        case 'IngredientLists':
            ingredientLists = await FetchTable('ingredient-lists');
            variableLink = ingredientLists;
            break;
        case 'Employees':
            employees = await FetchTable('employees');
            variableLink = employees;
            break;
        case 'Roles':
            roles = await FetchTable('roles');
            variableLink = roles;
            break;
        case 'Storage':
            storage = await FetchTable('storage');
            variableLink = storage;
            break;
        case 'StorageOperations':
            storageOperations = await FetchTable('storage-operations');
            variableLink = storageOperations;
            break;
        case 'SupplyLists':
            supplyLists = await FetchTable('supply-lists');
            variableLink = supplyLists;
            break;
        default:
            console.log('Нет данных по таблице' + tableName);
            break;
    };
    h2.innerHTML = `Таблица "${tableName}"`;
    GenerateTable(variableLink);
}

function GenerateTable(table) {
    contentInfo.innerHTML = `<div class="table__container">
                                <table>
                                    <thead class="table__headers"><tr></tr></thead>
                                    <tbody class="table__body"></tbody>
                                </table>
                            </div>`;
    FillTable(table);
}

function FillTable(tableData) {
    let rows = tableData.length;
    let columns = Object.values(tableData[0]).length;
    const tableHeaders = document.querySelector('table .table__headers tr');
    const tableBody = document.querySelector('table .table__body');
    Object.keys(tableData[0]).forEach(el => {
        tableHeaders.innerHTML += `<th>${el}</th>`;
    });
    // Проблема с выводом дат
    tableData.forEach(el => {
        let rowValues = Object.values(el);
        tableBody.innerHTML += `<tr></tr>`;
        for (let i of rowValues) {
            tableBody.lastElementChild.innerHTML += `<td>${i}</td>`;
        }
    })
}

async function GenerateStorageMenu() {
    h2.innerText = 'Оформить заказ продуктов';
    products = await FetchTable('products');
    storage = await FetchTable('storage');
    contentInfo.innerHTML = `<div class="table__container">
                                        <table class="table-productsOrder">
                                            <thead class="table__headers"><tr>
                                                <td>Название</td>
                                                <td>Количество на складе</td>
                                                <td>Единица измерения</td>
                                                <td>Цена за 100 г / мл</td>
                                                <td>Добавить к заказу</td>
                                            </tr></thead>
                                            <tbody class="table__body"></tbody>
                                        </table>
                                    </div>`;
    let tbody = contentInfo.querySelector('tbody');
    for (let i of products) {
        let productName = i.Name;
        let productCost = i.Cost;
        let productAmount = 0;
        let productUnit = '-';
        let isInStorage = storage.find(p => p['Product id'] === i.id);
        if (isInStorage) {
            productAmount = isInStorage.Amount;
            productUnit = isInStorage.Unit;
        }
        tbody.innerHTML += `<tr>
                                <td>${productName}</td>
                                <td>${productAmount}</td>
                                <td>${productUnit}</td>
                                <td>${productCost}</td>
                                <td class="table__productOrderAmount"><input type="number" placeholder="0" min="0" max="9999"></td>
                            </tr>`;
    }
    tbody.innerHTML += `<tr id="productsOrderLastRow">
                            <td><input type="text"></td>
                            <td><input type="number"></td>
                            <td><select><option value="-">-</option><option value="г">г</option><option value="мл">мл</option><option value="кг">кг</option><option value="л">л</option></select></td>
                            <td><input type="number" min="1" max="9999"></td>
                            <td><input type="number" min="0" max="9999"></td>
                        </tr>`;
    // ! ZXC
    tbody.querySelector('#productsOrderLastRow').addEventListener('click', () => {});
    contentInfo.innerHTML += `<div class="form__buttons">
                                <button>Создать заказ</button>
                            </div>`
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