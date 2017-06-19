const Command = require('command')
module.exports = function Drop(dispatch) {
const command = Command(dispatch)
    let cid,
        model,
        name,
        location,
        zone,
        currHp,
        maxHp;

    let castPassive = false;
    let fallDistance = 0;

    dispatch.hook('S_LOGIN', 2, (event) => {
        ({
            cid,
            model,
            name
        } = event);

        castPassive = ((model - 100) / 200 % 50) === 3;
    });

    dispatch.hook('S_LOAD_TOPO', 1, (event) => {
        zone = event.zone;
    });
			
	dispatch.hook('S_PLAYER_STAT_UPDATE', 4, event =>{
			currHp = event.curHp
			maxHp = event.maxHp
	})
	
    dispatch.hook('S_CREATURE_CHANGE_HP', 2, (event) => {
        if (event.target.toString() == cid.toString()) {
            currHp = event.curHp;
            maxHp = event.maxHp;
        }
    });

    dispatch.hook('S_SPAWN_ME', 1, (event) => {});

    dispatch.hook('C_PLAYER_LOCATION', 1, (event) => {
        location = event;
    });

    command.add('drop', amount => {
	amount = Number(amount)

            if (amount && currHp && maxHp) {
                let amountToDrop = (currHp * 100 / maxHp) - amount;

                if (amount < 100 && amount > 0 && amountToDrop > 0) {

                    if (!castPassive)
                        fallDistance = 400 + (amountToDrop * 10);
                    else {
                        fallDistance = 400 + (amountToDrop * 20);
                    }
                    dispatch.toServer('C_PLAYER_LOCATION', 1,{
						x1: location.x1,
						y1: location.y1,
						z1: (location.z1 - fallDistance),
						w: location.w,
						x2: location.x1,
						y2: location.y1,
						z2: location.z1,
						type: 2,
						speed: 0,
						unk: 0,
						time: 0
					})
                }
            }
    });
};
