# Beneficiary Registration Portal

Welcome to the Beneficiary Registration Portal! This application is designed to facilitate the registration process for beneficiaries.

## Getting Started

### Prerequisites

- Node.js installed on your machine
- MySQL database server

### Cloning the Repository

Clone the repository to your local machine using Git:

```bash
git clone https://github.com/mojaloop/beneficiary-registration-portal.git
```

### Frontend (React)

#### Installation

Navigate to the frontend directory:

```bash
cd beneficiary-registration-portal/frontend
```

Install dependencies:

```bash
npm install
```

#### Building and Running

Build the app for production:

```bash
npm run build
```

Start the app:

```bash
npm run start
```

### Backend (Node.js)

#### Installation

Navigate to the backend directory:

```bash
cd beneficiary-registration-portal/backend
```

Install dependencies:

```bash
npm install
```

#### Database Setup

Ensure you have MySQL installed and running. Create a database named `brp`:

```bash
mysql -u your_username -p

CREATE DATABASE brp;
```

Then create a table named `tokens` with fields `token`, `psut`, and `status`:

```sql
USE brp;

CREATE TABLE tokens (
  token VARCHAR(255),
  psut VARCHAR(255),
  status VARCHAR(255)
);
```

#### Running the Server

Start the server:

```bash
npm run start
```

#### Running the project using docker-compose

Navigate to the root directory:

```bash
cd beneficiary-registration-portal/
```

Start the projects in docker by running this command:

```bash
docker-compose build

docker-compose up
```

To tear it down, run:

```bash
docker-compose down

```

## Usage

- Frontend: Access the portal by navigating to http://localhost:3007 in your web browser.
- Backend: The server is running on http://localhost:8080.
