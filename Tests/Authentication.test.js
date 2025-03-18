const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { describe, it, expect, beforeAll, afterAll } = require('@jest/globals');
const { UserRegister, Login, getProfile, forgetPassword, LogoutUsingCookie, resetPassword, GetProfileById, UpdateUserProfile, DeleteUserAccount } = require('../Middlewares/Authentication');
require('../Nodemailer/Mails');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.post('/register', UserRegister);
app.post('/login', Login);
app.get('/profile', getProfile);
app.post('/forget-password', forgetPassword);
app.post('/logout', LogoutUsingCookie);
app.post('/reset-password', resetPassword);
app.get('/profile/:id', GetProfileById);
app.put('/update-profile', UpdateUserProfile);
app.delete('/delete-account', DeleteUserAccount);

describe('Authentication Middleware', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('UserRegister', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          firstname: 'John',
          middlename: 'Doe',
          lastname: 'Smith',
          email: 'john@example.com',
          password: 'password123',
          DOB: '1990-01-01',
          phone: "1234567890",
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'User registered successfully');
    });
  });

  describe('Login', () => {
    it('should login a user', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          username: "testuser",
          password: "password123",
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('Success', true);
    });
  });

  describe('getProfile', () => {
    it('should get user profile', async () => {
      const token = jwt.sign({ id: new mongoose.Types.ObjectId() }, process.env.JWT_SECRET);
      const res = await request(app)
        .get('/profile')
        .set('Cookie', [`token=${token}`]);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('email');
    });
  });

  describe('forgetPassword', () => {
    it('should send forget password email', async () => {
      const res = await request(app)
        .post('/forget-password')
        .send({ email: 'john@example.com' });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('Success', true);
    });
  });

  describe('resetPassword', () => {
    it('should reset user password', async () => {
      const token = jwt.sign({ id: new mongoose.Types.ObjectId() }, process.env.JWT_SECRET);
      const res = await request(app)
        .post('/reset-password')
        .set('Cookie', [`token=${token}`])
        .send({ oldPassword: 'password123', newPassword: 'newpassword123' });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('successful', true);
    });
  });

  describe('GetProfileById', () => {
    it('should get user profile by ID', async () => {
      const userId = new mongoose.Types.ObjectId();
      const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);
      const res = await request(app)
        .get(`/profile/${userId}`)
        .set('Cookie', [`token=${token}`]);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('email');
    });
  });

  describe('UpdateUserProfile', () => {
    it('should update user profile', async () => {
      const userId = new mongoose.Types.ObjectId();
      const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);
      const res = await request(app)
        .put('/update-profile')
        .set('Cookie', [`token=${token}`])
        .send({ email: 'newemail@example.com', password: 'newpassword123' });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('email', 'newemail@example.com');
    });
  });

  describe('LogoutUsingCookie', () => {
    it('should logout a user', async () => {
      const token = jwt.sign({ id: new mongoose.Types.ObjectId() }, process.env.JWT_SECRET);
      const res = await request(app)
        .post('/logout')
        .set('Cookie', [`token=${token}`]);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'User logged out successfully');
    });
  });

  describe('DeleteUserAccount', () => {
    it('should delete user account', async () => {
      const userId = new mongoose.Types.ObjectId();
      const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);
      const res = await request(app)
        .delete('/delete-account')
        .set('Cookie', [`token=${token}`]);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
    });
  });
});
