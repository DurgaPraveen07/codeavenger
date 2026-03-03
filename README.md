# ROBO AI - Voice Assistant

A web-based voice assistant with an animated robot face that listens to your questions and provides spoken answers using the Gemini AI.

## 🚀 Deployment Requirements (Vercel)

To run this project on Vercel, you need:

1.  **Node.js Version:** 18.x or higher (Vercel handles this automatically).
2.  **Environment Variable:**
    *   `VITE_GEMINI_API_KEY`: Your Google Gemini API Key.
    *   Get one at: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

## 🛠️ Local Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Set Environment Variables:**
    Create a `.env` file in the root directory and add:
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```
3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## 📦 Vercel Deployment Steps

1.  Push this code to a GitHub repository.
2.  Connect your GitHub account to Vercel.
3.  Import the repository.
4.  **Crucial:** Add the Environment Variable `VITE_GEMINI_API_KEY` in the Vercel dashboard during the import process.
5.  Click **Deploy**.

## 📄 Project Structure

*   `src/`: Contains the React source code.
*   `public/`: Static assets.
*   `vercel.json`: Configuration for SPA routing on Vercel.
*   `package.json`: Project dependencies and build scripts.
