var express = require('express');

var User    = require('../models/user');

module.exports = function(app, passport) {
        /* GET users listing. */
        app.get('/teacherlist', function(req, res) {

          var list = [];
          User.scan()
          .where('role').equals('teacher')
          .where('approved').equals(true)
          .where('teacher').notNull()
          .exec(function(err, teachers){
            for(index in teachers.Items){
              var attr = teachers.Items[index].attrs;
              list.push(attr);
            }

            res.render('userlist', {userlist: list});
          });
        });
      };