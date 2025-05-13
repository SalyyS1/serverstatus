

## 📁 Project Structure

```
serverstatus/
├── index.html          # Main status checker page
├── style.css          # Main stylesheet
├── script.js          # Main page JavaScript
├── assets/            # Static assets directory
│   ├── images/        # Image files
│   │   ├── zero-two/  # Zero Two themed images
│   │   └── icons/     # UI icons
│   ├── music/         # Background music files
│   └── videos/        # Background video files
└── README.md          # This file
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


4. Deploy to GitHub Pages:
   - Go to repository settings
   - Enable GitHub Pages
   - Select main branch as source

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


