const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
const { dbUrl, jwtSecret, refressSecret } = require("../../config/setting");
const User = require("../../models/user/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const redis = require("redis");
const sessionStore = require("../../db/sessionConnact");
const createMailOptions = require("../../email/mailOptions");
const transporter = require("../../email/mailTransporter");
// const Mailgenerator = require('../mail/mailgenerator');


const signUp = async (req, res) => {
  const { firstName, lastName, email, password, username } = req.body;
  if (!firstName || !lastName || !email || !password || !username) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please Provide Required Information",
      statusCode: StatusCodes.BAD_REQUEST,
      status: ReasonPhrases.BAD_REQUEST,
    });
  }

  const hash_password = await bcrypt.hash(password, 10);

  const userData = {
    firstName,
    lastName,
    email,
    hash_password,
    username,
  };

  const user = await User.findOne({ email });
  const userId = await User.findOne({ username });

  // let MailGenerator = new Mailgen({
  //   theme: "default",
  //   product: {
  //     name: "kishor",
  //     link: "https://google.com",
  //   },
  // });

  if (user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: `User with email ${user.email} already registered`,
      statusCode: StatusCodes.BAD_REQUEST,
      status: ReasonPhrases.BAD_REQUEST,
    });
  } else if (userId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: `User Id ${userId.username} is already taken`,
      statusCode: StatusCodes.BAD_REQUEST,
      status: ReasonPhrases.BAD_REQUEST,
    });
  } else {
    const token = jwt.sign(
      {
        email: userData.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    User.create({
      ...userData,
      confirmToken: token,
      isEmailconfirm: false,
    }).then((data, err) => {
      if (err)
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: err.message,
          statusCode: StatusCodes.BAD_REQUEST,
          status: ReasonPhrases.BAD_REQUEST,
        });
      else {
        let mailBody = {
          body: {
            name: data.fullName,
            intro: `Welcome to ${process.env.APPLICATION_NAME}! We are excited to have you on board.`,
            additionalInfo: `Thank you for choosing ${process.env.APPLICATION_NAME}. You now have access to our premium features, including unlimited storage and priority customer support.`,
            action: {
              instructions: `To get started with ${process.env.APPLICATION_NAME}, please click here:`,
              button: {
                color: "#22BC66", // Optional action button color
                text: "Confirm Your Account",
                link: `${process.env.LOGINHOST}/${process.env.CLIENTCONFIRMURL}?token=${token}`,
              },
            },
            outro:
              "Need help, or have questions? Just reply to this email, we'd love to help.",
          },
        };
        transporter
          .sendMail(
            createMailOptions(
              "salted",
              data.email,
              `Welcome to ${process.env.APPLICATION_NAME} - Confirm Your Email`,
              mailBody
            )
          )
          .then(() => {
            res.status(StatusCodes.CREATED).json({
              message: "User created Successfully",
              status: ReasonPhrases.CREATED,
              statusCode: StatusCodes.CREATED,
            });
          })
          .catch((error) => {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
              message: error.message,
              statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
              status: ReasonPhrases.INTERNAL_SERVER_ERROR,
            });
          });
      }
    });
  }
};

const signIn = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please enter email and password",
        statusCode: StatusCodes.BAD_REQUEST,
        status: ReasonPhrases.BAD_REQUEST,
      });
    }

    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.hash_password
      );

      if (isPasswordValid) {
        const LoggedinUser = await User.findOne(
          { email: req.body.email },
          "_id role firstName lastName username email profilePicture contactNumber "
        );
        const {
          firstName,
          lastName,
          username,
          email,
          profilePicture,
          contactNumber,
        } = LoggedinUser;
        const accessToken = jwt.sign(
          {
            user_id: LoggedinUser.id,
            role: LoggedinUser.role,
            email: LoggedinUser.email,
            username: LoggedinUser.username,
          },
          jwtSecret,
          {
            expiresIn: "15m",
          }
        );

        // Generate a refresh token (for extended sessions)

        const refreshToken = jwt.sign(
          { username: LoggedinUser.username, userId: LoggedinUser.id },
          refressSecret,

          {
            expiresIn: "7d",
          }
        );

        const id_token = jwt.sign(
          {
            firstName,
            lastName,
            username,
            email,
            profilePicture,
            contactNumber,
          },
          refressSecret,

          {
            expiresIn: "30d",
          }
        );

        res.status(StatusCodes.OK).json({
          access_token: accessToken,
          token_type: "Bearer",
          id_token,
          refresh_token: refreshToken,
          expires_in: 900000, // 15 minutes in seconds
          statusCode: StatusCodes.OK,
          status: ReasonPhrases.OK,
        });
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Password is invalid!",
          statusCode: StatusCodes.UNAUTHORIZED,
          status: ReasonPhrases.UNAUTHORIZED,
        });
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Inavalid User Name!",
        statusCode: StatusCodes.BAD_REQUEST,
        status: ReasonPhrases.BAD_REQUEST,
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      status: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refresh_token, session_id } = req.body;

    if (
      !tokens[session_id] ||
      tokens[session_id].refreshToken !== refresh_token
    ) {
      return res.status(401).send("Invalid refresh token");
    }

    const accessToken = jwt.sign(
      { username: tokens[session_id].accessToken.username, userId: session_id },
      secretKey,
      {
        expiresIn: "15m",
      }
    );

    tokens[session_id].accessToken = accessToken;

    res.json({
      access_token: accessToken,
      expires_in: "15m",
      token_type: "Bearer",
    });
  } catch (error) {}
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid or expired token",
        statusCode: StatusCodes.BAD_REQUEST,
        status: ReasonPhrases.BAD_REQUEST,
      });
    } else {
      let mailBody = {
        body: {
          name: user.fullName,
          intro: "Your password has been successfully reset.",
          action: {
            instructions: `You can now log in to your account with your new password.`,
            button: {
              color: "#22BC66", // Optional action button color
              text: "Login Now",
              link: `${process.env.LOGINHOST}/${process.env.CLIENTLOGINPAGE}`,
            },
          },
          outro:
            "If you did not request this, please ignore this email and your password will remain unchanged.",
        },
      };
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds
      user.hash_password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;

      await user.save();

      transporter
        .sendMail(
          createMailOptions(
            "salted",
            user.email,
            `Password reset successfully`,
            mailBody
          )
        )
        .then(() => {
          res.status(StatusCodes.OK).json({
            message: "Password reset successfully",
            statusCode: StatusCodes.OK,
            status: ReasonPhrases.OK,
          });
        })
        .catch((error) => {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            status: ReasonPhrases.INTERNAL_SERVER_ERROR,
          });
        });
    }

    // Password reset successful
    // return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    // Handle error

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      status: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

