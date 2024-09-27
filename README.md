# 9Key Server

Server-side application for the 9Key Password Manager, written in TypeScript.

## 🔧 Setup

Setting up the 9Key Server at your own computer is easy, you just need [git](https://git-scm.com) and [Node.js](https://nodejs.org/en) (v20.x or higher) in your device.

```bash
git pull https://git.college/dokuzKey/server.git && npm install
```

After installation, fill out the variables at [.env.example](.env.example), and rename the file to `.env`.

## ⚙️ Starting the server
After the setup process, you can run the following commands to start up the server.

### Starting with ts-node
To run your code without building with tsc, you can quickly start up your server with ts-node.
```bash
npm run start-ts
```

### Starting with node
If you want to build your code to the `dist/` file, you can use the following commands.
```bash
npm run build && npm run start
```

## ⛑️ Contributing

For more information on contributions on this project, please check out the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## 📜 License

This project is licensed under the Apache 2.0 license. Please check out the license at [LICENSE](LICENSE)