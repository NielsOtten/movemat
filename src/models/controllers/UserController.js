import BaseController from './BaseController';
import User from '../User';

class UserController extends BaseController {
  constructor() {
    super(User);
  }
}

export default UserController;
