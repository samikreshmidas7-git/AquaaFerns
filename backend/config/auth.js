const authorizedEmails = [
  // Add your shop staff emails here
  // Example:
  // "manager@gmail.com",
  // "staff1@gmail.com"
  "samik10@aquaaferns.com"
];

const isAuthorizedEmail = (email) => {
  return authorizedEmails.includes(email);
};

module.exports = { authorizedEmails, isAuthorizedEmail };
