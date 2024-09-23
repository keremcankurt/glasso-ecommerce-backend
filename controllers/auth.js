const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers");
const CustomError = require("../helpers/error/CustomError");
const User = require("../models/User");
const {
  validateUserInput,
  comparePassword,
} = require("../helpers/input/inputHelpers");
const sendEmail = require("../helpers/libraries/sendEmail");

const register = (async (req, res, next) => {
  const infos = req.body;
  const email = req.body.email;
  const inactiveUser = await User.findOne({
    email,
  });
  if (inactiveUser) {
    if (
      !inactiveUser.isAccountConfirmed &&
      inactiveUser.tempTokenExpire > Date.now()
    ) {
      return next(
        new CustomError(
          "Your account already created, please check your email to confirm your account",
          400
        )
      );
    } else if (
      !inactiveUser.isAccountConfirmed &&
      inactiveUser.tempTokenExpire <= Date.now()
    ) {
      inactiveUser.remove();
    }
  }

  const user = await User.create({
    ...infos,
  });
  const registerUserToken = user.getTempTokenFromUser();

  const confirmAccountUrl = `${process.env.CLIENT_URL}/confirmaccount/?registerUserToken=${registerUserToken}&id=${user._id}`; //değiştirilecek
  const emailTemplate = `
  <div style="font-family: Arial, sans-serif; color: #333;">
      <h3 style="color: #007bff;">Glasso Hesap Onayı</h3>
      <p>Merhaba,</p>
      <p>Hesabınızı oluşturduğunuz için teşekkür ederiz! Gözlük koleksiyonumuzu keşfetmek için hazırsınız.</p>
      <p>Hesabınızı onaylamak için lütfen aşağıdaki bağlantıya tıklayın:</p>
      <p>
          <a href='${confirmAccountUrl}' target='_blank' style="color: #fff; background-color: #007bff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">
              Hesabınızı Onaylayın
          </a>
      </p>
      <p style="font-size: 0.9em; color: #777;">Bu bağlantı 1 saat içinde geçerliliğini yitirecektir.</p>
      <p>Keyifli alışverişler dileriz!</p>
      <p>Sevgiyle,<br>Glasso Ekibi</p>
  </div>
`;


  try {
    
    await sendEmail({
      from: process.env.SMTP_ADMIN,
      to: email,
      subject: "Confirm Your Account",
      html: emailTemplate,
    });
    await user.save();
    return res.status(200).json({
      message: "Token Sent To Your Email",
    });
  } catch (err) {
    return next(new CustomError("Email Could Not Be Sent", 500));
  }
});

const confirmAccount = (async (req, res, next) => {
  try {
    const { registerUserToken, id } = req.query;
  const isUserActive = await User.findOne({
    _id: id,
    isAccountConfirmed: true,
  });
  if (isUserActive) {
    return next(new CustomError("Hesabınız zaten aktif edildi.", 400));
  }
  if (!registerUserToken) {
    return next(new CustomError("Please provide a valid token.", 403));
  }

  const user = await User.findOne({
    tempToken: registerUserToken,
    tempTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    const user = await User.findOne({
      tempToken: registerUserToken,
    });
    if (user) {
      await user.remove();
    }
    return next(new CustomError("Bir hata meydana geldi.", 404));
  }
  user.isAccountConfirmed = true;
  user.tempToken = undefined;
  user.tempTokenExpire = undefined;
  await user.save();
  return res.status(200).json({
    message: "Hesabınız Başarıyla Onaylandı.",
  });
  } catch (error) {
    next(error)
  }
  
});

const login = (async (req, res, next) => {
  const { email, password } = req.body;
  if (!validateUserInput(email, password)) {
    return next(new CustomError("Please check your inputs", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!comparePassword(password, user.password)) {
    return next(new CustomError("Please check your credentials", 400));
  }
  sendJwtToClient(user, res);
});

const logout = async (req, res, next) => {
  res.clearCookie("access_token");
  return res
    .status(200)
    .clearCookie('access_token', {
      httpOnly: true,
      secure: true, // sadece HTTPS üzerinden gönderilmesi için
      sameSite: 'none', // üçüncü taraf isteklerde bile cookie'nin gönderilmesini sağlar
      path: '/' // cookie'nin kök dizinde tanımlı olduğundan emin olun
    })
    .json({
      message: 'Logged out successfully',
    });
};


const forgotPassword = (async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({
    email,
  });
  const forgotPasswordToken = user.getTempTokenFromUser();

  const forgotPasswordUrl = `${process.env.CLIENT_URL}/forgot-password/change/?forgotPasswordToken=${forgotPasswordToken}`; //değiştirilecek
  const emailTemplate = `
  <div style="font-family: Arial, sans-serif; color: #333;">
      <h3 style="color: #007bff;">Şifremi Unuttum</h3>
      <p>Merhaba,</p>
      <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
      <p>
          <a href='${forgotPasswordUrl}' target='_blank' style="color: #fff; background-color: #007bff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">
              Şifrenizi Sıfırlayın
          </a>
      </p>
      <p style="font-size: 0.9em; color: #777;">Bu bağlantı 1 saat içinde geçerliliğini yitirecektir.</p>
      <p>Keyifli alışverişler dileriz!</p>
      <p>Sevgiyle,<br>Glasso Ekibi</p>
  </div>
`;


  try {
    await user.save();
    await sendEmail({
      from: process.env.SMTP_ADMIN,
      to: email,
      subject: "Change Your Password",
      html: emailTemplate,
    });
    return res.status(200).json({
      message: "Email was sent successfully"
    });
  } catch (err) {
    next(err)
  }
});

const changePassword = (async (req, res, next) => {
  try {
    const { password, token } = req.body;
    if (!token) {
      return next(new CustomError("Please provide a valid token.", 403));
    }
    const user = await User.findOne({
      tempToken: token,
      tempTokenExpire: { $gt: Date.now() },
    });
    if (!user) {
      return next(new CustomError("Invalid Token or Session Expired", 404));
    }
    user.tempToken = undefined;
    user.tempTokenExpire = undefined;
    user.password = password;
    await user.save();
  
    res.status(200).json({
      message: 'Your password has been changed successfully'
    });
  } catch (error) {
    next(error)
  }
});


module.exports = {
  register,
  login,
  logout,
  confirmAccount,
  forgotPassword,
  changePassword,
};
