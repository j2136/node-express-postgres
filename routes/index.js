const express = require('express');
const router = express.Router();
const knex = require('../db/knex');

router.get('/', function (req, res, next) {
  const userId = req.session.userid;
  const isAuth = Boolean(userId);
  const search = req.query.search || '';

  knex('tasks')
    .select('*')
    .then(function (results) {
      const filteredResults = results.filter(task => task.content.includes(search));
      res.render('index', {
        title: 'ToDo App',
        todos: filteredResults,
        isAuth: isAuth,
      });
    })
    .catch(function (err) {
      console.error(err);
      res.render('index', {
        title: 'ToDo App',
        isAuth: isAuth,
      });
    });
});

router.post('/', function (req, res, next) {
  const userId = req.session.userid;
  const isAuth = Boolean(userId);
  const todo = req.body.add;
  if (!todo) {
    return res.redirect('/');
  }
  knex("tasks")
    .insert({user_id: 1, content: todo})
    .then(function () {
      res.redirect('/')
    })
    .catch(function (err) {
      console.error(err);
      res.render('index', {
        title: 'ToDo App',
        isAuth: isAuth,
      });
    });
});

router.post('/delete/:id', function (req, res, next) {
  const id = req.params.id;
  knex("tasks")
    .where('id', id)
    .del()
    .then(function () {
      res.redirect('/');
    })
    .catch(function (err) {
      console.error(err);
      res.redirect('/');
    });
});

router.post('/complete/:id', function (req, res, next) {
  const id = req.params.id;
  knex("tasks")
    .where('id', id)
    .update({ completed: true })
    .then(function () {
      res.redirect('/');
    })
    .catch(function (err) {
      console.error(err);
      res.redirect('/');
    });
});

router.post('/edit', function (req, res, next) {
  const { id, content } = req.body;
  knex('tasks')
    .where('id', id)
    .update({ content: content })
    .then(() => {
      res.redirect('/');
    })
    .catch(function (err) {
      console.error(err);
      res.redirect('/');
    });
});

router.use('/signup', require('./signup'));
router.use('/signin', require('./signin'));
router.use('/logout', require('./logout'));

module.exports = router;
