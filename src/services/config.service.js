function ConfigService() {
	this.author = "Danilo Arcidiacono";
	this.appVersion = "2.0.0";
	this.githubLink = "https://github.com/daniloarcidiacono/DebtJS";
}

ConfigService.prototype.getAuthor = function() {
	return this.author;
};

ConfigService.prototype.getAppVersion = function() {
	return this.appVersion;
};

ConfigService.prototype.getGithubLink = function() {
	return this.githubLink;
};

app.service('ConfigService', ConfigService, []);
