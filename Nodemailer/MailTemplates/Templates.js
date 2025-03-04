//this templates should not be async (promise returned function )
//Template for the registration OTP : 
const registerOtpTemplate = (fullName, Otp) => { 
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 90%;
            max-width: 600px;
            margin: auto;
            background: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 10px 0;
        }
        .content {
            margin: 20px 0;
            font-size: 16px;
            line-height: 1.5;
        }
        .expiry {
            color: red;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>OTP Verification</h2>
        </div>
        <div class="content">
            <p>Dear ${fullName},</p>
            <p>Your OTP code is <strong>${Otp}</strong>. This code will expire in <span class="expiry">10 minutes</span>.</p>
        </div>
        <div class="footer">
            <p>If you did not request this code, please ignore this email.</p>
        </div>
    </div>
</body>
</html>

`;
};


//template for the registration successfull : 
const AfterConformRegisterEmail = (Fullname) =>{
    return `
    <!DOCTYPE html>  
<html lang="en">  
<head>  
    <meta charset="UTF-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
    <style>  
        body {  
            font-family: Arial, sans-serif;  
            background-color: #f4f4f4;  
            margin: 0;  
            padding: 20px;  
        }  
        .container {  
            background-color: #ffffff;  
            padding: 20px;  
            border-radius: 5px;  
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);  
        }  
        .header {  
            text-align: center;  
            color: #4CAF50;  
        }  
        .message {  
            margin: 20px 0;  
            font-size: 16px;  
            color: #333333;  
        }  
        .button {  
            display: inline-block;  
            padding: 10px 15px;  
            margin: 10px 0;  
            background-color: #4CAF50;  
            color: white;  
            text-decoration: none;  
            border-radius: 5px;  
        }  
    </style>  
</head>  
<body>  
    <div class="container">  
        <h1 class="header">Registration Successful!</h1>
        <p>Dear ${Fullname} , </p>  
        <p class="message">Thank you for registering. Your account has been created successfully.</p>  
        <a href="https://www.yourwebsite.com" class="button">Go to Dashboard</a>  
    </div>  
