import bcrypt from 'bcrypt';

// Hash password
export const hashpassword = async (password) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

// Compare password
export const comparepassword = async (plain, hashedPassword) => {
  return bcrypt.compareSync(plain, hashedPassword);  // Return the result of bcrypt comparison
};
