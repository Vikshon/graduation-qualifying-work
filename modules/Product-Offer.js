const nodemailer = require('nodemailer');

async function MakeOffer(list) {
    if (!list)
        return 'Error. List is empty';
    let html = '<ul>';
    for (let i of list)
        html += `<li>${i.Name} - ${i.Amount}</li>`;
    html += '</ul>';
    let user = 'vkr-email@mail.ru';
    let pass = 'vkr-pass';
    let provider = 'product-provider@mail.ru'
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user,
          pass
        },
    });
    let message = {
        from: `vkr-email <${user}>`,
        to: provider,
        subject: 'Доставить продукты',
        html
    };
    await transporter.sendMail(message)
}

module.exports.ProductsOffer = MakeOffer;