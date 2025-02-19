const fs = require("fs");
const path = require("path");

// נתיב התיקייה הראשית
const projectPath = path.join(__dirname, "my-microservices");

// רשימת הקבצים והמבנה שלהם
const files = {
  "service1/package.json": `{
  "name": "service1",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2"
  }
}`,
  "service1/server.js": `const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Service 1");
});

app.listen(3001, () => console.log("Service 1 running on port 3001"));
`,
  "service2/package.json": `{
  "name": "service2",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2"
  }
}`,
  "service2/server.js": `const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Service 2");
});

app.listen(3002, () => console.log("Service 2 running on port 3002"));
`,
  "nginx.conf": `worker_processes 1;

events {
    worker_connections 1024;
}

http {
    upstream service1 {
        server service1:3001;
    }

    upstream service2 {
        server service2:3002;
    }

    server {
        listen 80;

        location /api/service1/ {
            proxy_pass http://service1/;
        }

        location /api/service2/ {
            proxy_pass http://service2/;
        }
    }
}`,
  "docker-compose.yml": `version: "3.8"

services:
  nginx:
    image: nginx:latest
    container_name: my-nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - service1
      - service2

  service1:
    image: node:18
    container_name: service1
    working_dir: /app
    volumes:
      - ./service1:/app
    command: ["node", "server.js"]
    ports:
      - "3001:3001"

  service2:
    image: node:18
    container_name: service2
    working_dir: /app
    volumes:
      - ./service2:/app
    command: ["node", "server.js"]
    ports:
      - "3002:3002"
`
};

// פונקציה ליצירת הקבצים והתיקיות
const createProjectFiles = () => {
  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath);
  }

  Object.entries(files).forEach(([filePath, content]) => {
    const fullPath = path.join(projectPath, filePath);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, content);
    console.log(`✅ Created: ${filePath}`);
  });

  console.log("\n🚀 Project setup completed successfully!");
};

// הפעלת הפונקציה
createProjectFiles();
