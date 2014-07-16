
	// set global variables

	var currentTab = [0];
	var translationValues = [0];

	// constructor

	var tabbedContent = function($tabs, $content, $container) {
		this.tab =	$tabs;
		this.tabContent = $content;
		this.tabContainer = $container;
		this.init();
	}

	tabbedContent.prototype = {

		init : function() {

			// prepare content area to be populated by content

			var self = this;

			$(this.tab).first().addClass('active');
			$(this.tabContent).first().addClass('current');

			if ($(self.tabContainer).length) {
				// show all the content
				this.tabContent.not(':first').css({
					'display' : 'block'
				});

				// set the height of the tabbed content containers
				self._currentHeight();

			} else {
				// hide all content but the first
				this.tabContent.not(':first').css({
					'display' : 'none'
				});
			}

			// set up handlers
			this.register_events();

		},

		register_events : function() {

			// obtain reference
			var self = this;

			if (!$('html').hasClass('lt-ie9')) {
				$(window).resize(function() {
					if ($(self.tabContainer).length) {
						var scrollTab = $(self.tabContent[index=currentTab]).position().top;
						$(self.tabContainer).css('top', (-scrollTab));
						self._currentHeight.call(self, $(this));
					}
				});
			}

			// tab click
			this.tab.bind('click', function(e) {

				e.preventDefault();

				// in order to check which animation to perform, see if tabContainer exists

				if (!$('html').hasClass('cssanimations')) {

					//check if tab is active
					if (!$(this).hasClass('stop')) {
						if (!$(this).hasClass('active')) {
							// make sibling tabs inactive
							$(this).siblings().addClass('stop');
							self._cssanimate.call(self, $(this));
							$(this).addClass('active');
						}
					}

					$(window).trigger('resize');

				} else {

					if (!$(this).hasClass('active')) {
						self._animate.call(self, $(this));
						$(this).addClass('active');
					}

				}
			});

		},

		_currentHeight : function() {

			// obtain reference
			var self = this;

			var tabHeight = parseInt($(self.tabContent[index=currentTab]).css('height'));
			self.tabContent.parent(self.tabContainer).parent().css({
				'height' : tabHeight + 'px'
			});

		},

		_addclass : function() {

			// obtain reference
			var self = this;

			self.tabContent.addClass('current');
			self.tab.removeClass('active');

		},


        _animate : function(clicked_element) {

                // obtain reference
                var self = this;

                // get the clicked tab index
                var tabIndex = $(clicked_element).index();

                // hide the open tabs
                self.tabContent.slideUp('slow');

                // reveal new tab

                $(self.tabContent[tabIndex]).slideDown('slow');

                self._addclass.call(self, $(this));

        },


		_cssanimate : function(clicked_element) {

			// obtain reference
			var self = this;

			var currentTab1 = parseInt(currentTab);

			// get the clicked tab index
			var tabIndex = $(clicked_element).index();

			// reveal new tab
			$(self.tabContent[tabIndex]).css({
				'display' : 'block'
			});

			// check to see if you are going up or down

			if (tabIndex > currentTab1) {

				//  check the heights between the current tab content and the target tab content
				var tElements = $(self.tabContent[index=currentTab]).nextUntil($(self.tabContent[index=tabIndex])).andSelf();
				translationValues.length = 0;

				$(tElements).each(function() { translationValues.push($(this).outerHeight()) });

				//  add the heights of the inbetween tab contents together
				var translationSum = 0;
				for (var i = 0; i < translationValues.length; i++) {
				    translationSum += parseInt(translationValues[i]);
				}

				//  take the current top position of the container and translate to the target tab content by the value determined
				var tabPos = parseInt($(self.tabContainer).css('top'));
				var tabHeight = parseInt($(self.tabContent[index=tabIndex]).css('height'));
				var tTotal = tabPos - translationSum;

			} else {

				//  check the heights between the current tab content and the target tab content
				var tElements = ($(self.tabContent[index=tabIndex])).nextUntil($(self.tabContent[index=currentTab])).andSelf();
				translationValues.length = 0;

				$(tElements).each(function() { translationValues.push($(this).outerHeight()) });

				//add the heights of the inbetween tab contents together
				var translationSum = 0;
				for (var i = 0; i < translationValues.length; i++) {
				    translationSum += parseInt(translationValues[i]);
				}

				//  take the current top position of the container and translate to the target tab content by the value determined
				var tabPos = parseInt($(self.tabContainer).css('top'));
				var tabHeight = parseInt($(self.tabContent[index=tabIndex]).css('height'));
				var tTotal =  tabPos + translationSum;

			}

			// update the current tab
			currentTab.length = 0;
			currentTab.push(tabIndex);

			//add and remove the relevant classes
			self._addclass.call(self, $(this));

		    self.tabContent.parent(self.tabContainer).css({
				"top" : tTotal + 'px'
			});

		    // make tabs active again
			setTimeout(function(){
				 $(self.tab).removeClass('stop');
			}, 1000);

		    // set container height
		    self._currentHeight.call(self, $(this));

		}

	}