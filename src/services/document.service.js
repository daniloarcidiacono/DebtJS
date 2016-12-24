function DocumentService() {
	this.reset();
}

DocumentService.prototype.reset = function() {
	this.rowData = [];
	this.buyers = [ { isSelected: false, name: "Danilo" },
					{ isSelected: false, name: "Stefano" },
					{ isSelected: false, name: "Rosario" } ];
	this.buyer = this.buyers[0];
	this.version = "0.3.0";
	this.title = "";
	this.locale = "it";
	this.date = new Date();
	this.dateFormatted = moment().locale(this.locale).format('LL');
};

DocumentService.prototype.getExportTitle = function() {
	return this.title.toLowerCase().replace(' ', '') + "_" + this.formatDate(this.date);
};

DocumentService.prototype.getAsJSON = function() {
	return JSON.stringify(this); // TODO: check
};

DocumentService.prototype.getSelectedItemsCount = function () {
	var result = 0;
	for (var i = 0; i < this.rowData.length; i++) {
		if (this.rowData[i].isSelected === true) {
			result++;
		}
	}
	return result;
};

DocumentService.prototype.removeSelectedItems = function() {
	for (var i = 0; i < this.rowData.length; i++) {
		if (this.rowData[i].isSelected === true) {
			this.rowData.splice(i, 1);
			i--;
		}
	}
};

DocumentService.prototype.instanceEmptyEntry = function() {
	var entry = {
		"isSelected": false,
		"amount": 0,
		"quantity": 1,
		"description": ""
	};

	for (var i = 0; i < this.buyers.length; i++) {
		entry[this.buyers[i].name] = false;
	}

	return entry;
};

DocumentService.prototype.addItem = function(entry) {
	entry = entry || this.instanceEmptyEntry();
	this.rowData.push(entry);
	return entry;
};

DocumentService.prototype.addBuyer = function() {
	var entry = {
		"isSelected": false,
		"name": ""
	};

	this.buyers.push(entry);

	// Update the rows
	for (var i = 0; i < this.rowData.length; i++) {
		this.rowData[i][entry.name] = false;
	}
};

DocumentService.prototype.getSelectedBuyersCount = function () {
	var result = 0;
	for (var i = 0; i < this.buyers.length; i++) {
		if (this.buyers[i].isSelected === true) {
			result++;
		}
	}

	return result;
};

DocumentService.prototype.removeSelectedBuyers = function() {
	for (var i = 0; i < this.buyers.length; i++) {
		if (this.buyers[i].isSelected === true) {
			// We can't remove the current buyer
			// TODO: this.buyer must be only an index, not the entire object!
			// (because of isselected flag!)
			if (this.buyers[i] !== this.buyer) {
				// Update the rows
				for (var j = 0; j < this.rowData.length; j++) {
					delete this.rowData[j][this.buyers[i].name];
				}

				this.buyers.splice(i, 1);
				i--;
			}// else {
			//	this.LxNotificationService.warning('Cannot remove the current buyer');
			//}
		}
	}
};

// Returns the total amount
DocumentService.prototype.getTotalAmount = function() {
	var result = 0;
	for (var i = 0; i < this.rowData.length; i++) {
		result += parseFloat(this.rowData[i].amount) * parseInt(this.rowData[i].quantity);
	}

	return result;
};

// Returns how much money srcBuyer must give the current buyer
DocumentService.prototype.getDebt = function(srcBuyer) {
	var result = 0;
	for (var i = 0; i < this.rowData.length; i++) {
		result += this.getDebtForRow(i, srcBuyer);
	}

	return result;
};

// Returns how much money srcBuyer must give to dstBuyer (for the given row)
DocumentService.prototype.getDebtForRow = function(rowIndex, srcBuyer) {
	var result = 0;

	// If the srcBuyer is involved in this row..
	if (this.rowData[rowIndex][srcBuyer.name] === true) {
		// Calculate the split factor
		var splitFactor = this.calculateSplitFactor(rowIndex);
		result += parseFloat(this.rowData[rowIndex].amount) * parseInt(this.rowData[rowIndex].quantity) / splitFactor;
	}

	return result;
};

DocumentService.prototype.calculateSplitFactor = function(rowIndex) {
	var splitFactor = 0;
	for (var i = 0; i < this.buyers.length; i++) {
		if (this.rowData[rowIndex][this.buyers[i].name] === true) {
			splitFactor++;
		}
	}

	return splitFactor;
};

DocumentService.prototype.formatDate = function(date) {
	var mm = date.getMonth() + 1; // getMonth() is zero-based
	var dd = date.getDate();
	if (dd < 10) { dd = "0" + dd; }
	if (mm < 10) { mm = "0" + mm; }

	return dd + "_" + mm + "_" + date.getFullYear();
};

DocumentService.prototype.getItemCount = function() {
	return this.rowData.length;
};

DocumentService.prototype.getData = function() {
	return this.rowData;
};

DocumentService.prototype.getBuyer = function() {
	return this.buyer;
};

DocumentService.prototype.getBuyers = function() {
	return this.buyers;
};

DocumentService.prototype.getVersion = function() {
	return this.version;
};

DocumentService.prototype.getTitle = function() {
	return this.title;
};

DocumentService.prototype.getLocale = function() {
	return this.locale;
};

DocumentService.prototype.getDate = function() {
	return this.date;
};

DocumentService.prototype.getDateFormatted = function() {
	return this.dateFormatted;
};

app.service('DocumentService', DocumentService, []);
