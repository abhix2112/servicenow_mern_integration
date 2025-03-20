<<<<<<< HEAD
# servicenow_mern_integration
 A full-stack application integrating ServiceNow with a MERN stack, featuring OAuth authentication, HRSD onboarding, ITSM incident management, and ITAM asset tracking with real-time updates via WebSockets.
=======
ServiceNow MERN Integration 

_A full-stack application integrating ServiceNow with a MERN stack, featuring OAuth authentication, HRSD onboarding, ITSM incident management, and ITAM asset tracking with real-time updates via WebSockets._ 

🚀 Features 

✅ ServiceNow OAuth Authentication – Only ServiceNow users can log in. 

✅ HRSD Onboarding – Candidates can complete tasks, sign documents, and upload files. 

✅ ITSM Incident Management – Users can create incidents directly from the portal. 

✅ ITAM Asset & Software Tracking – Users can view and request assets/software. 

✅ Real-time Updates with WebSockets – Ensures instant synchronization of onboarding tasks. 

🛠 Tech Stack 

Backend: 

- Node.js & Express.js 

- ServiceNow REST API Integration 

- Servicenow Oauth authentication 

📌 Getting Started 

1️⃣ Clone the Repository 

```sh 
git clone https://github.com/your-username/servicenow-mern-integration.git 
cd servicenow-mern-integration 
``` 

2️⃣ Set Up Environment Variables 

Create a `.env` file in both the **backendts**: 

``` 
SERVICENOW_INSTANCE= your instance
CLIENT_ID= your client id
CLIENT_SECRET= your client secret
REDIRECT_URI= your callback url
SESSION_SECRET= your_secret_key
PORT= your port

``` 

3️⃣ Install Dependencies 

Backend 

```sh 
cd backend 
npm install 
``` 


4️⃣ Start the Project 

Backend 

```sh 
npm start 
``` 

🛠 API Endpoints 

Method 

Endpoint 

Description 

POST 

/auth/login 

ServiceNow OAuth Login 

GET 

/hrsd/onboarding/tasks 

Fetch user onboarding tasks 

POST 

/hrsd/onboarding/task/update 

Mark task as completed & upload attachment 

GET 

/itsm/incidents 

Fetch user incidents 

POST 

/itsm/incidents/create 

Create a new ITSM incident 

GET 

/itam/assets 

Fetch user assets & software 

POST 

/itam/request 

Request a new asset/software 

📢 WebSockets (Real-Time Updates) (Working on it)

- incidentCreated → Notifies users when a new incident is created. 

📜 License 

This project is licensed under the **MIT License** – feel free to use and modify it. 
>>>>>>> 3abb582 (Initial Commit - Servicenow MERN Integration Project)
