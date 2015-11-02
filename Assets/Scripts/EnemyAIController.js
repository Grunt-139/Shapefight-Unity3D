#pragma strict
//This will handle each Enemy's movement and attacks


var moveSpeed = 1.0;
var rotateSpeed = 1.0;
var attackBoost = 1.0;
var attackRotateSpeed = 1.0;

var jumpHeight =10.0;


var directionTraveltime = 2.0;
var wanderTime = 1.5;
var attackDistance = 15.0;
var reactDistance = 25.0;

var aggressiveness = 0.0;

var attackCooldown = 0.0;

var weapon : GameObject;
var playerStatus : PlayerStatus;

//Sphere specific--These are the two halves of the sphere, this is used when it moves so both halves can rotate
var leftHalf : Transform;
var rightHalf : Transform;

//------------------------------------------------------------------

private var lastAttackTime = 0.0;
private var distanceToPlayer = Vector3.zero;
private var timeToNewDirection = 0.0;
private var isAttacking : boolean = false;
private var moveDirection = new Vector3(0,0,0);
private var targetPoint = new Vector3(0,0,0);
private var distanceToTarget = new Vector3(0,0,0);
private var isGrounded : boolean = false;
private var randAttack : float = 0.0;

//Cache to their spawner objects
private var sphereSpawner : SpawnerEnemySphere;
private var cubeSpawner : SpawnerEnemyCube;

private var dead:boolean = false;

private var targetPlayer : Transform;

private var deathAnimation : String = "";

//Cache the transform so it will move
private var enemyTransform : Transform;
enemyTransform = GetComponent(Transform);


//Game States
enum GameStates{
WANDER,
ATTACK,
DEFEND,
SEE_PLAYER,
DEATH
}

var gameState : GameStates;  

function Start () {
	if (!targetPlayer)
	{
		if(enemyTransform.tag == "EnemyCube")
		{
			targetPlayer = GameObject.FindWithTag("PlayerSphere").transform;
			cubeSpawner = GameObject.FindObjectOfType(SpawnerEnemyCube);
		}
		else if(enemyTransform.tag == "EnemySphere")
		{
			targetPlayer = GameObject.FindWithTag("PlayerCube").transform;
			sphereSpawner = GameObject.FindObjectOfType(SpawnerEnemySphere);
		}
		
		playerStatus = GameObject.FindObjectOfType(PlayerStatus);
	}
	
	//Set up animations
	if(enemyTransform.tag == "EnemyCube")
	{
		animation["DeathCube"].wrapMode = WrapMode.Once;
		deathAnimation = "DeathCube";
	}
	else if(enemyTransform.tag == "EnemySphere")
	{
		animation["Death"].wrapMode = WrapMode.Once;
		deathAnimation = "Death";
			
	}
	
	weapon.SetActive(false);
	
	gameState = GameStates.WANDER;
}


function Update(){

	distanceToPlayer = enemyTransform.position - targetPlayer.position;
	
	//print(gameState);

	if(!playerStatus.isDead())
	{
		switch(gameState)
		{
			case GameStates.WANDER:
				wander();
				break;
			
			case GameStates.ATTACK:
				Attack();
				break;
			
			case GameStates.DEFEND:
				Defend();
				break;
			
			case GameStates.SEE_PLAYER:
				FoundPlayer();
				break;
				
			case GameStates.DEATH:
				//Do nothing
				break;
		}
	}
}


function wander(){
	//print("Wander");
	
	if(Time.time > timeToNewDirection)
	{
		findNewDirection();
	}
	
	moveDirection = transform.TransformDirection(Vector3.forward);
	moveDirection*= moveSpeed;
	
	
	if(enemyTransform.tag == "EnemySphere")
	{
		rightHalf.Rotate(Vector3(0,0,1)*Time.deltaTime,rotateSpeed);
		leftHalf.Rotate((Vector3(0,0,1)*Time.deltaTime)*-1, rotateSpeed);
	}
	
	enemyTransform.position += moveDirection* Time.deltaTime;
	
	if(distanceToPlayer.magnitude < reactDistance)
	{
		gameState = GameStates.SEE_PLAYER;
	}
}

