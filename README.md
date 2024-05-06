# Twitter Clone

This project is a clone of Twitter, built using modern technologies like React, FastAPI, JWT Authentication, and TailwindCSS.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **FastAPI**: A modern, fast (high-performance), web framework for building APIs with Python 3.6+ based on standard Python type hints.
- **JWT Authentication**: JSON Web Tokens are used for securely transmitting information between parties as a JSON object.
- **TailwindCSS**: A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup.
- **Postgresql**: PostgreSQL is an advanced, enterprise-class open-source relational database that supports both SQL (relational) and JSON (non-relational) querying.

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- Node.js
- Python 3.6 or higher
- pip

### Installation

1. Clone the repo
2. Install NPM packages (npm install in /frontend directory)
3. Install Python dependencies (pip install -r requirements.txt in /backend directory)
5. Create a postgresql database and a user in postgres if u haven't done it (remember the credentials + db_name u will need it in the next step)
6. Setup the ENV variables (see ENV below)
7. After installing start the backend (uvicorn main:app --reload cd in /backend DIR)
8. After installing start the frontend (npm start in cd in /frontend DIR)

 ##ENV
 BACKEND: Create a .env in /backend DIR and add these variables
DB_USER=place here ur postgres username
DB_PSSWD=place here ur postgres psswd
DB_HOST=place here ur postgres host (probably LOCALHOST if u run it locally)
DB_NAME=place here ur postgres db_name
 

## Usage

After starting the React and FastAPI servers, open your web browser and navigate to `http://localhost:3000` to start using the Twitter clone!

## Contributing

If u want to add some features to this project or fix a bug follow these steps.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements

- [React](https://reactjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [JWT](https://jwt.io/)
- [TailwindCSS](https://tailwindcss.com/)
