import model from '../models';
import passport from 'passport';
require('../config/passport')(passport);
require('dotenv').config();

const { Data } = model;
const Client = require('bitcoin-core');

const client = new Client({
    host: process.env.BTC_HOST,
    username: process.env.BTC_USERNAME,
    password: process.env.BTC_PASSWORD,
    port: process.env.BTC_PORT
});

const getToken = (headers) => {
    if (headers && headers.authorization) {
        let parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};


class DataStore {

    static create(req, res) {

        const data = req.body.data;

        let token = getToken(req.headers);

        if(token) {

            return Data
            .create({
                data
            })
            .then((data) => {
                return res.status(200).send({
                    status: true,
                    data: data,
                    message: 'Your data has been created'
                });
            })
            .catch((error) => res.status(400).send(error));

        } else {
            return res.status(403).send({
                success: false,
                message: "Unauthorized"
            });
        }
    }

    static getAllData(req, res) {

        let token = getToken(req.headers);

        if(token) {

            return Data
            .findAll()
            .then((data) => {
                res.status(200).send({
                    success: true,
                    data: data
                });
            })
            .catch((error) => res.status(401).send(error));
        
        } else {
            return res.status(403).send({
                success: false,
                message: "Unauthorized"
            });
        }
        
    }

    static updateData(req, res) {
        let token = getToken(req.headers);
        if(token) {
            return Data
                .find({
                    where: {
                        id: req.body.id,
                    }
                })
                .then((data) => {
                    data.update({
                        data: req.body.data,
                    }).then((response) => {
                        res.status(200).send({
                            success: true,
                            message: 'Data has been updated',
                            response: response,
                        });
                    }).catch((error) => {
                        res.status(400).send(error);
                    });
                })
                .catch((error) => {res.status(400).send(error)});
        } else {
            return res.status(403).send({
                success: false,
                message: 'Unauthorized'
            });
        }
    }

    static deleteData(req, res) {
        Data
            .destroy({
                where: {
                    id: req.body.id
                }
            })
            .then((data) => {
                if(!data) {
                    return res.status(401).send({
                        success: false,
                        message: 'Data not found',
                    });
                } else {
                    return res.status(200).send({
                        success: true,
                        message: 'Data has been deleted',
                        data: data,
                    });
                }
            })
            .catch((error) => {
                return res.status(400).send({
                    success: false,
                    error: error,
                });
            });
    }

    static checkFile(req, res) {
        return res.status(200).send(req.file);
    }

    static async getNewBitcoinAddress(req, res) {
        client.getNewAddress().then((address) => {
            console.log(address);
            return res.status(200).send(address);
        });
    }

    static async sendBitcoin(req, res) {
        client.sendToAddress('2MwM1vpsiqJNRNmcB8RN3vGnAcn9KRv2Qcg', 0.1,  'sendtoaddress example', 'Nemo From Example.com').then((response) => {
            return res.status(200).send({
                success: true,
                message: 'Transactions successful!',
                response: response,
            });
        }).catch((error) => {
            return res.status(400).send({
                success: true,
                message: 'Transactions failed!',
                response: error,
            });
        });
    }

    static async getBalanceInfo(req, res) {
        await client.getBalance('2MwM1vpsiqJNRNmcB8RN3vGnAcn9KRv2Qcg').then((response) => {
            return res.status(200).send({
                success: true,
                message: 'Got balance',
                response: response,
            });
        }).catch((error) => {
            return res.status(400).send({
                success: true,
                message: 'Got balance',
                response: error,
            });
        });
    }

    static async getTransectionDetails(req, res) {
        client.getTransaction('171b376a850148c661892d96b5a2d1e925938c4d8a7fc27c0ede264d5ef9f07c').then((response) => {
            return res.status(200).send({
                success: true,
                message: 'Transaction details:',
                response: response,
            });
        }).catch((error) => {
            return res.status(400).send({
                success: true,
                message: 'Transaction details failed!',
                response: error,
            });
        });
    }
}


export default DataStore;