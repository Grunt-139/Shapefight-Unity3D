#pragma strict


private var kills =0;
private var dead = false;
private var endTime = 0.0;

function getKills() : int{
	return kills;
}

function setKills(newValue:int)
{
	kills = newValue;
}

function increaseKills(increase:int){
	kills += increase;
}

function isDead() : boolean
{
	return dead;
}

function iDied(){
	dead = true;
	endTime = Time.time;
}

function getEndTime() : float{
	return endTime;
}



@script AddComponentMenu("Player/PlayerStatus");