function FoundPlayer(){
	
	//print("Found you");
	
	//print("Can Attack: " + (distanceToPlayer.magnitude < attackDistance) + " " + (Time.time > lastAttackTime+attackCooldown) + "Should defend " + (distanceToPlayer.magnitude > attackDistance) + " " + (Time.time < lastAttackTime + attackCooldown));
	
	var whatToDo = Random.value;
	//What shall we do with a drunken sailor,
	//What shall we do with a drunken sailor,
	//What shall we do with a drunken sailor,
	//Early in the morning?
	
	//Several Checks need to be made
	//1. Is the player in range and time is past the cooldown point-> high chance to Attack, low to run
	//2. Is the player out of range, and time is wrong -> low chance to move closer to attack, high to run
	//3. Is the player out of range, and time is right -> high chance to move closer to attack, low chance to run
	//4. Is the player inside, and time is wrong - > very high chance to avoid, low to attack
	//5. Out of react distance
	
	//Check 1
	//Are they in range and time is right
	if( (distanceToPlayer.magnitude < attackDistance) && (Time.time > lastAttackTime+attackCooldown))
	{
	

			if(whatToDo >0.3)
			{	//Attack!!
			//	print("Attack Check 1");
				gameState = GameStates.ATTACK;
				return;
			}
			else if(whatToDo <=0.3)
			{	//Avoid!!
			//	print("Defend Check 1");
				gameState = GameStates.DEFEND;
				return;
			}
	}
	
	//Check 2
	//Out of range, time is wrong
	if((distanceToPlayer.magnitude > attackDistance) && (Time.time < lastAttackTime + attackCooldown))
	{
		if(whatToDo >=0.2)
		{
		//	print("Defend Check 2");
			gameState = GameStates.DEFEND;
			return;
		}
		else if(whatToDo < 0.2)
		{
		//	print("Attack Check 2");
			gameState = GameStates.ATTACK;
			return;
		}
	}
	
	//Check 3
	//Out of range, time is right
	if((distanceToPlayer.magnitude > attackDistance) && (Time.time > lastAttackTime + attackCooldown))
	{
		if(whatToDo >=0.4)
		{
		//	print("Attack Check 3");
			gameState = GameStates.ATTACK;
			return;
		}
		else if(whatToDo < 0.4)
		{
		//	print("Defend TIME Check 3");
			gameState = GameStates.DEFEND;
			return;
		}
	}
	
	//Check 4
	//In range, time is wrong
	if((distanceToPlayer.magnitude < attackDistance) && (Time.time < lastAttackTime + attackCooldown))
	{
		if(whatToDo >0.1)
		{	//Avoid!!
		//	print("Defend Check 4");
			gameState = GameStates.DEFEND;
			return;
		}
		else if(whatToDo <=0.1)
		{	//Attack!!
		//	print("Attack Check 4");
			gameState = GameStates.ATTACK;
			return;
		}
	}
	
	//Check 5
	//Outside of reaction distance
	if(distanceToPlayer.magnitude > reactDistance)
	{
		//print("Whats a player?");
		gameState = GameStates.WANDER;
	}
}

function Attack(){

	//If its the right time to attack ATTACK!!!
	if(distanceToPlayer.magnitude < attackDistance && Time.time > lastAttackTime + attackCooldown)
	{
		if(enemyTransform.tag == "EnemyCube")
		{
			cubeAttack();
		}
		
		if(enemyTransform.tag == "EnemySphere")
		{
			sphereAttack();
		}
	}
	
	if(distanceToPlayer.magnitude > attackDistance)
	{
		//Face the player
		FacePlayer(targetPlayer.position,attackRotateSpeed);
		
		//Set is attacking and the weapon to false just in case
		isAttacking = false;
		weapon.SetActive(false);
		
		//Begin moving
		moveDirection = transform.TransformDirection(Vector3.forward);
		moveDirection*= moveSpeed;
		
		
		if(enemyTransform.tag == "EnemySphere")
		{
			rightHalf.Rotate(Vector3(0,0,1)*Time.deltaTime,rotateSpeed);
			leftHalf.Rotate((Vector3(0,0,1)*Time.deltaTime)*-1, rotateSpeed);
		}
		
		enemyTransform.position += moveDirection* Time.deltaTime;
	}
	
	
	//If the player moves outside of the react distance then the enemy should wander
	if(distanceToPlayer.magnitude > reactDistance)
	{
		gameState = GameStates.WANDER;
	}
}

