Schedulo Lite: Smart Session Booking MVP
This repository contains Schedulo Lite, a web-based system designed for mentors and students to schedule sessions. Key UI features include mentor availability management, student booking/cancellation, and real-time slot display. This project demonstrates user-friendly scheduling capabilities.

Features
Mentor Availability Management: Mentors can manage their available time slots.

Student Booking/Cancellation: Students can book and cancel sessions.

Real-time Slot Display: The UI shows available and booked slots in real-time.

User-Friendly Interface: Clean and intuitive design.


Technologies Used:

Frontend: React + tailwindcss

Backend: Node.js + Express

UI/UX: Basic styling


Setup Instructions

Clone the repository:

 git clone https://github.com/your-username/your-repo-name.git

Navigate to the project directory:

 cd your-repo-name

Install dependencies:

 npm install # or yarn install

Set up the backend:

 Navigate to the backend directory.

Start the server:

 node server.js # or npm start

Set up the frontend:

 Navigate to the frontend directory.

Start the application:

 npm run dev # or yarn dev.
 

Project Structure
├── backend/
│   ├── server.js
│   └── ...
├── frontend/
│   ├── index.html
│   ├── src/
│   └── ...
├── README.md
└── ...

Endpoints: 

GET /slots: Returns a list of time slots with booking status.

POST /book: Books a slot (requires name and time).

POST /cancel: Cancels a booking (requires time slot).


Future Improvements:

Database integration for persistent data storage.

Enhanced UI with a modern framework (e.g., React, Vue).

Authentication and authorization for user roles.

Additional features such as notifications and calendar integration.

![Screenshot 2025-05-19 222626](https://github.com/user-attachments/assets/d63b8496-89b1-43bd-ae39-5da5b7ddb88c)
![Screenshot 2025-05-19 215352](https://github.com/user-attachments/assets/2d3267d7-efc0-4162-82af-cefbbec26dae)
![Screenshot 2025-05-19 215330](https://github.com/user-attachments/assets/17bac53d-a175-47ff-a8ae-5a4f60140c86)
![Screenshot 2025-05-19 215251](https://github.com/user-attachments/assets/cb5b136e-90ff-46cc-905f-65b79878e02b)
![Screenshot 2025-05-19 215240](https://github.com/user-attachments/assets/34f6671c-c2e1-40d4-834a-accc7be8d186)

