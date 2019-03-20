import model from '../models';
import passport from 'passport';
require('../config/passport')(passport);
const { Data } = model;
const Client = require('bitcoin-core');


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

    static async bitcoinAPI(req, res) {

        const client = new Client({
            host: '142.44.244.65',
            username: 'btctestnet',
            password: 'btctestnet',
            port: 18332
        });

        client.getNewAddress().then((address) => {
            console.log(address);
            return res.status(200).send(address);
        });
    }

}

export default DataStore;