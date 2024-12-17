const { MercadoPagoConfig, Payment } = require('mercadopago');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

const client = new MercadoPagoConfig({
    accessToken: 'APP_USR-7442416430684062-120114-924efd9d2884ab36e2637afb5aaa7bfd-2036630497', 
    options: {
        timeout: 5000,
    }
});

const payment = new Payment(client);

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, '/views'));

app.get('/', (req,res) => {
    res.render('index');
});
app.post('/process_payment', async (req,res) => {
    const paymentData = {
        transaction_amount: Number(req.body.transactionAmount),
        description: 'Pagamento de 1 R$',
        payment_method_id: 'pix',
        payer: {
          email: req.body.email,
          first_name: req.body.payerFirstName,
          last_name: req.body.payerLastName,
          identification: {
            type: req.body.identificationType,
            number: req.body.identificationNumber
          }
        }
      };
    
      try {
        const response = await payment.create({ body: paymentData });
        res.render('pagamento', {qr_code_base64: response.point_of_interaction.transaction_data.qr_code_base64, qr_code: response.point_of_interaction.transaction_data.qr_code})
      } catch (error) {
        console.error('Erro ao criar pagamento:', error);
      }
})



app.listen(3000, () => {console.log('server running on port 3000!')});