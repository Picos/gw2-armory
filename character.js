(function(){
	var app = angular.module("GW2Armory",["ngStorage"]);

	var StorageController = function($scope,$localStorage) {
		$scope.save = function(key) {
			$localStorage.APIKey = key;
		}

	}

	var queryString = (function(a) {
	    if (a == "") return {};
	    var b = {};
	    for (var i = 0; i < a.length; ++i)
	    {
		var p=a[i].split('=', 2);
		if (p.length == 1)
		    b[p[0]] = "";
		else
		    b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
	    }
	    return b;
	})(window.location.search.substr(1).split('&'));

	var MainController = function($scope,$http,$localStorage) {

		var onError = function(response) {
			console.log(response);
			$scope.error = "Could not get data. (" + response.data.text + ")";
		}

		function myequipments(){
			Helm = new myequipment();
			Shoulders = new myequipment();
			Coat = new myequipment();
			Leggings = new myequipment();
			Gloves = new myequipment();
			Boots = new myequipment();
			WeaponA1 = new myequipment();
			WeaponA2 = new myequipment();
			WeaponB1 = new myequipment();
			WeaponB2 = new myequipment();

			Backpack = new myequipment();
			Amulet = new myequipment();
			Accessory1 = new myequipment();
			Accessory2 = new myequipment();
			Ring1 = new myequipment();
			Ring2 = new myequipment();

			HelmAquatic = new myequipment();
			WeaponAquaticA = new myequipment();
			WeaponAquaticB = new myequipment();

			Sickle = new myequipment();
			Axe = new myequipment();
			Pick = new myequipment();
		}

		function myequipment(){
			id = "";
			slot = "";
			name = "";
			type = "";
			icon = "";
			skin = "";
			rarity = "";
			level = "";

			defense = "";

			damage_type = "";
			min_power = "";
			max_power = "";

			attributes = [];

			infusions = [];
			upgrades = [];
		}

		function myinfusion(){
			id = "";
			name = "";
			icon = "";
			buff = "";
			rarity = "";
		}

		function myupgrade(){
			id = "";
			name = "";
			icon = "";
			type = "";
			suffix = "";
			rarity = "";
			bonuses = [];
		}

		var onCharacterInfoComplete = function(response) {
			$scope.character = response.data;
			$scope.equipments = new myequipments();

			for(var x=0; x < $scope.character.equipment.length; x++) {

				var equipment = new myequipment();

				equipment.id = $scope.character.equipment[x].id;
				equipment.slot = $scope.character.equipment[x].slot;
				equipment.skin = $scope.character.equipment[x].skin;

				equipment.infusions = [];
				if($scope.character.equipment[x].infusions){
					for(var y=0; y < $scope.character.equipment[x].infusions.length; y++) {
						var _infusion = new myinfusion();
						_infusion.id = $scope.character.equipment[x].infusions[y];
						equipment.infusions.push(_infusion);
					}
				}

				equipment.upgrades = [];
				if($scope.character.equipment[x].upgrades){
					for(var y=0; y < $scope.character.equipment[x].upgrades.length; y++) {
						var _upgrade = new myupgrade();
						_upgrade.id = $scope.character.equipment[x].upgrades[y];
						equipment.upgrades.push(_upgrade);
					}
				}

				$scope.equipments[equipment.slot] = equipment;

				getEquipment(equipment);
			}
		}

		function getEquipment(equipment) {
			$http.get("https://api.guildwars2.com/v2/items/"+equipment.id)
				.then(
					function(response) {

						equipment.name = response.data.name;
						equipment.icon = response.data.icon;
						equipment.rarity = response.data.rarity;
						equipment.level = response.data.level;

						if(response.data.details != null && response.data.details != undefined){
							equipment.type = response.data.details.type;

							if(response.data.details.damage_type != null && response.data.details.damage_type != undefined){
								equipment.damage_type = response.data.details.damage_type;
							}
							if(response.data.details.min_power != null && response.data.details.min_power != undefined){
								equipment.min_power = response.data.details.min_power;
							}
							if(response.data.details.max_power != null && response.data.details.max_power != undefined){
								equipment.max_power = response.data.details.max_power;
							}

							if(response.data.details.defense != null && response.data.details.defense != undefined){
								equipment.defense = response.data.details.defense;
							}

							if(response.data.details.infix_upgrade != null && response.data.details.infix_upgrade != undefined){
								if(response.data.details.infix_upgrade.attributes != null && response.data.details.infix_upgrade.attributes != undefined){
									equipment.attributes = response.data.details.infix_upgrade.attributes;
								}
							}
						}

						getSkin(equipment);
						getInfusions(equipment);
						getUpgrades(equipment);
					}
				,onError);
		}

		function getSkin(equipment)
		{
			if(equipment.skin != null && equipment.skin != undefined && equipment.skin != ""){
				$http.get("https://api.guildwars2.com/v2/skins/"+equipment.skin)
					.then(
						function(response) {
							equipment.name = response.data.name;
							equipment.icon = response.data.icon;
						}
					,onError);
			}
		}

		function getInfusions(equipment)
		{
			for(var x=0; x < equipment.infusions.length; x++) {
				function getinfusevalues(x){
					var infusion = equipment.infusions[x];
					$http.get("https://api.guildwars2.com/v2/items/"+infusion.id)
						.then(
							function(response) {
								infusion.name = response.data.name;
								infusion.icon = response.data.icon;
								infusion.buff = response.data.details.infix_upgrade.buff.description;
								infusion.rarity = response.data.rarity;
							}
						,onError);
				}
				getinfusevalues(x);
			}
		}

		function getUpgrades(equipment)
		{
			for(var x=0; x < equipment.upgrades.length; x++) {
				function getupgradesvalues(x){
					var upgrade = equipment.upgrades[x];
					$http.get("https://api.guildwars2.com/v2/items/"+upgrade.id)
						.then(
							function(response) {
								upgrade.name = response.data.name;
								upgrade.icon = response.data.icon;
								upgrade.type = response.data.details.type;
								upgrade.suffix = response.data.details.suffix;
								upgrade.bonuses = response.data.details.bonuses;
								upgrade.rarity = response.data.rarity;
							}
						,onError);
				}
				getupgradesvalues(x);
			}
		}

		function getCharactereInfo(APIKey) {
			var characterName = queryString["name"];

			$http.get("https://api.guildwars2.com/v2/characters/"+characterName+"?access_token="+APIKey)
				.then(onCharacterInfoComplete,onError);
		}

		$scope.load = function() {
			$scope.APIKey = $localStorage.APIKey;
		}

		$scope.load();
		getCharactereInfo($scope.APIKey);

	}

	app.controller('StorageController',['$scope','$localStorage',StorageController]);
	app.controller('MainController',['$scope','$http','$localStorage',MainController]);
})();
