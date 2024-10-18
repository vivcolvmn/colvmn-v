# colvmn-v

Colvmn V is a user-owned cooperative social media platform centered around events. It allows users to discover and share upcoming events with friends, making social coordination easy and community-driven. Users can curate their event feeds, chat with friends, and enjoy a platform that promotes democratic ownership and transparency.

Colvmn V gives users ownership of the platform, fostering a sense of community and shared goals. Built for event lovers, it empowers users to find, organize, and share events with friends, with full control over their data and content.

### Why Is This Important To Me?
Co-operatives are a sustainable model for what can replace capitalism. Through co-operative models, we can collectivize, organize, and strategize to reclaim land, resources, and seize the means of production for the working class. The need for this collective action will only grow stronger as AI becomes more advanced and displaces larger and larger pools of labor. This is why this is important to me, because this is how we destroy white supremacy, capitalism, and the ruling class.

### Tools/Frameworks
PERN Stack: PostgreSQL, Express, React, Node.js
Authentication: Auth0 for user registration/login and access control.
Event Data: Songkick API for pulling event data, venues, artists, etc.
Frontend: Styled with CSS, following the black, white, and red color scheme with sans serif fonts.
Additional Libraries: Socket.IO for real-time chat, React Router for navigation, JWT for authentication, concurrently, cors, dotenv.

### Wireframes
![Wireframes](https://share.balsamiq.com/c/53gy9M1gCbFr5NsxUJMSrA.jpg)

### User Capabilities
-Registration:
Users create an account with username, email, and password.
Redirect to login if they are existing users.
-Home Page:
Shows upcoming events for the user and their friends.
Each event will include: date, artist, venue name, venue address, time, and cost.
Users can like events to save them to their own list.
Users can post, edit, and delete their own events.
-Friends List:
Add, delete, or block friends.
View friends’ event lists.
-Chat/Message:
Real-time chat with friends, showing message history.
-Profile Page:
Profile picture, “user since” date, quote, bio.
Display upcoming events posted by the user.
Settings to edit profile details (profile pic, bio, etc.).

### Additional Nice-to-Have Features
Real-time Notifications: Alerts for upcoming events or new messages.
Event Reminders: Set reminders for events added to the user’s list.
Friend Recommendations: Suggest friends based on mutual events.
Map Integration: Display venue locations using Google Maps or Mapbox.
User Badges: Reward active users with badges or points.
New User Tutorial: Walk user through initial profile setup and basic app features

### Technical Risks
Scalability: Handling large datasets of events and ensuring performance remains optimal.
Real-Time Features: Challenges around implementing real-time chat and notifications.
Data Integrity: Ensuring event data from Songkick syncs well with local data and remains up-to-date.

### User Flow & Interaction
New User: Registration > Home Page (with empty event list) > Add Events > Explore Friends > Chat.
Existing User: Login > Home Page (see events feed) > Like/Save Events > Add/Edit Events > Check Messages/Chat.
Profile Management: Profile Page > Update Bio/Settings > View/Manage Personal Event List.
Friend Management: Friends Page > Add/Delete/Block Friends > See Friends’ Events.