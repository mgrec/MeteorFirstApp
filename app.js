// Global access
member = new Mongo.Collection("member");

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

    if (Meteor.userId()){
        FlowRouter.go('member');
    }

    FlowRouter.route('/', {
        name: 'home',
        action: function (params) {
            console.log("This is the home page");
            BlazeLayout.render('home', {main: ''});
        }
    });

    FlowRouter.route('/member', {
        name: 'member',
        action: function (params) {
            console.log("This is the member page");
            BlazeLayout.render('member', {main: ''});

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
                    member.insert({name: data.value});
                    data.value = '';
                }
            });
        }
    });

}
