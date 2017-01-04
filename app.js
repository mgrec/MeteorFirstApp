// Global access
member = new Mongo.Collection("member");
user = new Mongo.Collection("user");

user.insert({pseudo: 'root', pass: 'toor'});

if (Meteor.isServer) {
    Meteor.startup
    (
        function () {
            // Populate once
            if (!member.find().count()) {

            }
        }
    );
}

if (Meteor.isClient) {
    FlowRouter.route('/', {
        name: 'home',
        action: function (params) {
            if (Session.get('user_id') != null) {
                FlowRouter.go('member');
            } else {
                BlazeLayout.render('home', {main: ''});
            }
        }
    });

    FlowRouter.route('/logout', {
        name: 'home',
        action: function (params) {
            delete Session.keys['user_id'];
            FlowRouter.go('/');
        }
    });

    Template.home.events({
        "click #connect": function (e, t) {
            dataPseudo = t.find("#pseudo").value;
            dataPass = t.find("#password").value;
            userCurrent = user.findOne({pseudo: dataPseudo, pass: dataPass});
            if (userCurrent != null) {
                Session.set('user_id', userCurrent._id);
                FlowRouter.go('member');
            } else {
                FlowRouter.go('/error-login');
            }

        }
    });

    FlowRouter.route('/error-login', {
        name: 'error_login',
        action: function (params) {
            BlazeLayout.render('error_login', {main: ''});
        }
    });

    FlowRouter.route('/member/:_id', {
        name: 'member_spe',
        action: function (params) {

            if (Session.get('user_id') != null) {
                Session.set("member_id", params._id);
                BlazeLayout.render('member_spe', {main: ''});
            } else {
                FlowRouter.go('/');
            }
        }
    });

    FlowRouter.route('/member', {
        name: 'member',
        action: function (params) {

            if (Session.get('user_id') != null) {
                BlazeLayout.render('member', {main: ''});
            } else {
                FlowRouter.go('/');
            }
        }
    });

    Template.member_spe.helpers
    ({
        member: function () {
            return member.findOne({_id: Session.get("member_id")});
        }
    });

    Template.member_spe.events
    ({
        "click #return": function () {
            FlowRouter.go('member');
        }
    });

    Template.member.helpers
    ({
        all_eleves: function () {
            return member.find();
        }
    });

    Template.member.events
    ({
        "click #remove": function () {
            data = this._id;
            member.remove({_id: data})
        },

        "click #update": function (e, t) {
            dataId = this._id;
            dataName = this.name;
            document.getElementById("data-update").value = dataName;
            document.getElementById('content-update').style.display = "block";
            document.getElementById('name').innerHTML = dataName;
        },

        "click #save": function (e, t) {
            val = document.getElementById("data-update").value;
            document.getElementById('content-update').style.display = "none";
            console.log(dataName);
            member.update(
                {_id: dataId},
                {
                    $set: {name: val}
                }
            );
            document.getElementById("data-update").value = '';
        },

        "click #ActionNewUser": function (e, t) {

            data = t.find("#NewUser");
            console.log(data.value);
            member.insert({name: data.value});
            data.value = '';
        },

        "click #spe": function (e, t) {
            FlowRouter.go('/member/' + this._id);
        }
    });
}
