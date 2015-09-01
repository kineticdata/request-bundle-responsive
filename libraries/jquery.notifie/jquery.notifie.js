/**
 * Notifie JS
 * Version 0.1
 * 
 * Library that extends jQuery to add a .notifie(options) function for displaying alerts and confirmations.
 * 
 * Parameters
 * 
 * 	-options:	(Optional) Javascript Object with settings for the notification.
 * 
 * 
 * Options (All of these are optional. If you pass it, it will overwrite the default.)
 * 
 * 	-parent:		String -> jQuery selector
 * 					Default: null
 * 					Finds the closest element matching this selector to use as parent of the notifications.
 * 					Examples: 'div' or 'li.main'
 * 				
 * 	-type:			String -> 'alert' or 'confirm
 * 					Default: 'alert'
 * 					Defines the type of notification to display.
 * 
 * 	-severity:		String -> 'danger' or 'warning' or 'info' or 'success'
 * 					Default: 'danger'
 * 					Defines the style of the notification.
 * 
 * 	-message:		String
 * 					Default: 'Error'
 * 					Text to display inside the notification.
 * 
 * 	-onShow:		Function
 * 					Default: function(){}
 * 					Function to call when the notification is shown. Context is the calling element.
 * 
 * 	-onConfirm:		Function
 * 					Default: function(){}
 * 					Function to call when alert is closed or confirm button is pressed in confirmation notification.
 * 				
 * 	-onConfirm:		Function
 * 					Default: function(){}
 * 					Function to call when confirmation notification is closed or confirm button is pressed in confirmation notification.
 * 
 * 	-clearExisting:	Boolean
 * 					Default: true
 * 					If true, closes any existing notifications at this level before opening a new one.
 * 
 * 	-exitEvents:	String -> Javascript event name(s)
 * 					Default: ''
 * 					Events that will get added to calling element that will close the notifications.
 * 					You may pass multiple events by separating them by spaces.
 * 					Examples: 'click' or 'focus' or 'click focus'
 * 
 * 	-textButtons:	Boolean
 * 					Default: false
 * 					If true, buttons in a confirmation notification will show text instead of icons.
 * 
 * 	-confirmText:	String
 * 					Default: 'OK'
 * 					If textButtons is true, this text will display on the confirm button.
 * 
 * 	-rejectText:	String
 * 					Default: 'Cancel'
 * 					If textButtons is true, this text will display on the reject button.
 * 					
 * 	-duration:		Number
 * 					Default: 100
 * 					Amount of milliseconds that the animation of showing/hiding the notification should take.
 * 					Setting to 0 removes the animation.
 * 
 * 	-expire:		Number
 * 					Default: null
 * 					Applies only if type is alert. Amount of milliseconds that the alert will stay on screen before automatically disappearing.
 * 
 * 	-disable:		Boolean
 * 					Default: true
 * 					If true, the calling element will be disabled when the notification is shown, and enabled when the notification is closed.
 * 
 * 	-exit:			Boolean
 * 					Default: false
 * 					If true, this .notifie() call will only close the notification(s) at the parent level
 * 
 * 	-recurseExit:	Boolean
 * 					Default: false
 * 					Applies only if exit is true. If true, closes all notifications at the parent level and inside all children of the parent.
 * 
 */
