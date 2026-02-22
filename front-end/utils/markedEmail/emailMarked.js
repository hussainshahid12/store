const emailMasked = (email) => {
  if (!email || !email.includes("@")) return "";

  const [username, domain] = email.split("@");

  // Keep first 2 characters visible
  const visiblePart = username.slice(0, 3);

  // Mask the rest
  const maskedPart = "*".repeat(Math.max(username.length - 2, 0));

  return `${visiblePart}${maskedPart}@${domain}`;
};

export default emailMasked;
