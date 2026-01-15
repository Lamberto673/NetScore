# NetScore 

NetScore is a dynamic social feed application that lets users share thoughts, interact with posts through a voting system, and manage content in real-time. Designed with a clean, responsive UI and a focus on user interaction.

## Key Features

* **Post Updates:** Share your thoughts instantly with the community using the "What's on your mind?" input.
* **Voting System:** * **Upvote:** Show support for posts you like.
    * **Downvote:** Push irrelevant content down.
    * *Real-time score tracking.*
* **Content Management:** A dedicated **Delete** button allows for immediate removal of posts (useful for moderation or cleaning up).
* **Dark & Light Mode:** Toggle between themes using the settings (⚙️) icon to suit your visual preference.
* **User Sessions:** Personalized greeting ("Hi [Name]") and session persistence using LocalStorage.

## Tech Stack

**Frontend:**
* React.js
* Vite (Fast tooling)
* CSS (Custom styling for Dark/Light themes)

**Backend:**
* Node.js & Express
* Prisma (ORM)
* Database (PostgreSQL/MySQL)

### Prerequisites
* Node.js installed
* A database instance (e.g., Postgres) running

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/netscore.git](https://github.com/yourusername/netscore.git)
    cd netscore
    ```

2.  **Install Dependencies**
    ```bash
    # Install server dependencies
    cd server
    npm install

    # Install client dependencies
    cd ../client
    npm install
    ```

3.  **Setup Database**
    Configure your `.env` file with your database URL and run migrations:
    ```bash
    npx prisma migrate dev
    ```

4.  **Run the App**
    ```bash
    # Start Backend
    npm run start

    # Start Frontend (in a new terminal)
    npm run dev
    ```

## 📸 How It Works

1.  **Login:** Enter your username to start a session. The app remembers you!
2.  **Post:** Type your content and hit **Post**. It appears instantly in the feed.
3.  **Vote:** Click the **Up arrow** or **Down arrow** to influence the post's score.
4.  **Theme:** Click the Gear ⚙️ icon to switch between that sleek Dark Mode and Light Mode.
5.  **Delete:** Click the red **Trash Can** icon to remove a post permanently.

---

Made with ❤️ and Vibecoding.
