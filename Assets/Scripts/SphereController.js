#pragma strict


var jumpBoost =2.0;
var jumpHeight =8.0;
var maxSpeed=6.0; //Top Speed
var maxRotateSpeed=4.0; //Top Rotate Speed

//This is the friction added to turning, they are added as whole percentages in the editor and then simply converted to an actual percent here
var turnFriction = 10.0;
turnFriction *=0.01;
var attackTurnFriction =10.0;
attackTurnFriction *=0.01;


var myCamera: GameCamera;
var status : PlayerStatus;
var weapon: GameObject;


var leftHalf: Transform;
var rightHalf: Transform;


private var moveDirection = Vector3.zero;
private var grounded:boolean = false;
private var moveHorz =0.0;
private var moveVert =0.0;
private var rotateDirection = Vector3.zero;
private var halvesRotateDirection = Vector3.zero;
private var camTempX:float;
private var camTempY:float;
private var camTempZ:float;
private var moveSpeed:float = maxSpeed;
private var rotateSpeed:float = maxRotateSpeed;
private var isAttacking:boolean = false;
private var isDead:boolean = false;


var isControllable:boolean = true;

var controller: Transform;

function Start(){
	animation["Death"].wrapMode = WrapMode.Once;
}

function FixedUpdate(){
	
	if(!isControllable)
	{
		Input.ResetInputAxes();
	}
	else
	{
		if(grounded){
		
			moveSpeed = maxSpeed; //Move speed is reset to the max speed so it can be altered by the sphere's rotation but still be able to reach top speed
			rotateSpeed = maxRotateSpeed;
			weapon.SetActive(false);
			moveDirection = new Vector3(Input.GetAxis("Horizontal"),0,Input.GetAxis("Vertical"));
			moveDirection = transform.TransformDirection(moveDirection);
			
			moveVert = Input.GetAxis("Vertical");
			//This is to rotate the halves
			if(moveVert >0)
			{
				//Rotate forward
				halvesRotateDirection = new Vector3(0,0,-1);
			}
			else if(moveVert <0)
			{
				//Rotate backward
				halvesRotateDirection = new Vector3(0,0,1);
			}
			else
			{
				//Null out rotation
				halvesRotateDirection = new Vector3(0,0,0);
			}
			
			//print("Pre friction " + moveDirection);
			
			moveHorz = Input.GetAxis("Horizontal");
			if(moveHorz > 0)		//right Turn
			{
				rotateDirection = new Vector3(0,1,0);
				
				if(isAttacking)
				{
					moveSpeed *=attackTurnFriction;
				}
				else if (!isAttacking)
				{
					moveSpeed *=turnFriction;
				}
				
			//	print("Post friction " + moveDirection);
			}
			else if(moveHorz <0)	//left turn
			{
				rotateDirection = new Vector3(0,-1,0);
				
				if(isAttacking)
				{
					moveSpeed *=attackTurnFriction;
				}
				else if (!isAttacking)
				{
					moveSpeed *=turnFriction;
				}
				
			//	print("Post friction " + moveDirection);
			}
			else
			{
				rotateDirection = new Vector3(0,0,0);
			} 
			
			
			//print(moveSpeed);
			//Move speed has been messed with so now it can be applied to the direction
			moveDirection *= moveSpeed;
			
			//print(moveVert);
			
			//Attack Controls
			//Attack 1
			if(moveVert > 0.9){
				moveDirection.x *=jumpBoost;
				moveDirection.z *=jumpBoost;
				weapon.SetActive(true);
				isAttacking = true;
				myCamera.setAttack();
			}
			else if(moveVert < 0.5)
			{
				weapon.SetActive(false);
				isAttacking = false;
				myCamera.setReturn();
			}
			//Jump during attack
			if(Input.GetButton("Jump") && isAttacking){
						
				moveDirection.y =jumpHeight;
				grounded = false;
			}
		}
		
		
		//Move Player
		controller.position += moveDirection * Time.deltaTime;
		controller.Rotate(rotateDirection*Time.deltaTime, rotateSpeed);
		
		if(!isAttacking)
		{
			//Rotate the sphere's halves
			rightHalf.Rotate(halvesRotateDirection*Time.deltaTime,rotateSpeed*moveVert);
			leftHalf.Rotate((halvesRotateDirection*Time.deltaTime)*-1, rotateSpeed*moveVert);
		}
		else if (isAttacking)
		{
			//Rotate the sphere's halves
			rightHalf.Rotate(halvesRotateDirection*Time.deltaTime,rotateSpeed*moveVert*jumpBoost);
			leftHalf.Rotate((halvesRotateDirection*Time.deltaTime)*-1, rotateSpeed*moveVert*jumpBoost);
		}
		
	}
}	
	
	
function OnCollisionEnter(otherObject: Collision)
{
	if(otherObject.gameObject.tag == "Border")
	{
		weapon.SetActive(false);
		moveDirection = transform.TransformDirection(Vector3.forward*-1);
		moveDirection *=moveSpeed;
		
		//Move Player
		controller.position += moveDirection * Time.deltaTime;
	}
	
	//Make the player bounce off enemyCubes
	if(otherObject.gameObject.tag == "EnemyCube")
	{
		weapon.SetActive(false);
		moveDirection = transform.TransformDirection(Vector3.forward*-1);
		moveDirection *=moveSpeed*5;
		
		//Move Player
		controller.position += moveDirection * Time.deltaTime;
	}
	
	if(!grounded)
	{
		if(otherObject.gameObject.tag == "Terrain")
		{
			grounded=true;
			weapon.SetActive(false);
		}
	}
}

function death(){

	if(!isDead)
	{
		weapon.SetActive(false);
		isDead = true;
		isControllable = false;
		animation.Play("Death");
		myCamera.setDeath();
		status.iDied();
	}
}
	


@script AddComponentMenu("Player/SphereController");