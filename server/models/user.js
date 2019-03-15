import bcrypt from 'bcrypt-nodejs';



export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter your name'
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter your username'
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter your email address'
      },
      unique: {
        args: true,
        msg: 'Email already exists'
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'Please enter a valid email address'
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter a password'
      },
      validate: {
        isNotStrong: (value) => {
          var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})");
          if (!strongRegex.test(value)) {
            throw new Error('Password should be at least 8 characters, must contain at least 1 lowercase alphabetical character, 1 uppercase alphabetical character, 1 numeric character, one special character');
          }
        },
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
      }  
    },
    country_code: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
      }
    },
    authyId: {
      type: DataTypes.STRING,
      allowNull: {
        args: true,
      }
    },
    google_2fa_secret: {
      type: DataTypes.TEXT,
      allowNull: {
        args: true
      }
    }
  }, {});


  User.beforeSave((user, options) => {
    if (user.changed('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    }
  });
  
  
  User.prototype.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (error, isMatch) {
        if (error) {
            return callback(error);
        }
        callback(null, isMatch);
    });
  };


  User.associate = (models) => {
    // associations can be defined here
  };
  
  
  return User;
};