const singout = async (req, res) => {
  try {
    const sessionId = req?.headers?.session_id;
    req.session.destroy((err) => {
      if (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: err.message,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          status: ReasonPhrases.INTERNAL_SERVER_ERROR,
          cause: err,
        });
      } else {
        // Successfully destroyed the session, now remove it from the database

        sessionStore.destroy(sessionId, (destroyErr) => {
          if (destroyErr) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
              message: error.message,
              statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
              status: ReasonPhrases.INTERNAL_SERVER_ERROR,
              cause: destroyErr,
            });
          } else {
            // Redirect to a logout success page or another route
            res.status(StatusCodes.OK).json({
              message: "Logout Success",
              statusCode: StatusCodes.OK,
              status: ReasonPhrases.OK,
            });
          }
        });
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      status: ReasonPhrases.INTERNAL_SERVER_ERROR,
      cause: error,
    });
  }
};

const varifySession = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Token Not Provided",
        statusCode: StatusCodes.UNAUTHORIZED,
        status: ReasonPhrases.UNAUTHORIZED,
      });
    } else {
      const tokenValue = token.split(" ")[1];
      const decodeduser = jwt.verify(tokenValue, jwtSecret);
      if (!decodeduser) {
        res.status(StatusCodes.FORBIDDEN).json({
          message: "Authorization Token is Not Valid",
          statusCode: StatusCodes.FORBIDDEN,
          status: ReasonPhrases.FORBIDDEN,
        });
      } else {
        await User.findOne(
          { _id: decodeduser.user_id },
          "_id role firstName lastName username email profilePicture contactNumber "
        ).then((data, err) => {
          if (err) {
            res.status(StatusCodes.UNAUTHORIZED).json({
              message: "Not Authorised",
              statusCode: StatusCodes.UNAUTHORIZED,
              status: ReasonPhrases.UNAUTHORIZED,
            });
          } else {
            const {
              firstName,
              lastName,
              username,
              email,
              profilePicture,
              contactNumber,
            } = data;
            const access_token = jwt.sign(
              {
                user_id: data.id,
                role: data.role,
                email: data.email,
                username: data.username,
              },
              jwtSecret,
              {
                expiresIn: "15m",
              }
            );
            const id_token = jwt.sign(
              {
                firstName,
                lastName,
                username,
                email,
                profilePicture,
                contactNumber,
              },
              refressSecret,
    
              {
                expiresIn: "30d",
              }
            );

            res.status(StatusCodes.OK).json({
              access_token,
              id_token,
              message: "Authorized",
              statusCode: StatusCodes.OK,
              status: ReasonPhrases.OK,
            });
          }
        });
      }
    }

    // Proceed with the protected route logic
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      status: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({
      email,
    });
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Email address is not registered",
        statusCode: StatusCodes.NOT_FOUND,
        status: ReasonPhrases.NOT_FOUND,
      });
    } else {
      const resetToken = jwt.sign(
        {
          user_id: user.id,
          role: user.role,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      const resetTokenExpiration = Date.now() + 3600000; // 1 hour

      const data = await User.updateOne(
        { email: req.body.email },
        {
          resetToken,
          resetTokenExpiration,
        }
      );
      if (!data) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "Reset password email generation failed",
          statusCode: StatusCodes.BAD_REQUEST,
          status: ReasonPhrases.BAD_REQUEST,
        });
      } else {
        let mailBody = {
          body: {
            name: user.fullName,
            intro:
              "You are receiving this because you (or someone else) have requested a password reset for your account.",
            action: {
              instructions: `Click on the following link to reset your password:`,
              button: {
                color: "#22BC66", // Optional action button color
                text: "Reset Password",
                link: `${process.env.LOGINHOST}/${process.env.CLIENTRESETPASSURL}?token=${resetToken}`,
              },
            },
            outro:
              "If you did not request this, please ignore this email and your password will remain unchanged.",
          },
        };

        transporter
          .sendMail(
            createMailOptions(
              "salted",
              user.email,
              `Password reset request`,
              mailBody
            )
          )
          .then(() => {
            res.status(StatusCodes.OK).json({
              message:
                "Password reset email has been sent successfully. Please check your mailbox",
              statusCode: StatusCodes.OK,
              status: ReasonPhrases.OK,
            });
          })
          .catch((error) => {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
              message: error.message,
              statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
              status: ReasonPhrases.INTERNAL_SERVER_ERROR,
            });
          });
      }
    }
  } catch (error) {
    // Handle error

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      status: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

const accountConfirm = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne(
      {
        confirmToken: token,
      },
      "email username _id firstName lastName"
    );

    if (!user) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid or expired token",
        statusCode: StatusCodes.BAD_REQUEST,
        status: ReasonPhrases.BAD_REQUEST,
      });
    } else {
      user.isEmailconfirm = true;
      await user.save();
      res.status(StatusCodes.OK).json({
        message: "Accoount Confirm successfully",
        statusCode: StatusCodes.OK,
        status: ReasonPhrases.OK,
        result: user,
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      status: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

const changedPassword = async (req, res) => {
  try {
    const { password, updated_user_id } = req.body;

    const user = await User.findOne({
      _id: updated_user_id,
    });

    if (!user) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid or expired token",
        statusCode: StatusCodes.BAD_REQUEST,
        status: ReasonPhrases.BAD_REQUEST,
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds
      user.hash_password = hashedPassword;
      await user.save();
      res.status(StatusCodes.OK).json({
        message: "Password Changed successfully",
        statusCode: StatusCodes.OK,
        status: ReasonPhrases.OK,
      });
    }

    // Password reset successful
    // return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    // Handle error

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      status: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

const getProfile = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "user id is not provide",
      statusCode: StatusCodes.BAD_REQUEST,
      status: ReasonPhrases.BAD_REQUEST,
    });
  } else {
    try {
      const userId = await User.findOne(
        { _id: id },
        "-__v -hash_password -resetToken -resetTokenExpiration -confirmToken -update_by"
      );

      if (userId.id) {
        return res.status(StatusCodes.OK).json({
          message: `Userdata data Loaded Successfully!`,
          statusCode: StatusCodes.OK,
          status: ReasonPhrases.OK,
          result: userId,
        });
      } else {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: `No information found for given id`,
          statusCode: StatusCodes.NOT_FOUND,
          status: ReasonPhrases.NOT_FOUND,
        });
      }
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
    }
  }
};

