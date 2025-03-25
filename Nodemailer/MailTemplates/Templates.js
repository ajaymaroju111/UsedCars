//this templates should not be async (promise returned function )

//Template for the forget password : 
exports.forgetPasswordTemplate = (username) =>{
  return `
 <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset Request</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #007bff;
      color: #ffffff;
      text-align: center;
      padding: 20px;
      font-size: 24px;
    }
    .content {
      padding: 30px;
      color: #333333;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      background-color: #007bff;
      color: #ffffff;
      padding: 12px 24px;
      margin-top: 20px;
      border-radius: 4px;
      text-decoration: none;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #777777;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Password Reset Request</div>
    <div class="content">
      <p>Hi ${username},</p>
      <p>We received a request to reset your password. Please click the button below to reset your password.</p>
      <a href="[Reset Link]" class="button">Reset Password</a>
      <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
      <p>Thank you,<br />The Support Team</p>
    </div>
    <div class="footer">
      &copy; 2025 Your Company Name. All rights reserved.
    </div>
  </div>
</body>
</html>
  `
} 

//verification button after registration : 
exports.AccountConformationafterRegister = (Fullname , token) =>{
  return `
  <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            background-color: #ffffff;
            margin: 20px auto;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .header {
            font-size: 24px;
            font-weight: bold;
            color: #333;
        }
        .message {
            font-size: 16px;
            color: #555;
            margin: 20px 0;
        }
        .btn {
            display: inline-block;
            background-color: #007BFF;
            color: #ffffff;
            padding: 12px 20px;
            font-size: 16px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .btn:hover {
            background-color: #0056b3;
        }
        .footer {
            font-size: 12px;
            color: #777;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2 class="header">Dear ${Fullname} , Welcome to UserCars!</h2>
        <p class="message">
            Thank you for registering. Please click the button below to verify your email address and activate your account.
        </p>
        <h3>${token}</h3>
        <a href="{{verification_link}}" class="btn">Verify Your Email</a>
        <p class="footer">
            If you did not sign up for this account, please ignore this email.
        </p>
    </div>
</body>
</html>
  `
}

exports.AfterConformRegisterEmail = (username) =>{
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Registration Confirmation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      max-width: 600px;
      margin: 40px auto;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    h1 {
      color: #007bff;
    }
    p {
      font-size: 16px;
      color: #555;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #999;
    }
    .button {
      display: inline-block;
      background-color: #007bff;
      color: white;
      padding: 12px 24px;
      margin: 20px 0;
      text-decoration: none;
      border-radius: 5px;
    }
    .button:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome, ${username}!</h1>
    <p>Thank you for registering with us. Your tenant account has been successfully created.</p>
    <p>Please confirm your email address to activate your account by clicking the button below:</p>
    <a href="${`https://localhost:3001/`}" class="button">Confirm Registration</a>
    <p>If you did not register, please ignore this email or contact support for further assistance.</p>
    <div class="footer">
      <p>&copy; 2025 UsedCars Inc. All Rights Reserved.</p>
      <p>Need help? Contact our support team at <a href="mailto:support@usedcars.com">support@usedcars.com</a></p>
    </div>
  </div>
</body>
</html>

    `
}
