import validator from 'validator';

//validates user registration input
export function validateRegistration({ name, email, password }) 
{
  const errors = {};
  if (!name || name.trim().length < 2 || name.trim().length > 50) {
    errors.name = 'name must be between 2 and 50 characters';
  }
  if (name && !/^[a-zA-Z\s]+$/.test(name.trim())) {
    errors.name = 'name can only contain letters and spaces';
  }
  if (!email || !validator.isEmail(email)) {
    errors.email = 'invalid email format';
  }
  if (!password || password.length < 8) {
    errors.password = 'password must be at least 8 characters';
  }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (password && !passwordRegex.test(password)) {
    errors.password = 'password must contain uppercase, lowercase, number, and special character';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

//validates login input
export function validateLogin({ email, password }) {
  const errors = {};
  if (!email || !validator.isEmail(email)) {
    errors.email = 'invalid email format';
  }
  if (!password) {
    errors.password = 'password is required';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}