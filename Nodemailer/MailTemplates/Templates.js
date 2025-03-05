//this templates should not be async (promise returned function )

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

//verification button after registration : 
const AccountConformationafterRegister = (Fullname) =>{
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
        <a href="{{verification_link}}" class="btn">Verify Your Email</a>
        <p class="footer">
            If you did not sign up for this account, please ignore this email.
        </p>
    </div>
</body>
</html>
  `
}
module.exports = {forgetPasswordTemplate, AccountConformationafterRegister};