function Defend(){
	//print("Defend");
	
	
	FacePlayer(targetPlayer.position, attackRotateSpeed);
	
	//Set is attacking and the weapon to false just in case
	isAttacking = false;
	weapon.SetActive(false);
	
	moveDirection = transform.TransformDirection(Vector3.forward*-1);
	moveDirection*= moveSpeed;
	
	
	if(enemyTransform.tag == "EnemySphere")
	{
		rightHalf.Rotate(Vector3(0,0,1)*Time.deltaTime,rotateSpeed);
		leftHalf.Rotate((Vector3(0,0,1)*Time.deltaTime)*-1, rotateSpeed);
	}
	
	enemyTransform.position += moveDirection* Time.deltaTime;


	if(distanceToPlayer.magnitude > reactDistance)
	{
		gameState = GameStates.WANDER;
	}

	//Check to see if in range and if they can attack
	if(distanceToPlayer.magnitude < attackDistance && Time.time > attackCooldown + lastAttackTime)
	{
		gameState = GameStates.SEE_PLAYER;
	}

}


function cubeAttack(){

	//print("Attack Cube");
	
	if(!isAttacking)
	{		
		var target =  new Vector3();
		target.y = 0;
		target = targetPlayer.position - enemyTransform.position;
		targetPoint = enemyTransform.position + (target.normalized*50);
		
		randAttack = Random.value;
	}

	isAttacking = true;
	FacePlayer(targetPoint,attackRotateSpeed);
	weapon.SetActive(true);


	// depending on the angle, start moving
	moveDirection = transform.TransformDirection(Vector3.forward);
	moveDirection *= moveSpeed;
	
	//Check to see if the player is in the air i.e attacking
	if(targetPlayer.position.y < 5)
	{
		if(randAttack > 0.8)
		{
			moveDirection.y =0;
		}
		else if(randAttack <= 0.8)
		{
			isGrounded = false;
			moveDirection.y = jumpHeight;
		} 
	}
	else if(targetPlayer.position.y > 5)
	{
		if(randAttack > 0.4)
		{
			moveDirection.y =0;
		}
		else if(randAttack <= 0.4)
		{
			isGrounded = false;
			moveDirection.y = jumpHeight;
		} 
	}
		
	moveDirection.x *= attackBoost;
	moveDirection.z *= attackBoost;
	enemyTransform.position += moveDirection * Time.deltaTime;
	
	distanceToTarget = enemyTransform.position - targetPoint;

	if(distanceToTarget.magnitude < 5)
	{
		isAttacking = false;
		lastAttackTime = Time.time;
		weapon.SetActive(false);
		
		gameState = GameStates.WANDER;
	}
	
}

