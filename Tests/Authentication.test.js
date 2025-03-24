const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const { UserRegister } = require('../Controllers/users/Authentication.js');
const users = require('../Models/UserSchema.js');
const Sessions = require('../Models/UserSession.js');
const { sendEmail } = require('../Nodemailer/Mails.js');

jest.mock('../Models/UserSchema.js');
jest.mock('../Models/UserSession.js');
jest.mock('../Nodemailer/Mails.js');

const app = express();
app.use(express.json());
app.post('/register', UserRegister);

describe('User Registration API', () => {
  let req;

  beforeEach(() => {
    req = {
      body: {
        fullname: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password@123',
        phone: '1234567890',
        address: '123 Main St',
        account_type: 'user',
      },
      file: {
        originalname: 'profile.png',
        buffer: Buffer.from('../utils/ProfilePics'),
        mimetype: 'image/png',
      },
    };
  });

  it('should return 401 if any required field is missing', async () => {
    delete req.body.email;

    const res = await request(app).post('/register').send(req.body);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'All fields are required for the registration');
  });

  it('should return 404 if user already exists', async () => {
    users.findOne.mockResolvedValue(true);

    const res = await request(app).post('/register').send(req.body);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('UserExist', 'User already exist please login');
  });

  it('should return 400 if no file is uploaded', async () => {
    req.file = null;

    const res = await request(app).post('/register').send(req.body);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'No file uploaded');
  });

  it('should successfully register a user and send confirmation email', async () => {
    users.findOne.mockResolvedValue(null);
    users.create.mockResolvedValue({ _id: '12345', email: req.body.email, fullname: req.body.fullname });
    bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');
    Sessions.create.mockResolvedValue({});

    const res = await request(app).post('/register').send(req.body);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', expect.stringContaining('user registration conformation has send to the email'));
    expect(sendEmail).toHaveBeenCalled();
    expect(Sessions.create).toHaveBeenCalledWith({
      useremail: req.body.email,
      userId: '12345',
      VerifyToken: expect.any(String),
      expiryTime: expect.any(Number),
    });
  });

  it('should return 500 if an internal error occurs', async () => {
    users.findOne.mockRejectedValue(new Error('Database Error'));

    const res = await request(app).post('/register').send(req.body);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('RegistrationError', 'Database Error');
  });
});
