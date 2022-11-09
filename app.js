const { app, BrowserWindow, Notification } = require("electron");
require("dotenv").config();
const { NocoDB } = require("./noco");

const nocoDB = new NocoDB();

let loadingWindow = null;

const createLoadingWindow = () => {
	return new Promise((res, rej) => {
		loadingWindow = new BrowserWindow({
			width: 400,
			height: 200,
			autoHideMenuBar: true,
			frame: false,
		});

		loadingWindow.loadFile("loading.html");

		loadingWindow.on("ready-to-show", () => {
			const fs = require("fs");

			if (!fs.existsSync("firstAccess.txt")) {
				setTimeout(() => {
					fs.writeFileSync("firstAccess.txt", "false");

					const defaultUser = {
						user: process.env.NC_ADMIN_EMAIL,
						password: process.env.NC_ADMIN_PASSWORD,
					};

					new Notification({
						title: "PRIMEIRO ACESSO",
						body: `Usuário: ${defaultUser.user} Senha: ${defaultUser.password}`,
					}).show();
					res();
				}, 2500);
			} else {
				res();
			}
		});
	});
};

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		maximizable: true,
		minHeight: 400,
		minWidth: 600,
		title: "NocoDB - Desktop By: Lucas-Gardini",
	});

	win.maximize();
	win.loadURL(nocoDB.url);
};

app.whenReady().then(async () => {
	await createLoadingWindow();

	await nocoDB.start();

	createWindow();
	loadingWindow.destroy();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
