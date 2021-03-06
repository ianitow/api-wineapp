import { IErrorCustomer } from './../helpers/CustomersErrors';

import {
  listCostumers,
  createCustomer,
  deleteCostumer,
  editCustomer,
} from './../controllers/CustomerController';
import CustomerModel, { ICustomer } from './../models/CustomerModel';

import { Router, Request, Response } from 'express';

const customerRouter = Router();

customerRouter
  .route('/')
  .get(async (req: Request, res: Response) => {
    let errorMessage: IErrorCustomer;
    const showCustomersDisabled = req.params.disabled ? true : false;
    listCostumers({ disabled: showCustomersDisabled })
      .then((customers) => {
        res.json(customers);
      })
      .catch((err) => {
        errorMessage = {
          type: err.type,
          message: err.message,
          status: err.status || 500,
        };
        return res.status(<number>errorMessage.status).json(errorMessage);
      });
  })
  .post(async (req: Request, res: Response) => {
    const { name, address, number_phone }: ICustomer = req.body;
    if (!name || !address || !number_phone) {
      return res.status(400).json({ error: true, message: 'Data invalid!' });
    } else {
      createCustomer({ name, address, number_phone })
        .then((user) => {
          return res.status(201).json(user);
        })
        .catch((error) => {
          return res
            .status(error.status)
            .json({ error: true, message: error.message });
        });
    }
  });
customerRouter
  .route('/:id')
  .put(async (req: Request, res: Response) => {
    const { id }: ICustomer['_id'] = req.params;
    const { name, address, number_phone }: ICustomer = req.body;
    if (!name || !address || !number_phone) {
      return res.status(400).json({ error: true, message: 'Data invalid!' });
    } else {
      editCustomer({ id, name, address, number_phone })
        .then((customer) => {
          return res.status(200).json(customer);
        })
        .catch((error) => {
          return res
            .status(error.status)
            .json({ error: true, message: error.message });
        });
    }
  })
  .delete(async (req: Request, res: Response) => {
    const { id }: ICustomer['_id'] = req.params;

    if (!id) {
      return res.status(400).json({ error: true, message: 'Data invalid!' });
    } else {
      deleteCostumer({ id })
        .then(() => {
          return res
            .status(204)
            .json({ message: 'Costumer deleted successfully.' });
        })
        .catch((error) => {
          return res
            .status(error.status)
            .json({ error: true, message: error.message });
        });
    }
  });

export default customerRouter;
