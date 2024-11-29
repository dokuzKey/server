# 🔑 9Key Server
The server-side application for the **9Key Password Manager**, a **modern looking** 👀 and **safe** 🔐 Bitwarden and 1Password alternative.


> [!WARNING]  
> Please note that 9Key is still in its early stages, there is a possibility that your credentials might be in danger when you use it.
> 
> That said, we aim to implement the best encryption standards using our own [encryption module](https://github.com/dokuzKey/thencrypt), ensuring that all data is end-to-end encrypted.

### 📰 About
9Key Password Manager is a modern, fast and safe way to store your passwords in the cloud, encrypted. You can self-host or use our [web client](https://sifre.org.tr) to use the app.

### 🗺️ Clients

- [`dokuzKey/frontend`](https://github.com/dokuzKey/frontend) - Frontend application for the 9Key Password Manager. Built with **NextJS** and **Typescript**

### 🚀 Setting up

Make sure that Nodejs, Typescript Compiler and other dependencies are downloaded in your system.
```bash
$ git -v && node -v && npm -v && tsc -v
> git version X.XX.X
> vXX.XX.XX
> XX.X.X
> Version X.X.X
```

Pull the source code from Github:
```bash
$ git pull https://github.com/dokuzKey/server.git
```

After that, lets install our dependencies.
```bash
$ cd server
$ npm install
```

🚀 You can now run the server side code!

### 📄 License
This project has been licensed under the [Apache 2.0 License](LICENSE).
