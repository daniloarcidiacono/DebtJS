function MainController($scope, $window, LxNotificationService, LxDialogService) {
	this.$scope = $scope;
	this.LxNotificationService = LxNotificationService;
	this.LxDialogService = LxDialogService;
	this.showDeterminateLinearProgress = false;
	this.showIndeterminateLinearProgress = false;
	this.determinateLinearProgressValue = 0;
	this.newDocument(false);
	this.author = "Danilo Arcidiacono";
	this.appLoaded = false;

	var localStorageValue = localStorage.getItem('useLocalStorage');
	if (localStorageValue === null) {
		localStorageValue = true;
		localStorage.setItem('useLocalStorage', true);
	} else {
		localStorageValue = localStorageValue === "true";
	}
	this.useLocalStorage = localStorageValue;

	// Keyboard bindings
	var self = this;
	Mousetrap.bind('ctrl+enter', function() { 
									// TODO: Distinguere tra addEntry e addBuyer
									self.addEntry(); 
									self.$scope.$evalAsync(); 
									return false;
								} 
					);

	// Clear the local storage when we disable the relevant option
	this.$scope.$watch(function() { return self.useLocalStorage; }, function (newValue, oldValue) {
		if (newValue !== oldValue) {
			localStorage.setItem('useLocalStorage', newValue);

			if (newValue === false) {
				localStorage.removeItem('doc');
				self.LxNotificationService.info('Local storage cleaned.');
			} else {
				self.saveDocumentOnLocalStorage(true);
			}
		}
	});

	// Save the data in local storage before leaving the page
	$window.onbeforeunload = function() {
		localStorage.setItem('useLocalStorage', self.useLocalStorage);
		self.saveDocumentOnLocalStorage(false); 
	};

	// Load the document from local storage
	if (this.useLocalStorage === true) {
		this.loadDocumentFromLocalStorage();
	}

	this.appLoaded = true;
}

MainController.prototype.newDocument = function(askFirst) {
	if (askFirst === true) {
		var self = this;
		this.LxNotificationService.confirm('Create new document?', 'All data will be lost.',
	    {
	    	// Swap them for having the red color on removal
	        ok: 'Keep it',
	        cancel: 'Start from scratch'
	    }, 
	    function(answer) {
	    	// Swap them for having the red color on removal
	        if (answer === false) {
	        	self.newDocument(false);
	        	self.removeSelectedEntries();
	        } 
	    });

	    return;
	}

	this.doc = { };
	this.doc.rowData = [];	
	this.doc.buyers = [ { isSelected: false, name: "Danilo"}, 
						{ isSelected: false, name: "Stefano"}, 
						{ isSelected: false, name: "Rosario"}];
	this.doc.buyer = this.doc.buyers[0];
	this.doc.version = "0.3.0";
	this.doc.title = "";
	this.doc.locale = "it";
	this.doc.date = new Date();
	this.doc.dateFormatted = moment().locale(this.doc.locale).format('LL');
}

MainController.prototype.loadDocumentFromLocalStorage = function() {
	var stored = localStorage.getItem('doc');
	if (stored !== null) {
		this.doc = JSON.parse(stored);
		this.$scope.$evalAsync();
		this.LxNotificationService.info('Document loaded.');
	}

	/*
	if (Object.keys(localStorage).length > 0) {
		var store = Rhaboo.persistent('doc');
		if (store !== null && store.doc !== undefined) {
			this.doc = store.doc;
			this.$scope.$evalAsync();
			this.LxNotificationService.info('Document loaded.');
		}
	}*/
}

MainController.prototype.saveDocumentOnLocalStorage = function(notify) {
	if (this.useLocalStorage === true) {
		localStorage.setItem('doc', JSON.stringify(this.doc));		
		//var store = Rhaboo.persistent('doc');
		//store.write('doc', this.doc);
		if (notify === true) {
			this.LxNotificationService.info('Document saved.');
		}
	}
}

// http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
MainController.prototype.saveFile = function(filename, data) {
    var blob = new Blob([data], {type: 'text/json'});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else{
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;        
        document.body.appendChild(elem);
        elem.click();        
        document.body.removeChild(elem);
    }
}

MainController.prototype.exportJson = function() {
	var dataStr = JSON.stringify(this.doc);
	this.saveFile('dump.json', dataStr);
}

MainController.prototype.importJson = function(fileName) {

	if (fileName === undefined) {
		this.LxDialogService.open("importDialog");
		return;
	}

	// http://stackoverflow.com/questions/23331546/how-to-use-javascript-to-read-local-text-file-and-read-line-by-line
	var reader = new FileReader();
	var self = this;

	// http://stackoverflow.com/questions/16443440/how-to-implement-progress-bar-and-callbacks-with-async-nature-of-the-filereader
	reader.onprogress = function(data) {
		self.showDeterminateLinearProgress = data.lengthComputable;
		self.showIndeterminateLinearProgress = !self.showDeterminateLinearProgress;
		if (data.lengthComputable) {                                            
            self.determinateLinearProgressValue = parseInt( ((data.loaded / data.total) * 100), 10 );            
            self.$scope.$evalAsync();
        }
    }

	reader.onload = function(progressEvent) {
		// Close the dialog when the upload completes
		self.LxDialogService.close("importDialog");
		self.showDeterminateLinearProgress = false;
		self.showIndeterminateLinearProgress = false;
		self.determinateLinearProgressValue = 0;
		self.$scope.$evalAsync();

		var newDoc = null;
		try {
			newDoc = JSON.parse(this.result);
			
			// Check the version
			if (newDoc.version !== self.doc.version) {
				throw "Invalid version (expected " + self.doc.version + ", got " + newDoc.version + ")";
			}

			self.doc = newDoc;
			self.$scope.$evalAsync();
		} catch (e) {
			self.LxNotificationService.alert('Error', e, 'Ok', function(answer) {
            });
		}

	};
  	reader.readAsText(fileName);		
}

