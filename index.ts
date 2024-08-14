const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');

// Use sua chave secreta do Stripe aqui
const stripe = Stripe('sua_chave_secreta_aqui');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // o valor deve ser em centavos
            currency: 'brl',
            payment_method_types: ['card'],
        });

        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (err) {
        res.status(500).send({
            error: err.message,
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});