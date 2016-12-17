function PasteBinService($http, $q) {
	this.$http = $http;	
	this.$q = $q;
}

// Creates a new paste (pasteJsonContent must be an object, not a string)
PasteBinService.prototype.createPastebin = function(pasteTitle, pasteJsonContent) {
	var req = {
		method: 'POST',
		url: 'http://192.168.56.1:888/DebtJS/create.php',
		headers: {
			'Content-Type': 'application/json'
		},
		data: { 
			"title": pasteTitle, 
			"content": pasteJsonContent 
		}
	};

	var deferred = this.$q.defer();

	var self = this;
	this.$http(req).then(function(result) {
		deferred.resolve(result);
	}).catch(function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
};

// Listes the available paste bins
PasteBinService.prototype.listPastebins = function() {
	var req = {
		method: 'GET',
		url: 'http://192.168.56.1:888/DebtJS/list.php',
		headers: {
			'Content-Type': 'text/plain'
		}
	};

	var deferred = this.$q.defer();

	var self = this;
	this.$http(req).then(function(result) {
		deferred.resolve(result);
	}).catch(function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
};

// Listes the available paste bins
PasteBinService.prototype.getPaste = function(pasteKey) {
	var req = {
		method: 'GET',
		url: 'http://192.168.56.1:888/DebtJS/read.php?id=' + pasteKey,
		headers: {
			'Content-Type': 'text/plain'
		}
	};

	var deferred = this.$q.defer();

	var self = this;
	this.$http(req).then(function(result) {
		deferred.resolve(result);
	}).catch(function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
};

// Listes the available paste bins
PasteBinService.prototype.deletePaste = function(pasteKey) {
	var req = {
		method: 'DELETE',
		url: 'http://192.168.56.1:888/DebtJS/delete.php?id=' + pasteKey,
		headers: {
			'Content-Type': 'text/plain'
		}
	};

	var deferred = this.$q.defer();

	var self = this;
	this.$http(req).then(function(result) {
		deferred.resolve(result);
	}).catch(function(err) {
		deferred.reject(err);
	});

	return deferred.promise;
};

app.service('PasteBinService', PasteBinService, ['$http', '$q']);
