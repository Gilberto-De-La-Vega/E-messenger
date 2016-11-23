// code adapted from: https://www.angular-meteor.com/tutorials/whatsapp/
import { _ } from 'meteor/underscore';
import { Accounts } from 'meteor/accounts-base';
import { Controller } from 'angular-ecmascript/module-helpers';

//Login Controller class
export default class LoginCtrl extends Controller {
    constructor($scope){
        super(...arguments);
        $scope.login_btn = false;
        $scope.create_btn = false;
        $scope.display_top_btns = true;

    }

    //Display Login Form
    login_btn_clicked(){
        this.$scope.login_btn = true;
        this.$scope.display_top_btns = false;
        this.$scope.create_btn = false;
    }

    //Display Register Form
    create_btn_clicked(){
        this.$scope.login_btn = false;
        this.$scope.create_btn = true;      
        this.$scope.display_top_btns = false;
    }

    //Login in existing user account
    login(){
        if(_.isEmpty(this.email) || _.isEmpty(this.password)) return;
        Meteor.loginWithPassword(this.email, this.password,
            (err) => {
                if (err) return this.handleError(err);
            }
        );
        //redirect to tab/chats
        this.$state.go('tab.chats');
    }

    //Create new user account
    register(){
        if(_.isEmpty(this.email) || _.isEmpty(this.password) || _.isEmpty(this.username)) return;
        keys = this.createKeys();
        //FIXME have a field where the suer inputs their actual name
        Accounts.createUser({
            username: this.username,
            email: this.email,
            password: this.password,
            createdAt: new Date(),
            profile: {
                name: '',
                picture: '',
                //contact dictionary {(key,value)}
                contacts: {},
                publicKey: [keys[0], keys[1]],
                privateKey: [keys[2]]

            }
        }, (err) => {
            if (err) return this.handleError(err);
        });
        //redirect to profile page
        this.$state.go('tab.chats');
        //this.$state.go('profile');
        //this.login_btn_clicked();
    }

    handleError(err){
        this.$log.error('Login error ', err);

        this.$ionicPopup.alert({
            title: err.reason || 'Login failed',
            template: 'Please try again',
            okType: 'button-positive button-clear'
        });
    }

    //methods to help encryption
    //FIXME: move these out of this file and put in methods.js
    createKeys(){
        lowPrimes = [3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59];//,61,67,71,73,79,83,89,97
                 // ,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179
                 // ,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269
                 // ,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367
                 // ,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461
                 // ,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571
                 // ,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661
                 // ,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773
                 // ,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883
                 // ,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];
        randNum = Math.floor(Math.random()*lowPrimes.length);
        p = lowPrimes[randNum];
        lowPrimes.splice(randNum, 1);
        randNum = Math.floor(Math.random()*lowPrimes.length);
        q = lowPrimes[randNum];
        N = p * q;
        phi = (p-1)*(q-1);
        e = this.rel_prime(phi);
        d = this.calculate_d(phi, e);
        console.log([N,e,d]);
        return [N, e, d];
    }

    rel_prime(phi){
      var rel=5;
       
      while (this.gcd(phi,rel)!=1){
        rel++;
      }
      return rel;
    }

    calculate_d(phi,e){
      var x, y, x1, x2, y1, y2, temp, r, prev_phi;
      prev_phi = phi;

      x2=1; x1=0; y2=0; y1=1;

      while (e>0){
        temp=parseInt(phi/e);
        r=phi-temp*e;
        x=x2-temp*x1;
        y=y2-temp*y1;
        phi=e;e=r;
        x2=x1;x1=x;
        y2=y1;y1=y;
        if (phi==1){
          y2+=prev_phi;
          break;
        }
      }
      return y2;
    }

    gcd (a, b) {
      var r;

      while (b>0) {
        r=a%b;
        a=b;
        b=r;
      }
      return a;
    }

}

LoginCtrl.$name = 'LoginCtrl';
LoginCtrl.$inject = ['$state', '$ionicLoading', '$ionicPopup', '$log'];
