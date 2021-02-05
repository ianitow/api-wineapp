import { ERROR_USER_ENUMS, IErrorUsers } from './../helpers/UsersErrors';
import { verifyJWT } from './../middlewares/checkJwt';
import { IUser, UserProperties } from './../models/UserModel';
import {
  deleteUser,
  saveUser,
  editUser,
  authUser,
  listUsers,
} from './../controllers/UserController';

import { Router, Request, Response, response } from 'express';
import UserModel from '../models/UserModel';
import { ObjectId, Types, SchemaTypes } from 'mongoose';

const userRouter = Router();

userRouter
  .route('/')
  .get(async (req: Request, res: Response) => {
    let errorMessage: IErrorUsers;
    const showUsersDisabled: any = req.params.disabled || false;
    listUsers({ disabled: showUsersDisabled })
      .then((users) => {
        res.json(users);
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
    let errorMessage: IErrorUsers;
    const { name, password, email }: IUser = req.body;
    if (!name || !password || !email) {
      errorMessage = {
        type: ERROR_USER_ENUMS.DATA_INVALID,
        message: 'Data invalid!',
        status: 400,
      };
      return res.status(<number>errorMessage.status).json(errorMessage);
    } else {
      saveUser(req.body)
        .then((user) => {
          return res.status(201).json(user);
        })
        .catch((err) => {
          errorMessage = {
            type: err.type,
            message: err.message,
            status: err.status || 500,
          };
          return res.status(<number>errorMessage.status).json(errorMessage);
        });
    }
  });

userRouter.route('/token').post(async (req: Request, res: Response) => {
  let errorMessage: IErrorUsers;
  const { password, email }: UserProperties = req.body;
  authUser({ email, password })
    .then((token) => {
      res.status(200).json({ authorization: token });
    })
    .catch((err) => {
      errorMessage = {
        type: err.type,
        message: err.message,
        status: err.status || 500,
      };
      return res.status(<number>errorMessage.status).json(errorMessage);
    });
});
userRouter
  .route('/:id')
  .put(async (req: Request, res: Response) => {
    let errorMessage: IErrorUsers;
    const { id }: IUser['_id'] = req.params;
    const { name, password, address, number_phone, email }: IUser = req.body;
    if (!id) {
      errorMessage = {
        type: ERROR_USER_ENUMS.DATA_INVALID,
        message: 'Data invalid!',
        status: 400,
      };
      return res.status(<number>errorMessage.status).json(errorMessage);
    } else {
      editUser({ id, name, password, address, number_phone, email })
        .then((user) => {
          return res.status(200).json(user);
        })
        .catch((err) => {
          errorMessage = {
            type: err.type,
            message: err.message,
            status: err.status || 500,
          };
          return res.status(<number>errorMessage.status).json(errorMessage);
        });
    }
  })
  .delete(async (req: Request, res: Response) => {
    let errorMessage: IErrorUsers;
    const { id }: IUser['_id'] = req.params;

    if (!id) {
      errorMessage = {
        type: ERROR_USER_ENUMS.DATA_INVALID,
        message: 'Data invalid!',
        status: 400,
      };
      return res.status(<number>errorMessage.status).json(errorMessage);
    } else {
      deleteUser(id)
        .then(() => {
          return res
            .status(204)
            .json({ message: 'User deleted successfully.' });
        })
        .catch((err) => {
          errorMessage = {
            type: err.type,
            message: err.message,
            status: err.status || 500,
          };
          return res.status(<number>errorMessage.status).json(errorMessage);
        });
    }
  });

export default userRouter;
