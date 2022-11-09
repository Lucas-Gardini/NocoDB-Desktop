class NocoDB {
	url = "";
	async start() {
		try {
			const app = require("express")();
			const { Noco } = require("nocodb");
			const httpServer = app.listen(process.env.PORT || 8080);
			app.use(await Noco.init({}, httpServer, app));
			console.log(`Visit: localhost:${process.env.PORT}/dashboard`);

			this.url = `http://localhost:${process.env.PORT}/dashboard`;
		} catch (e) {
			alert(e);
			console.log(e);
		}
	}
}

module.exports = { NocoDB };
