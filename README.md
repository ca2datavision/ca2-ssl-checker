# SSL Certificate Checker

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/ca2datavision/ssl-checker/docker.yml?branch=main)](https://github.com/ca2datavision/ssl-checker/actions)

A modern web application for monitoring SSL certificates across multiple websites. Built with React, TypeScript, and Express.js.

![SSL Certificate Checker](https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=2000&h=600)

## Features

- 🔒 Real-time SSL certificate status monitoring
- ⏰ Expiration notifications with different warning levels:
  - Valid: Certificate is healthy
  - Expiration Hint: 30 days before expiration
  - Expiration Warning: 7 days before expiration
  - Expired: Certificate has expired
- 📱 Responsive design with a clean, modern interface
- 💾 Local storage persistence
- 📥 Import/Export functionality
- ↕️ Drag-and-drop reordering of websites
- 🔄 Bulk recheck capability

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Express.js
- Vite
- DND Kit for drag-and-drop
- Lucide React for icons

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The application will be available at `http://localhost:3000/ssl`.

## Docker Support

The project includes Docker support for easy deployment:

```bash
# Build the Docker image
docker build -t ssl-checker .

# Run the container
docker run -p 3000:3000 ssl-checker
```

## Project Structure

```
├── src/
│   ├── components/      # React components
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── server.ts           # Express.js server
├── Dockerfile          # Docker configuration
└── vite.config.ts      # Vite configuration
```

## License

MIT

## About

Built by CA2 Data Vision using advanced AI technology. This tool helps you monitor SSL certificates across multiple websites with real-time status updates and expiration notifications.

For inquiries, contact: ionut@ca2datavision.ro

## Disclaimer

This tool provides SSL certificate monitoring capabilities but does not guarantee complete security assessment. Users should perform comprehensive security audits and maintain proper security practices. All website data is stored locally in your browser's storage.