# Zero Two Minecraft Server Status

A beautiful Minecraft server status checker with Zero Two theme, featuring real-time server status monitoring and player statistics visualization.

## 🌟 Features

- Real-time Minecraft server status checking
- Player statistics graph with historical data
- Zero Two themed UI with animations
- Background music with toggle
- Responsive design for all devices
- No backend required - runs entirely in the browser

## 📁 Project Structure

```
serverstatus/
├── index.html          # Main status checker page
├── player-graph.html   # Player statistics page
├── style.css          # Main stylesheet
├── script.js          # Main page JavaScript
├── graph.js           # Graph page JavaScript
├── assets/            # Static assets directory
│   ├── images/        # Image files
│   │   ├── zero-two/  # Zero Two themed images
│   │   └── icons/     # UI icons
│   ├── music/         # Background music files
│   └── videos/        # Background video files
└── README.md          # This file
```

## 🎨 Adding Custom Assets

### Server Icons
- Place your custom server icons (PNG, 32x32 or 64x64 recommended) in `assets/images/icons/`.
- To use a custom icon for a server, name the file as `<server-ip>.png` (e.g., `heromc.net.png`).
- The app will automatically use the icon if it exists, otherwise it will fetch from the API or use a fallback.

### Zero Two Images
- Place Zero Two themed images or GIFs in `assets/images/zero-two/`.
- You can use these images for backgrounds, avatars, or decorative elements in the UI.
- Example usage: `<img src="assets/images/zero-two/your-image.png">`

### UI Icons
- Place UI-related icons (PNG, SVG, etc.) in `assets/images/icons/`.
- Reference them in your HTML or JS as needed.

### Music & Video
- Place music files in `assets/music/` and video files in `assets/videos/`.
- Update the source in your HTML/JS to use your custom files.

## 📁 Example Folder Structure
```
assets/
  images/
    zero-two/
      sample.png
    icons/
      heromc.net.png
      mineahihi.com.png
      sample.png
  music/
    your-music.mp3
  videos/
    your-video.mp4
```

## 🚀 Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/serverstatus.git
```

2. Add your custom assets to the appropriate directories

3. Update the following files with your assets:
   - `index.html`: Update video background and music sources
   - `script.js`: Update music source
   - `graph.js`: Update music source

4. Deploy to GitHub Pages:
   - Go to repository settings
   - Enable GitHub Pages
   - Select main branch as source

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Chart.js for graphs
- Howler.js for audio
- Anime.js for animations
- Font Awesome for icons

## 📱 Responsive Design

The website is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🎵 Background Music

The website includes background music that can be toggled on/off. To change the music:

1. Add your music file to `assets/music/`
2. Update the music source in `script.js` and `graph.js`:
```javascript
const sound = new Howl({
    src: ['assets/music/your-music.mp3'],
    loop: true,
    volume: 0.5
});
```

## 🎨 Customizing Theme

To customize the theme colors, edit the CSS variables in `style.css`:

```css
:root {
    --primary-color: #ff4da6;
    --secondary-color: #ff7686;
    --accent-color: #e6005c;
    --background-color: #1a1a1a;
    --card-background: rgba(26, 26, 26, 0.9);
    --text-color: #FFFFFF;
    --border-color: #ff4da6;
    --glow-color: rgba(255, 77, 166, 0.5);
}
```

## 📊 Graph Customization

To customize the player statistics graph:

1. Edit the default servers in `graph.js`:
```javascript
const defaultServers = [
    { ip: 'heromc.net', color: '#ff4da6' },
    { ip: 'mineahihi.com', color: '#ff7686' },
    // Add more servers here
];
```

2. Customize chart appearance in `graph.js`:
```javascript
options: {
    // Chart options here
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
