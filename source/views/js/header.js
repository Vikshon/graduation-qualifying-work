/* let accountBlock = document.querySelector('.links-header__account');
let modalTest = document.querySelector('.links-header__account-modal');
accountBlock.addEventListener('click', (e) => {
    let offsets = e.target.getBoundingClientRect();
    let left = offsets.left;
    modalTest.style.right = `${window.innerWidth - left}px`;
}) */

const accountBlock = document.querySelector('.links-header__account');
const accountModal = document.querySelector('.links-header__modal-account');
const accountModalLogin = document.querySelector('.modal-account__container-login');
const accountModalUser = document.querySelector('.modal-account__container-user');
const accountLoginBtn = document.querySelector('.modal-account__btn-login');
const accountLogoutBtn = document.querySelector('.modal-account__btn-logout');
const basketBlock = document.querySelector('.links-header__basket');
const basketModal = document.querySelector('.links-header__modal-basket');
const modalCloseBtns = document.querySelectorAll('.modal__close');
const workspaceBlock = document.querySelector('.links-header__workspace');
let acc;

window.addEventListener('load', CheckUser);
accountBlock.addEventListener('click', () => ModalSwitch('account'));
accountLoginBtn.addEventListener('click', Login);
accountLogoutBtn.addEventListener('click', Logout);
basketBlock.addEventListener('click', () => ModalSwitch('basket'));
for (let i of modalCloseBtns)
    i.addEventListener('click', () => i.closest('.links-header__modal').classList.add('--hidden'));

function ModalSwitch(target) {
    if (target === 'account') {
        accountModal.classList.toggle('--hidden');
        basketModal.classList.add('--hidden');
    }
    else if (target === 'basket') {
        basketModal.classList.toggle('--hidden');
        accountModal.classList.add('--hidden');
    }
}

function CheckUser() {
    acc = localStorage.getItem('acc');
    if (!acc)
        return;
    [Name, Role] = acc.split(',');
    document.querySelector('.links-header__account-user').innerText = Name;
    workspaceBlock.querySelector('a').href = `/workspace?${Role}`;
    workspaceBlock.classList.remove('--hidden');
    accountModalLogin.classList.add('--hidden');
    accountModalUser.classList.remove('--hidden');
}

async function Login() {
    const errorMessage = document.querySelector('.modal-account__inputErrorMessage');
    const numInput = accountModal.querySelector('.modal-account__number');
    const pwdInput = accountModal.querySelector('.modal-account__password');
    if (!ValidateInput([numInput, pwdInput], errorMessage))
        return;
    
    const employees = await FetchTable('employees');
    let isExists = employees.find(employee => employee['Phone Number'] === numInput.value);
    if (!isExists) {
        errorMessage.classList.remove('--hidden');
        errorMessage.innerText = 'Ошибка. Аккаунта не существует';
        return;
    }
    if (isExists.Password !== pwdInput.value) {
        errorMessage.classList.remove('--hidden');
        errorMessage.innerText = 'Ошибка. Проверьте введенные данные';
        return;
    }
    errorMessage.classList.add('--hidden');
    console.log('logged in');
    // TODO: to local or session storage:
    localStorage.setItem('acc', [isExists.Name, isExists.Role]);
    /* let account = isExists; */
    document.location.reload();
}

function ValidateInput(inputData, errorMessage) {
    errorMessage.innerText = 'Ошибка. Проверьте введенные данные';
    let fl = true;
    for (let i of inputData) {
        if (i.value == '') {
            errorMessage.classList.remove('--hidden');
            fl = false;
        }
    }
    const [numInput, pwdInput] = inputData;
    if (numInput.value.length !== 11) {
        errorMessage.classList.remove('--hidden');
        fl = false;
    }
    if (pwdInput.value.length < 6 || pwdInput.value.length > 16) {
        errorMessage.classList.remove('--hidden');
        fl = false;
    }
    // Скрываем сообщение
    if (fl) {
        errorMessage.classList.add('--hidden');
    }
    return fl;
}

function Logout() {
    // ! TODO: If unknown user do display: block and press logout btn it still reloads page.. Add CheckRole
    localStorage.removeItem('acc');
    document.location.reload();
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
    // console.log(data);
    return data;
}