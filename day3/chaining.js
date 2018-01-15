var account = {
    id : "",
    password: "",
    setId : function(myId) {
        this.id = myId;
        return this;
    },
    setPassword : function(myPassword) {
        this.password = myPassword;
        return this;
    },
    print : function () {
        console.log("id:"+ this.id);
        console.log("password:" + this.password);
    }
};

account.setId('id').setPassword('1234').print();