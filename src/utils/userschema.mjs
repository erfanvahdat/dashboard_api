
export const userSchema = {
  name: {
    isLength: {
      options: { min: 5, max: 10 },
      errorMessage: "Username must be at least 5 characters and a max of 10 characters",
    },
    isString: {
      errorMessage: "Name must be a string",
    },
  },
  display_name: {
    isString: {
      errorMessage: "Display name must be a string",
    },
  },
};
