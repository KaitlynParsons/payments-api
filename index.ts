import express from 'express';
import { paymentsRoutes } from "./payments/payments.route";

const app = express();
const PORT = 8000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use(paymentsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at https://localhost:${PORT}`);
});