const h1 = document.querySelector('h1.main__welcome');
const h2 = document.querySelector('.content__header h2');
const contentInfo = document.querySelector('.content__info');
const settingsOrders = document.querySelector('.tabs__settings');
const tabRegister = document.querySelector('.tabs__register');
const tabStorage = document.querySelector('.tabs__products-order');
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
    h2.innerText = 'Регистриация нового аккаунта';
    employees = await FetchTable('employees');
    GenerateForm();
}

function GenerateForm() {
    contentInfo.innerHTML = `<div class="content__info-container">
                                <form class="register-form" action="/register-account" method="POST">
                                    <label><span class="label__header">Имя</span><input required type="text" maxlength="50"></label>
                                    <label><span class="label__header">Пароль</span><input required type="text" minlength="6" maxlength="16"></label>
                                    <label><span class="label__header">Номер телефона</span><input required type="tel" pattern="[0-9]{11}" maxlength="11"></label>
                                    <label><span class="label__header">Роль</span><select><option value="1">Официант</option><option value="2">Повар</option><option value="3">Менеджер</option></select></label>
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

function GenerateStorageMenu() {
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