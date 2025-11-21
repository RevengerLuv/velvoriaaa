const { exec } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting Backend Server...');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found. Make sure you are in the backend directory.');
  process.exit(1);
}

// Install dependencies if node_modules doesn't exist
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  exec('npm install', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Failed to install dependencies:', error);
      return;
    }
    console.log('✅ Dependencies installed');
    startServer();
  });
} else {
  startServer();
}

function startServer() {
  console.log('🔧 Starting server on port 5000...');
  
  const server = exec('npm start', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Failed to start server:', error);
      return;
    }
  });

  server.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  server.stderr.on('data', (data) => {
    console.error('Server error:', data.toString());
  });
}