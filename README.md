# FeedmeDaddy 

FeedmeDaddy is a modern, responsive web application designed to help you curate your YouTube feed without losing your mind. It analyzes your subscriptions, liked videos, and watch history to discover healthier, smarter, and more meaningful content, providing AI-curated video recommendations tailored just for you.

##  Features

- **Dashboard**: A beautifully designed, fully responsive dashboard to view your YouTube stats at a glance.
- **Smart Recommendations**: AI-curated "Surprise Me" video recommendations based on your unique interests.
- **Top Interests Chart**: Visual breakdown of your favorite topics (Technology, Science, Productivity, etc.).
- **Continue Watching**: Easily pick up where you left off with progress indicators for your recent videos.
- **Suggested Feeds**: Discover new curated channels that align with your watching habits.
- **Fully Responsive**: Seamlessly works on desktop, tablet, and mobile devices with a fluid, app-like experience.
- **Modern Authentication**: Secure Google Sign-In powered by `better-auth`.

##  Tech Stack

### Frontend (`/client`)
- **Framework**: Next.js (React 19)
- **Styling**: Tailwind CSS v4 + Vanilla CSS for custom scrollbars and animations
- **Animations**: Framer Motion
- **Auth**: `better-auth` client

### Backend (`/server`)
- **Framework**: Express.js (v5) + TypeScript
- **Database ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: `better-auth` server

##  Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- `pnpm` package manager
- PostgreSQL database

### 1. Clone the repository
```bash
git clone https://github.com/AarishMansur/feed-me-daddy.git
cd feed-me-daddy
```

### 2. Setup the Server
```bash
cd server
pnpm install

# Setup environment variables
# Create a .env file based on .env.example (if available) and add your Database URL and Auth secrets

# Run Prisma migrations
npx prisma db push

# Start the development server
pnpm dev
```

### 3. Setup the Client
Open a new terminal window:
```bash
cd client
pnpm install

# Setup environment variables
# Create a .env.local file with necessary keys (e.g., Google OAuth clientId/secret, NEXT_PUBLIC_API_URL)

# Start the Next.js development server
pnpm dev
```

### 4. Open the App
Visit [http://localhost:3000](http://localhost:3000) in your browser.

##  Responsive Design
The application has been carefully crafted to look great on all screen sizes:
- **Desktop**: Expansive dashboard with a fixed sidebar and multi-column grid layout.
- **Mobile**: The sidebar transforms into a slide-over menu with a backdrop. Complex grids gracefully degrade into swipeable horizontal scroll rows (`.scroll-row`) to maximize screen real estate and mimic native app behaviors.


##  License
This project is licensed under the ISC License.
