(function() {
angular.module('ChineseMenuApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('UriBase', 'https://davids-restaurant.herokuapp.com')
.directive('foundItems', FoundItems);

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
    var narrow = this;

    narrow.searchResults = [];
    narrow.showEmpty = false;

    narrow.search = function() {
        var term = narrow.searchInput;

        // Ensure that the search term isn't empty
        if (term && term.length != 0) {
            var promise = MenuSearchService.getMatchedMenuItems(term);
            promise.then(function(result) {
                narrow.searchResults = result.data && result.data.menu_items
                    .filter(function(itm) {
                        return itm.description.includes(term.toLowerCase());
                    });

                // Hide the empty result div
                narrow.showEmpty = (narrow.searchResults 
                    && narrow.searchResults.length == 0) || false;
            });
        } else {
            narrow.searchResults = [];

            // Show the empty result div
            narrow.showEmpty = true;
        }
    }

    narrow.removeItem = function(ind) {
        narrow.searchResults.splice(ind, 1);
    }
}

MenuSearchService.$inject = ['$http', 'UriBase'];
function MenuSearchService($http, UriBase) {
    var search = this;

    search.getMatchedMenuItems = function(term) {
        return $http({
            method: "GET",
            url: (UriBase + "/menu_items.json")
        });
    }
}

function FoundItems() {
    return {
        templateUrl: 'foundItems.html',
        scope: {
            results: '<',
            onRemove: '<'
        }
    };
}
})();
