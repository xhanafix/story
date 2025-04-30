# StorySell - Authentic Social Content Creator

A client-side web application that creates authentic, non-promotional social media content by naturally weaving your facts into engaging stories.

## Features

- Create authentic social content for Facebook, Instagram, and TikTok
- Focus on genuine storytelling rather than promotional messaging
- Input your topic and key facts to transform into natural, shareable content
- Choose between English or Bahasa Malaysia
- Copy generated content to clipboard with one click
- Modern, responsive design
- Browser-based API key storage (no need to edit files)

## Philosophy

StorySell believes in the power of authentic content. Instead of directly promoting products or services, we help create genuine stories that naturally incorporate key information. This approach creates more engagement, builds trust, and avoids triggering audience's "sales resistance."

The core idea: "Facts tell, stories sell" - but the selling should be invisible.

## Live Demo

[View Live Demo](https://your-username.github.io/storysell)

## Setup Instructions

### Prerequisites

- A modern web browser
- An OpenRouter API key (get one at [openrouter.ai](https://openrouter.ai))

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/your-username/storysell.git
   cd storysell
   ```

2. Configure your API key (two options):
   - **Option 1 (Recommended)**: Enter your API key directly in the browser interface and click "Save Key"
   - **Option 2**: Open `config.js` and replace `your_openrouter_api_key_here` with your actual OpenRouter API key

3. Launch a local server:
   - You can use any local development server, for example:
     - If you have Python installed: `python -m http.server`
     - If you have Node.js installed: `npx serve`
     - If you have VS Code: Use the Live Server extension

4. Open your browser and navigate to the local server address (typically http://localhost:8000 or similar)

### GitHub Pages Deployment

1. Create a new GitHub repository

2. Push your code to the repository:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/storysell.git
   git push -u origin main
   ```

3. IMPORTANT: Before deployment, add `config.js` to your `.gitignore` file to prevent exposing your API key:
   ```
   echo "config.js" >> .gitignore
   ```

4. Create a sample config file for users to reference:
   ```
   cp config.js config.sample.js
   ```
   Then edit `config.sample.js` to remove your actual API key.

5. Go to your repository settings on GitHub:
   - Navigate to "Settings" > "Pages"
   - Under "Source", select "main" branch
   - Click "Save"

6. Your site will be published at `https://your-username.github.io/storysell`

7. IMPORTANT NOTE FOR USERS: Users can enter their API key directly in the browser interface and save it locally. The key is stored in the browser's localStorage and not sent to any server.

## Security Considerations

- This app runs entirely client-side
- Your OpenRouter API key can be stored in your browser's localStorage
- The key is never sent to our servers, only directly to OpenRouter API
- For additional security, you can clear your browser's localStorage or use the "Reset" button
- Never commit your actual API key to public repositories

## License

MIT License

## Acknowledgments

- Uses OpenRouter.ai API for accessing advanced AI models
- Powered by Google's Gemini 2.0 Flash model

---

Made with ❤️ for better, more engaging social media content 