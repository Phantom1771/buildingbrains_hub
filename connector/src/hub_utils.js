var r1 = 0;
module.exports = {
    init: function(Contex) {
        console.log('Initialize hub');
        this.setLED("R")
        this.routine1();
        this.routine2();
        this.routine3();
    },
    setLED: function(state) {
        if(state == 'R')
            console.log('Running');
        else if (state == 'NF')
            console.log('Not Functioning');
        else if (state == 'W')
            console.log('Waiting');
    },
    routine1: function() {
        console.log('Routine 1: '+ r1);
    },
    routine2: function() {
        console.log('Routine 2');
    },
    routine3: function() {
        console.log('Routine 3');
    }
}
