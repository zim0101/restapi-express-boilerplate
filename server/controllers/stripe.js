const stripe = require("stripe")("sk_test_NqO0ZeIYYa4Torl1UlpuBxUe");

class Stripe {
    static async payToTestAccount(req, res) {
        const amount = req.body.amount;
        const charge = await stripe.charges
            .create({
                amount: amount,
                currency: 'usd',
                source: 'tok_visa',
                receipt_email: 'cybertronix.4406@gmail.com',
            })
            .then((charge) => {
                res.status(200).send(charge);
            })
            .catch((error) => res.status(400).send(error));
    }
}

export default Stripe;