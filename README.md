# 💳 Credit Eligibility Web Application

This is a simple web project developed for the **Web Development** course. It simulates a credit analysis service for a financial institution. The application receives client data, determines available credit options based on predefined business rules, and stores or updates the client data in a database.

## 📌 Features

- Determine available types of credit based on:
  - Client's income
  - Age
  - Location (city and state)
- Available credit types:
  - **Personal Credit** – 4% interest
  - **Payroll Credit** – 2% interest
  - **Secured Credit** – 3% interest
- Web interface using EJS templates
- Request validations and exception handling
- Database integration (create/update client data)

## 🚀 Technologies Used

- Node.js
- Express.js
- EJS (Embedded JavaScript templates)
- SQLite / PostgreSQL / MongoDB (any database of your choice)
- Bootstrap (optional, for styling)

## 📥 How It Works

### 1. POST Endpoint

`[POST] /creditos`

Accepts the following client data in the request body:

```json
{
  "name": "John Doe",
  "cpf": "12345678901",
  "age": 28,
  "income": 4500,
  "location": "RS"
}
```

### 2. Validation Rules
- Age must be greater than 18
- Cpf must be 11 digits and not empty
- Name and location cannot be empty
- Income must be greater than 2999

If validation fails, a custom error message is returned.

### 3. Views
📄 index.ejs
A form where users submit client data.

📄 result.ejs
Displays the client name and the list of available credit options.

If no credit is available, a message is shown.

📄 partials/header.ejs & footer.ejs
Reusable components included in all views.

## 🛠️ How to Run Locally
```
git clone https://github.com/your-username/credit-analysis-app.git
cd credit-analysis-app
npm install
npm start
```
Then open: http://localhost:3000

📚 Academic Purpose
This project was created for academic purposes as part of a Web Development course. It helps demonstrate:
- Server-side validation
- MVC architecture using Express and EJS
- Handling form submissions and responses
- Database CRUD operations
