# Project Title

This project is a personal portfolio website with a blog and an admin panel. It's built using Next.js and includes various features for showcasing work, writing blog posts, and managing content.

## Table of Contents

- [Project Title](#project-title)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
- [Pages and URLs](#pages-and-urls)
  - [Frontend Pages](#frontend-pages)
  - [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd portfolio/jared
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file in the `jared` directory and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Usage

Navigate to `http://localhost:3000` (or your configured port) in your browser to view the application.

## Pages and URLs

### Frontend Pages

| URL                 | Description                                    |
| :------------------ | :--------------------------------------------- |
| `/`                 | The main landing page of the portfolio.        |
| `/login`            | User login page.                               |
| `/admin`            | Admin dashboard for managing content.          |
| `/admin/work`       | Page within the admin panel for managing work. |
| `/blogs`            | Displays a list of all blog posts.             |
| `/blogs/[slug]`     | Dynamic route for individual blog posts.       |

### API Endpoints

| Endpoint                  | Description                   |
| :------------------------ | :---------------------------- |
| `/api/auth/login`         | Handles user login.           |
| `/api/auth/logout`        | Handles user logout.          |
| `/api/auth/verify`        | Verifies user sessions.       |

## Technologies Used

- Next.js
- React
- Tailwind CSS
- Supabase (for authentication and database)

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License.
