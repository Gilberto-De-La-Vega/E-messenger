import { _ } from 'meteor/underscore';
import { MeteorCameraUI } from 'meteor/okland:camera-ui';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class ProfileCtrl extends Controller {
    constructor() {
	super(...arguments);
	
	const profile = this.currentUser && this.currentUser.profile;
	this.name = profile ? profile.name : '';
    }

    updatePicture() {
		MeteorCameraUI.getPicture({ width: 100, height: 100 }, (err, data) => {
			if (err) return this.handleError(err);

			this.$ionicLoading.show({
				template: 'Updating picture...'
			});

			this.callMethod('updatePicture', data, (err) => {
				this.$ionicLoading.hide();
				this.handleError(err);
			});
		});
	}

    updateName() {
        if (_.isEmpty(this.name)) return;

        this.callMethod('updateName', this.name, (err) => {
            if (err) return this.handleError(err);
        });
        this.$ionicPopup.alert({
            title: 'Name Saved',
            template: this.name + ' saved',
            okType: 'button-positive button-clear'
        });
    }

    gotoSettings(){ this.$state.go('tab.settings'); }

    handleError(err) {
        if (err.error == 'cancel') return;
        this.$log.error('Profile save error ', err);

        this.$ionicPopup.alert({
            title: err.reason || 'Save failed',
            template: 'Please try again',
            okType: 'button-positive button-clear'
        });
    }
}

ProfileCtrl.$inject = ['$state', '$ionicLoading', '$ionicPopup', '$log'];