import { Router } from 'express';

class BaseController {

  constructor(model) {
    this.model = model;
    this.modelName = model.modelName.toLowerCase();
  }

  create(data) {
    return this.model
      .create(data)
      .then(modelInstance => modelInstance);
  }

  read(id) {
    return this.model
      .findOne({ _id: id })
      .then(modelInstance => modelInstance);
  }

  update(id, data) {
    return this.model
      .findOne({ _id: id })
      .then((modelInstance) => {
        Object.keys(data).forEach((key) => {
          if((modelInstance[key] && key !== '_id')) {
            modelInstance[key] = data[key];
          }
        });
        return modelInstance.save();
      })
      .then(modelInstance => modelInstance)
      .catch(err => err);
  }

  delete(id) {
    return this.model
      .remove({ _id: id })
      .then(() => ({}));
  }

  list() {
    return this.model
      .find({})
      .populate(['users'])
      .then(modelInstances => modelInstances);
  }

  route() {
    const router = new Router();

    router.get('/', (req, res) => {
      this
        .list()
        .then((list) => {
          res.json(list);
          res.end();
        })
        .catch((err) => {
          res.status(401);
          res.json(err);
          res.end();
        });
    });

    router.post('/', (req, res) => {
      this
        .create(req.body)
        .then((newInstance) => {
          res.json(newInstance);
          res.end();
        })
        .catch((err) => {
          res.status(401);
          res.json(err);
          res.end();
        });
    });

    router.get('/:id', (req, res) => {
      this
        .read(req.params.id)
        .then((newInstance) => {
          res.json(newInstance);
          res.end();
        })
        .catch((err) => {
          res.status(401);
          res.json(err);
          res.end();
        });
    });

    router.put('/:id', (req, res) => {
      this
        .update(req.params.id, req.body)
        .then((newInstance) => {
          res.json(newInstance);
          res.end();
        })
        .catch((err) => {
          console.log(err);
          res.status(401);
          res.json(err);
          res.end();
        });
    });

    router.delete('/:id', (req, res) => {
      this
        .delete(req.params.id)
        .then(() => {
          res.end();
        })
        .catch((err) => {
          res.status(401);
          res.json(err);
          res.end();
        });
    });

    return router;
  }
}

export default BaseController;
