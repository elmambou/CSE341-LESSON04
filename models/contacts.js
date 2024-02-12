module.exports = (mongoose) => {
    const Contact = mongoose.model(
      'contacts',
      mongoose.Schema(
        {
          firstName: String,
          lastName: String,
          email: email,
          favoriteColor: String, 
          birthday: String,
        },
        { timestamps: true }
      )
    );
  
    return Contact;
  };
  