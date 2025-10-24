const User = require('../models/user');

exports.getUsers = async (req, res) => {
    const users = await User.find();
    res.render('users', { users });
};

exports.createUser = async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.redirect('/users');
};

exports.getAllUsers = async (req, res) => {
    const users = await User.find();
    res.render('users', { users: users });
};

exports.showEditForm = async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('editUser', { user: user });
};

exports.updateUser = async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/users');
};

exports.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users');
};