MainController.prototype.confirmRemoval = function() {
	var self = this;

    this.LxNotificationService.confirm('Remove selected entries?', 'This operation cannot be undone.',
    {
    	// Swap them for having the red color on removal
        ok: 'Keep them',
        cancel: 'Remove'
    }, 
    function(answer) {
    	// Swap them for having the red color on removal
        if (answer === false) {
        	self.removeSelectedEntries();
        	self.LxNotificationService.success('Entries removed.');
        }
    });
}

MainController.prototype.getSelectedItemsCount = function () {
	var result = 0;
	for (var i = 0; i < this.doc.rowData.length; i++) {
		if (this.doc.rowData[i].isSelected === true) {
			result++;
		}
	}
	return result;
}

MainController.prototype.removeSelectedEntries = function() {
	for (var i = 0; i < this.doc.rowData.length; i++) {
		if (this.doc.rowData[i].isSelected === true) {
			this.doc.rowData.splice(i, 1);
			i--;
		}
	}
}

MainController.prototype.addEntry = function() {
	var entry = {
		"isSelected": false,
		"amount": 0,
		"quantity": 1,
		"description": ""
	};

	for (var i = 0; i < this.doc.buyers.length; i++) {
		entry[this.doc.buyers[i].name] = false;
	}

	this.doc.rowData.push(entry);

	setTimeout(function() {
		angular.element('.txtDescription:last-of-type').focus();
	}, 0);
}

///////////
// Buyers
///////////
MainController.prototype.addBuyer = function() {
	var entry = {
		"isSelected": false,
		"name": ""
	};

	this.doc.buyers.push(entry);

	// Update the rows
	for (var i = 0; i < this.doc.rowData.length; i++) {
		this.doc.rowData[i][entry.name] = false;
	}


	setTimeout(function() {
		angular.element('.txtName:last-of-type').focus();
	}, 0);	
}

MainController.prototype.getSelectedBuyersCount = function () {
	var result = 0;
	for (var i = 0; i < this.doc.buyers.length; i++) {
		if (this.doc.buyers[i].isSelected === true) {
			result++;
		}
	}
	return result;
}

MainController.prototype.removeSelectedBuyers = function() {
	for (var i = 0; i < this.doc.buyers.length; i++) {
		if (this.doc.buyers[i].isSelected === true) {
			// We can't remove the current buyer
			// TODO: this.doc.buyer must be only an index, not the entire object!
			// (because of isselected flag!)
			if (this.doc.buyers[i] !== this.doc.buyer) {
				// Update the rows
				for (var j = 0; j < this.doc.rowData.length; j++) {
					delete this.doc.rowData[j][this.doc.buyers[i].name];
				}

				this.doc.buyers.splice(i, 1);
				i--;
			} else {
				this.LxNotificationService.warning('Cannot remove the current buyer');
			}
		}
	}
}

MainController.prototype.confirmBuyerRemoval = function() {
	var self = this;

    this.LxNotificationService.confirm('Remove selected entries?', 'This operation cannot be undone.',
    {
    	// Swap them for having the red color on removal
        ok: 'Keep them',
        cancel: 'Remove'
    }, 
    function(answer) {
    	// Swap them for having the red color on removal
        if (answer === false) {
        	self.removeSelectedBuyers();
        	self.LxNotificationService.success('Buyers removed.');
        }
    });
}


// Returns the total amount
MainController.prototype.getTotalAmount = function() {
	var result = 0;
	for (var i = 0; i < this.doc.rowData.length; i++) {
		result += parseFloat(this.doc.rowData[i].amount) * parseInt(this.doc.rowData[i].quantity);
	}
	return result;
}


// Returns how much money srcBuyer must give the current buyer
MainController.prototype.getDebt = function(srcBuyer) {
	var result = 0;
	for (var i = 0; i < this.doc.rowData.length; i++) {
		result += this.getDebtForRow(i, srcBuyer);
	}
	return result;
}

// Returns how much money srcBuyer must give to dstBuyer (for the given row)
MainController.prototype.getDebtForRow = function(rowIndex, srcBuyer) {
	var result = 0;

	// If the srcBuyer is involved in this row..
	if (this.doc.rowData[rowIndex][srcBuyer.name] === true) {
		// Calculate the split factor
		var splitFactor = this.calculateSplitFactor(rowIndex);
		result += parseFloat(this.doc.rowData[rowIndex].amount) * parseInt(this.doc.rowData[rowIndex].quantity) / splitFactor;
	}

	return result;
}

MainController.prototype.calculateSplitFactor = function(rowIndex) {
	var splitFactor = 0;
	for (var i = 0; i < this.doc.buyers.length; i++) {
		if (this.doc.rowData[rowIndex][this.doc.buyers[i].name] === true) {
			splitFactor++;
		}
	}
	return splitFactor;
}

MainController.prototype.getData = function() {
	return this.doc.rowData;
}

MainController.prototype.getBuyer = function() {
	return this.doc.buyer;
}

MainController.prototype.getBuyers = function() {
	return this.doc.buyers;
}

MainController.prototype.getVersion = function() {
	return this.doc.version;
}

MainController.prototype.getAuthor = function() {
	return this.author;
}

app.controller('mainController', MainController, ['$scope', '$window', 'LxNotificationService', 'LxDialogService']);
