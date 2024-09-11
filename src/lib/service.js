const {
    jwtSecret,
    refressSecret,
  } = require("../config/setting");
  const jwt = require("jsonwebtoken");




const generateTokens = (user) => { 

    const {
        firstName,
        lastName,
        username,
        email,
        address,
        profilePicture,
        phoneNumber,
        role,
        id,
      } = user;

    const accessToken = jwt.sign(
        {
          id,
          role: role,
          email,
          username,
          name: firstName + " " + lastName,
        },
        jwtSecret,
        {
          expiresIn: "1d",
        }
      );

      // Generate a refresh token (for extended sessions)

      const refreshToken = jwt.sign(
        { username, userId: id },
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
          id,
          address,
          profilePicture,
          phoneNumber,
        },
        refressSecret,

        {
          expiresIn: "30d",
        }
      );


      return {
        id_token,refreshToken,accessToken
      }


 }


 module.exports = {
    generateTokens
  };
  