function StorageService() {
	// Retrieve the flag from the local storage
	var saveToStorageValue = localStorage.getItem('saveToStorage');
	if (saveToStorageValue === null) {
		saveToStorageValue = true;
		localStorage.setItem('saveToStorage', true);
	} else {
		saveToStorageValue = saveToStorageValue === "true";
	}

	this.saveToStorage = saveToStorageValue;
}

// doc must be a string
StorageService.prototype.saveOnStorage = function(doc) {
	if (this.saveToStorage) {
		localStorage.setItem('doc', doc);
	}
};

StorageService.prototype.loadFromStorage = function() {
	return localStorage.getItem('doc');
};

app.service('StorageService', StorageService, []);