</body>  
</html>  
    `
}


//template for the login OTP : 
const LoginOtpTemplate = (fullname , otp) =>{
    return `
    <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>login OTP Verification</title>
  
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
    </head>
    <body
      style="
        margin: 0;
        font-family: 'Poppins', sans-serif;
        background: #ffffff;
        font-size: 14px;
      "
    >
      <div
        style="
          max-width: 680px;
          margin: 0 auto;
          padding: 45px 30px 60px;
          background: #f4f7ff;
        //   background-image: url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner);
          background-repeat: no-repeat;
          background-size: 800px 452px;
          background-position: top center;
          font-size: 14px;
          color: #434343;
        "
      >
        <header>
          <table style="width: 100%;">
            <tbody>
              <tr style="height: 0;">
                <td>
                //   <img
                //     alt=""
                //     height="30px"
                //   />
                </td>
                <td style="text-align: right;">
                  <span
                    style="font-size: 16px; line-height: 30px; color: #ffffff;"
                    ></span
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </header>
  
        <main>
          <div
            style="
              margin: 0;
              margin-top: 70px;
              padding: 92px 30px 115px;
              background: #ffffff;
              border-radius: 30px;
              text-align: center;
            "
          >
            <div style="width: 100%; max-width: 489px; margin: 0 auto;">
              <h1
                style="
                  margin: 0;
                  font-size: 24px;
                  font-weight: 500;
                  color: #1f1f1f;
                "
              >
                Your OTP
              </h1>
              <p
                style="
                  margin: 0;
                  margin-top: 17px;
                  font-size: 16px;
                  font-weight: 500;
                "
              >
                Hey ${fullname},
              </p>
              <p
                style="
                  margin: 0;
                  margin-top: 17px;
                  font-weight: 500;
                  letter-spacing: 0.56px;
                "
              >
                Thank you for choosing UsedCars Company. Use the following OTP
                to complete the procedure to change your email address. OTP is
                valid for
                <span style="font-weight: 600; color: #1f1f1f;">10 minutes</span>.
                Do not share this code with others, including usedcars
                employees.
              </p>
              <p
                style="
                  margin: 0;
                  margin-top: 60px;
                  font-size: 40px;
                  font-weight: 600;
                  letter-spacing: 25px;
                  color: #ba3d4f;
                "
              >
                ${otp}
              </p>
            </div>
          </div>
  
          <p
            style="
              max-width: 400px;
              margin: 0 auto;
              margin-top: 90px;
              text-align: center;
              font-weight: 500;
              color: #8c8c8c;
            "
          >
            Need help? Ask at
            <a
              href="mailto:marojuajay@techpixe.com"
              style="color: #499fb6; text-decoration: none;"
              >usedcars@gmail.com</a
            >
            or visit our
            <a
              href=""
              target="_blank"
              style="color: #499fb6; text-decoration: none;"
              >Help Center</a
            >
          </p>
        </main>
  
        <footer
          style="
            width: 100%;
            max-width: 490px;
            margin: 20px auto 0;
            text-align: center;
            border-top: 1px solid #e6ebf1;
          "
        >
          <p
            style="
              margin: 0;
              margin-top: 40px;
              font-size: 16px;
              font-weight: 600;
              color: #434343;
            "
          >
            UsedCars Company
          </p>
          <p style="margin: 0; margin-top: 8px; color: #434343;">
            Address India, Hyderabad, Telangana.
          </p>
          <div style="margin: 0; margin-top: 16px;">
            <a href="" target="_blank" style="display: inline-block;">
              <img
                width="36px"
                alt="Facebook"
                src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
              />
            </a>
            <a
              href=""
              target="_blank"
              style="display: inline-block; margin-left: 8px;"
            >
              <img
                width="36px"
                alt="Instagram"
                src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
            /></a>
            <a
              href=""
              target="_blank"
              style="display: inline-block; margin-left: 8px;"
            >
              <img
                width="36px"
                alt="Twitter"
                src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter"
              />
            </a>
            <a
              href=""
              target="_blank"
              style="display: inline-block; margin-left: 8px;"
            >
              <img
                width="36px"
                alt="Youtube"
                src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube"
            /></a>
          </div>
          <p style="margin: 0; margin-top: 16px; color: #434343;">
            Copyright © 2022 Company. All rights reserved.
          </p>
        </footer>
      </div>
    </body>
  </html>
  
    `
  };

//Template for the forget password : 
const forgetPasswordTemplate = () =>{
  return `
 <!DOCTYPE html>  
<html lang="en">  
<head>  
    <meta charset="UTF-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
    <title>Forgot Password</title>  
    <style>
    body {  
    font-family: Arial, sans-serif;  
    background-color: #f4f4f4;  
    display: flex;  
    justify-content: center;  
    align-items: center;  
    height: 100vh;  
    margin: 0;  
}  

.container {  
    background: white;  
    padding: 20px;  
    border-radius: 5px;  
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);  
}  

h2 {  
    margin-bottom: 20px;  
}  

.form-group {  
    margin-bottom: 15px;  
}  

label {  
    display: block;  
    margin-bottom: 5px;  
}  

input[type="email"] {  
    width: 100%;  
    padding: 10px;  
    border: 1px solid #ccc;  
    border-radius: 5px;  
}  

.btn {  
    width: 100%;  
    padding: 10px;  
    background-color: #007bff;  
    color: white;  
    border: none;  
    border-radius: 5px;  
    cursor: pointer;  
}  

.btn:hover {  
    background-color: #0056b3;  
}  
    </style>  
</head>  
<body>  
    <div class="container">  
        <h2>Forgot Password</h2>  
        <form action="/reset-password" method="POST">  
            <div class="form-group">  
                <label for="email">Email Address</label>  
                <input type="email" id="email" name="email" required>  
            </div>  
            <button type="submit" class="btn">Reset Password</button>  
        </form>  
    </div>  
</body>  
</html>  
  `
}  
module.exports = {registerOtpTemplate , AfterConformRegisterEmail, LoginOtpTemplate, forgetPasswordTemplate};