jQuery.fn.extend({
	notifie: function(options){
		var self = $(this);
		// Merge passed in options with defaults
		options = jQuery.extend(true, {
			parent: null,
			type: "alert",
			severity: "danger",
			message: "Error",
			onShow: function(){},
			onConfirm: function(){},
			onReject: function(){},
			clearExisting: true,
			exitEvents: '',
			textButtons: false,
			confirmText: "OK",
			rejectText: "Cancel",
			duration: 100,
			expire: null,
			disable: true,
			exit: false,
			recurseExit: false
		}, options || {});
		
		// Get owner of notification
		var owner = self.closest(options.parent).length ? self.closest(options.parent) : self;
			
		// Close existing notification(s)
		if (options.exit){
			// If recurseExit is true, close all notifications under owner
			if (options.recurseExit){
				// Find notifications in siblings and close
				owner.siblings('div.notifie').trigger('exit', false);
				// Find all notifications in all descendants close
				owner.find('div.notifie').trigger('exit', false);
			}
			// If recurseExit is false, close only children notifications under owner
			else {
				// Find sibling notifications and close
				owner.siblings('div.notifie').trigger('exit', false);
			}
		}
		// Show new notification
		else {
			// Verify type and severity, and set to default if not one of the acceptable options
			options.type = $.inArray(options.type, ["alert", "confirm"]) < 0 ? "alert" : options.type;
			options.severity = $.inArray(options.severity, ["success", "info", "warning", "danger"]) < 0 ? "danger" : options.severity;
			// Check type of notification
			var isAlert = options.type === "alert";
			var isConfirm = options.type === "confirm";
			
			// Build notification container
			var notification = $("<div>").addClass("notifie clearfix hide alert alert-" + options.severity);
			
			// Add custom exit event triggered when user manually closes the notification
			notification.on('exit', function(e, confirm){
				// Hide the notification
				$(this).slideUp(options.duration, function(){
					// If confirm is not undefined, call a callback function
					if (confirm !== undefined){
						// If confirm is true or notification is alert, call onConfirm, else call onReject
						if (confirm || isAlert) options.onConfirm.call(self);
						else options.onReject.call(self);
					}
					// Enable self on exit if it was disabled
					if (options.disable){
						self.prop('disabled', false);
					}
					// Remove the notification
					$(this).remove();
				});
			});
			
			// Add one time events to self for exiting the notifications
			self.one(options.exitEvents, function(){
				notification.trigger('exit', false);
			});

			// Build notification close button and attach exit event function on click
			$("<button>").addClass('fa fa-times close').on('click', function(e){
				// Close popup and call appropriate onConfirm/onReject function (which is handled by the exit event)
				notification.trigger('exit', false);
			}).appendTo(notification);
			// Build notification message
			$("<div>").addClass("notifie-message").text(options.message).appendTo(notification);
			// If confirm, build buttons
			if (isConfirm){
				// Build button group
				var buttons = $("<div>").addClass("notifie-buttons border-top alert-" + options.severity).appendTo(notification);
				
				// Create button
				var rejectBtn = $("<button>").addClass("btn btn-danger btn-sm pull-right reject").appendTo(buttons);
				// Add dismiss/cancel button text or icon
				if (options.textButtons) rejectBtn.addClass("text").text(options.rejectText); 
				else rejectBtn.addClass("fa fa-times");
				// Add click event to button
				rejectBtn.on('click', function(e){
					// Close popup and call appropriate onConfirm/onReject function (which is handled by the exit event)
					notification.trigger('exit', false);
				});
				
				// Create button
				var confirmBtn = $("<button>").addClass("btn btn-success btn-sm pull-right confirm").appendTo(buttons);
				// Add ok button text or icon
				if (options.textButtons) confirmBtn.addClass("text").text(options.confirmText); 
				else confirmBtn.addClass("fa fa-check");
				// Add click event to button
				confirmBtn.on('click', function(e){
					// Close popup and call onConfirm function (which is handled by the exit event)
					notification.trigger('exit', true);
				});
			}
			
			// Clear any existing notifications if required
			if (options.clearExisting) owner.siblings('div.notifie').trigger('exit', false);
			// Add as sibling immediately before owner
			owner.before(notification);
			
			// Show notification
			notification.slideDown(options.duration, function(){
				// Call onShow function
				options.onShow.call(self);
				// Disable self if necessary
				if (options.disable){
					self.prop('disabled', true);
				}
				if (isAlert && options.expire){
					setTimeout(function() {
						notification.trigger('exit', false);
				    }, options.expire);
				}
			});
		}
		
		// Return self for chaining
		return self;
	}
});

/**
 * Change Log
 * 
 * v0.1 2015-08-24
 * 	- Initial implementation. Includes alert and confirm notifications. 
 *
 */