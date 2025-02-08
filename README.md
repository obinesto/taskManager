# TaskManager
A simple and efficient task management application built with modern web technologies.

## Getting Started
To get started with the application, you need to set up the following environment variables:

- `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth client ID.
- `VITE_SENTRY_DSN`: Your Sentry DSN for error tracking.

## Front-End Technologies
- [Vite React](https://vitejs.dev/guide/)
- [Google OAuth](https://developers.google.com/identity)
- [Sentry](https://sentry.io/welcome/)
- [React Router](https://reactrouter.com/)
- [Redux](https://redux.js.org/)
- [React Query](https://react-query.tanstack.com/)
- [React Toastify](https://fkhadra.github.io/react-toastify/)
- [Cloudinary](https://cloudinary.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)



## Features
- User authentication with Google OAuth and JWT
- Robust profile management with user data, settings, password reset, email verification, and notifications management
- Task management with CRUD operations
- Mark tasks as complete or incomplete
- Filter tasks by status (all, active, completed)
- Responsive design for mobile and desktop use
- Error tracking with Sentry
- Cloudinary image upload and storage
- Framer Motion animations for a smooth user experience
- Lucide Icons for a consistent and modern design

## Overall Tech Stack
- **Frontend:** Vite React, Redux, Sentry, Cloudinary, React Router, React Query, React Toastify, Framer Motion, Lucide Icons
- **Backend:** Node.js with Express
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT), Google OAuth 2.0
- **Styling:** Tailwind CSS

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- MongoDB

### Installation
1. Clone the repository:
	```bash
	git clone https://github.com/obinesto/taskManager
	```
2. Navigate to the project directory:
	```bash
	cd task-manager
	```
3. Install dependencies:
	```bash
	npm install
	```
	or
	```bash
	yarn install
	```
4. Create a `.env` file in the root directory and add your backend API

5. Start the development server:
	```bash
	npm run dev
	```
	or
	```bash
	yarn dev
	```
6. Open your browser and navigate to `http://localhost:5173`

## Usage
- Register a new account or log in with existing credentials
- Add new tasks using the input field at the top of the page
- Click on a task to mark it as complete or incomplete
- Use the filter buttons to view all, active, or completed tasks

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Project Link
[TaskManager](https://task-manager-gules-nu.vercel.app/)
