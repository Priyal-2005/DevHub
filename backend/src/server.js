require("dotenv").config();

const app = require("./app");
const authService = require("./services/auth.service");
const configurePassport = require("./config/passport");

configurePassport(authService);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`DevHub backend listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