const getRefreshToken = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Token Not Provided",
        statusCode: StatusCodes.UNAUTHORIZED,
        status: ReasonPhrases.UNAUTHORIZED,
      });
    } else {
      const tokenValue = token.split(" ")[1];
      const decodeduser = jwt.verify(tokenValue, jwtSecret);

      if (!decodeduser) {
        res.status(StatusCodes.FORBIDDEN).json({
          message: "Authorization Token is Not Valid",
          statusCode: StatusCodes.FORBIDDEN,
          status: ReasonPhrases.FORBIDDEN,
        });
      } else {
        await User.findOne(
          { _id: decodeduser.user_id },
          "_id role firstName lastName username email profilePicture contactNumber "
        ).then(async (data, err) => {
          if (err) {
            res.status(StatusCodes.UNAUTHORIZED).json({
              message: "Not Authorized",
              statusCode: StatusCodes.UNAUTHORIZED,
              status: ReasonPhrases.UNAUTHORIZED,
            });
          } else {
            const decoderefresh = jwt.verify(req.body.token, refressSecret);
            await User.findOne(
              { _id: decoderefresh.userId },
              "_id role firstName lastName username email profilePicture contactNumber "
            ).then((newData,err) => {
              if (err) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                  message: "Not Authorized",
                  statusCode: StatusCodes.UNAUTHORIZED,
                  status: ReasonPhrases.UNAUTHORIZED,
                });
              } else {
                const token = jwt.sign(
                  {
                    user_id: newData.id,
                    role: newData.role,
                    email: newData.email,
                    username: newData.username,
                  },
                  jwtSecret,
                  {
                    expiresIn: "15m",
                  }
                );
                res.status(StatusCodes.OK).json({
                  token,
                  message: "Authorized",
                  statusCode: StatusCodes.OK,
                  status: ReasonPhrases.OK,
                });
              }
            });
          }
        });
      }
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      status: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = {
  signUp,
  signIn,
  resetPassword,
  singout,
  varifySession,
  changedPassword,
  forgetPassword,
  accountConfirm,
  getProfile,
  getRefreshToken,
};