function sphereAttack(){

	//print("Attack Sphere");
	
	if(!isAttacking)
	{		
		var target =  new Vector3();
		target.y = 0;
		target = targetPlayer.position - enemyTransform.position;
		targetPoint = enemyTransform.position + (target.normalized*50);
		randAttack = Random.value;
	}
	
	isAttacking = true;
	FacePlayer(targetPoint,attackRotateSpeed);
	weapon.SetActive(true);
	
	// depending on the angle, start moving
	moveDirection = transform.TransformDirection(Vector3.forward);
	moveDirection *= moveSpeed;
		
	moveDirection.x *= attackBoost;
	moveDirection.z *= attackBoost;
	
	isGrounded = false;
	
	//If the player is in the air or not i.e attacking
	if(targetPlayer.position.y < 5)
	{
		if(randAttack > 0.4)
		{
			moveDirection.y =0;
		}
		else if(randAttack <= 0.4)
		{
			isGrounded = false;
			moveDirection.y = jumpHeight;
		} 
	}
	else if(targetPlayer.position.y > 5)
	{
		if(randAttack > 0.5)
		{
			moveDirection.y =0;
		}
		else if(randAttack <= 0.5)
		{
			isGrounded = false;
			moveDirection.y = jumpHeight;
		} 
	}

		
	rightHalf.Rotate(Vector3(0,0,1)*Time.deltaTime,rotateSpeed*attackBoost);
	leftHalf.Rotate((Vector3(0,0,1)*Time.deltaTime)*-1, rotateSpeed*attackBoost);
	
	enemyTransform.position += moveDirection * Time.deltaTime;
	
	
	distanceToTarget = enemyTransform.position - targetPoint;
	
	//print(distanceToTarget.magnitude);
	
	if(distanceToTarget.magnitude < 5)
	{
		isAttacking = false;
		lastAttackTime = Time.time;
		weapon.SetActive(false);
		gameState = GameStates.WANDER;
	}
		
}

function FacePlayer(targetLocation : Vector3, rotateSpeed : float)
{
	var wantedRotation = Quaternion.LookRotation(targetLocation - enemyTransform.position);
	// Rotate
	enemyTransform.rotation = Quaternion.Slerp(enemyTransform.rotation,wantedRotation,Time.deltaTime*rotateSpeed);
	
	//Zero out the x and z rotation so it doesnt rotate upwards
	enemyTransform.rotation.x =0;
	enemyTransform.rotation.z =0;
	
}



function OnCollisionEnter(otherObject: Collision)
{
	if(otherObject.gameObject.tag !="Terrain")
	{
		//Change Direction
		enemyTransform.rotation *= Quaternion.AngleAxis(180,enemyTransform.up);
		timeToNewDirection = Time.time + directionTraveltime;
	}
	
	if(otherObject.gameObject.tag != "Terrain" && enemyTransform.position.y > otherObject.gameObject.transform.position.y)
	{
		isGrounded = false;
	}
	
	
	if(otherObject.gameObject.tag == "Terrain")
	{
		isGrounded=true;
		
		if(enemyTransform.tag == "EnemyCube" && isAttacking ==true)
		{
			isAttacking = false;
			lastAttackTime = Time.time;
			weapon.SetActive(false);
			gameState = GameStates.WANDER;
		} 
	}
	
	//Make enemy Sphere bounce off the player cube
	if(otherObject.gameObject.tag == "PlayerCube" && enemyTransform.tag == "EnemySphere")
	{
		weapon.SetActive(false);
		moveDirection = transform.TransformDirection(Vector3.forward*-1);
		moveDirection *=moveSpeed;
		
		//Move Player
		enemyTransform.position += moveDirection * Time.deltaTime;
	}

}

function findNewDirection(){

	timeToNewDirection = Time.time + directionTraveltime;
	var randRotation = Random.Range(0,360);	
	// Rotate
	enemyTransform.rotation *= Quaternion.AngleAxis(randRotation,enemyTransform.up);
}


function isDead() : boolean
{
	return dead;
}


function death(){

	gameState = GameStates.DEATH;
	
	weapon.SetActive(false);
	moveDirection = Vector3(0,0,0);
	dead = true;
	animation.Stop();
	animation.Play(deathAnimation);
	
	if(enemyTransform.tag == "EnemyCube")
	{
		cubeSpawner.iDied();
	}
	else if(enemyTransform.tag == "EnemySphere")
	{
		sphereSpawner.iDied();
	}
	
	Destroy(gameObject,animation[deathAnimation].length-0.1f);
}


@script AddComponentMenu("Enemy/AI");