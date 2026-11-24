# Expense Tracker: Viva Notes

## How one request travels through the app

1. **React** shows a page and gathers what the user types.
2. **Axios** sends that information to the backend URL stored in `VITE_API_URL`.
3. An **Express route** matches the URL and HTTP method, such as `POST /api/expenses`.
4. The route calls a **controller**, which checks the input and decides what to do.
5. A **Mongoose model** reads or writes the data in **MongoDB**.
6. The controller sends a JSON response back through Express. Axios receives it, and React updates the page.

## What is CORS?

CORS means Cross-Origin Resource Sharing. A browser uses it to check whether a webpage on one address is allowed to call an API on another address. This project lets the address in `FRONTEND_URL` make requests to the backend.

## What is a JWT?

JWT means JSON Web Token. After login, the server creates a signed token that proves the user logged in. The browser sends the token in the `Authorization` header when it asks for private data. The server checks its signature before allowing access.

## What is `.env`?

A `.env` file holds settings that change between computers and deployments, such as a database address or secret key. The server loads its settings with `dotenv`. Vite exposes frontend settings whose names start with `VITE_`. Real `.env` files are ignored by Git so private values are not uploaded.

## How does authentication work here?

During signup, bcryptjs hashes the password and MongoDB stores the hash instead of the original password. During login, bcryptjs checks the typed password against that hash. If it matches, the backend sends a JWT. The frontend stores that token in local storage and Axios adds it to protected requests. The authentication middleware verifies it and identifies the account. Expense queries also filter by that account's user ID.

## Likely viva questions

1. **What does this project do?**  
   It lets a user create an account and manage their own expenses.

2. **What is React used for?**  
   React builds the interactive pages shown in the browser.

3. **What does Vite do?**  
   Vite runs the frontend during development and builds its production files.

4. **Why do we use Express?**  
   Express helps define backend URLs and handle web requests.

5. **What is MongoDB?**  
   MongoDB is a database that stores information as documents.

6. **What is Mongoose?**  
   Mongoose helps Node.js describe, validate, and work with MongoDB data.

7. **Why are passwords hashed?**  
   Hashing avoids saving the user's original password in the database.

8. **What does bcryptjs do?**  
   It securely hashes passwords and checks a password against its saved hash.

9. **What does JWT stand for?**  
   JSON Web Token; it is a signed token used to prove a user is logged in.

10. **Where does the frontend keep the token?**  
    In browser local storage, under the key `token`.

11. **What does authentication middleware do?**  
    It checks the token before a private route is allowed to run.

12. **What is an API endpoint?**  
    It is an address and HTTP method that the frontend can use to ask the backend to do something.

13. **What is Axios used for?**  
    Axios sends HTTP requests from the React app to the backend.

14. **What is CORS?**  
    It is a browser security rule that controls which web addresses may call an API.

15. **Why does each expense have a user ID?**  
    The user ID links the expense to its owner so each person only sees their own records.
