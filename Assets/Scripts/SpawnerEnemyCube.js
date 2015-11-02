#pragma strict

var spawnBuffer = 10.0;

var maxSpawn = 1.0;
var minSpawnBuffer = 1.0;
var enemyPerWave =1.0;

var enemyCube : GameObject;

var playerStatus : PlayerStatus;

var wavePause =0.0;

//What wave to increase it on
var enemyIncreaseWave = 0;
var spawnBufferDecreaseWave =0;

//By how much
var enemyIncreaseRate = 1.00;
//100 and ... percent
enemyIncreaseRate *=1.01;
var spawnDecreaseRate =1.00;

private var curSpawned = 0;
private var curAlive =0;
private var nextSpawn=0;
private var curWave =0;
private var posX = 0.0;
private var posZ =0.0;

var playerWeapon : WeaponCollider;
//playerWeapon = GetComponent(WeaponCollider);

function Awake() {
	playerWeapon = GameObject.FindObjectOfType(WeaponCollider);
	playerStatus = GameObject.FindObjectOfType(PlayerStatus);
	
	//Change enemy increase rate to a percent
	enemyIncreaseRate *=0.01;
	
	//Change the spawn decrease rate to a percent
	spawnDecreaseRate *=0.01;

	//print(enemyIncreaseRate + " " + spawnDecreaseRate);
}

function Update () {
	
	if(!playerStatus.isDead())
	{
		//print("Cur Wave: " + curWave + " Spawn Buffer: " + Mathf.Round(spawnBuffer) + " EnemyPerWave: " + Mathf.Round(enemyPerWave) + " Cur Spawned: " + curSpawned);
		
		//print("Sphere " + curSpawned);
		if(Time.time > nextSpawn && curSpawned != Mathf.Round(enemyPerWave))
		{
			spawnEnemy();
		}
		
		if(curAlive ==0 && curSpawned==Mathf.Round(enemyPerWave) && Time.time > nextSpawn + wavePause)
		{
			//Reset curspawned so new enemies can be spawned
			curSpawned =0;
			
			spawnEnemy();
			
			
			if(curWave % enemyIncreaseWave ==0)
			{
				enemyPerWave *= (enemyPerWave + enemyIncreaseRate);
				
				if(Mathf.Round(enemyPerWave) > maxSpawn)
				{
					enemyPerWave = maxSpawn;
				}
				print("New Enemy: " + enemyPerWave);
			}
			
			if(curWave % spawnBufferDecreaseWave ==0)
			{
				spawnBuffer *= spawnDecreaseRate;
				
				if(Mathf.Round(spawnBuffer) < minSpawnBuffer)
				{
					spawnBuffer = minSpawnBuffer;
				}
				//print("New Spawn: " + minSpawnBuffer);
			}
		}
	}

}

function iDied(){
	curAlive --;
}


function spawnEnemy(){
	var randCorner = Random.value;
	
	if(randCorner <=0.25)
	{
		//Left Corner
		posX = 20;
		posZ =20;
	}
	else if(randCorner <=0.5)
	{
		//Right Corner
		posX =180;
		posZ =20;
	}
	else if(randCorner <=0.75)
	{
		//Other Left Corner
		posX = 20;
		posZ =180;
	}
	else if(randCorner <=1)
	{
		//Other Right Corner
		posX =180;
		posZ =180;
	}
		
		
	Instantiate(enemyCube,Vector3(posX,10,posZ),Quaternion.identity);
	curSpawned++;
	curAlive++;
	nextSpawn = Time.time + Mathf.Round(spawnBuffer);
	playerWeapon.loadEnemies();
}

@ script AddComponentMenu("Enemy/SphereSpawner");