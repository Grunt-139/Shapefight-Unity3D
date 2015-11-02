#pragma strict

var moveSpeed =6.0;
var jumpBoost =2.0;
var jumpHeight =8.0;
var rotateSpeed =4.0;

private var moveDirection = Vector3.zero;
private var grounded:boolean = false;
private var moveHorz =0.0;
private var rotateDirection = Vector3.zero;
private var isDead : boolean = false;

var myCamera : GameCamera;
var status : PlayerStatus;
var isControllable:boolean = true;
var canJump:boolean = true;

//Weapon object
var weapon: GameObject;
//Player object
var controller: Transform;

private var isJumping : boolean = false;

function Start(){
	animation["DeathCube"].wrapMode = WrapMode.Once;
}


function FixedUpdate(){

	if(!isControllable)
	{
		Input.ResetInputAxes();
	}
	else
	{
		if(grounded){
		
			weapon.SetActive(false);
			moveDirection = new Vector3(Input.GetAxis("Horizontal"),0,Input.GetAxis("Vertical"));
			moveDirection = transform.TransformDirection(moveDirection);
			moveDirection *= moveSpeed;
			
			moveHorz = Input.GetAxis("Horizontal");
			if(moveHorz > 0)		//right Turn
			{
				rotateDirection = new Vector3(0,1,0);
			}
			else if(moveHorz <0)	//left turn
			{
				rotateDirection = new Vector3(0,-1,0);
			}
			else
			{
				rotateDirection = new Vector3(0,0,0);
			} 
			
			//Attack 1
			if(Input.GetButton("Jump")){
				if(canJump)
				{
					moveDirection.y = jumpHeight;
					moveDirection.x *=jumpBoost;
					moveDirection.z *=jumpBoost;
					rotateDirection = new Vector3(0,0,0);
					grounded = false;
					weapon.SetActive(true);
					myCamera.setAttack();
					
					isJumping = true;
				}
			}
			
			
		}
		else if(!grounded)
		{
			weapon.SetActive(true);
			
			if(isJumping)
			{
				if(Input.GetButtonUp("Jump")){
					moveDirection.y *= 0;
					myCamera.setReturn();
				}
			}
			
		}
		
		controller.position += moveDirection * Time.deltaTime;
		controller.Rotate(rotateDirection*Time.deltaTime, rotateSpeed);
	}
}		
	
function OnCollisionEnter(otherObject: Collision)
{
	if(!status.isDead())
	{
		if(otherObject.gameObject.tag == "Border")
		{
			weapon.SetActive(false);
			moveDirection = transform.TransformDirection(Vector3.forward*-1);
			moveDirection *=moveSpeed;
			
			//Move Player
			controller.position += moveDirection * Time.deltaTime;
		}
		
		if(!grounded)
		{
			if(otherObject.gameObject.tag == "Terrain")
			{
				grounded=true;
				isJumping = false;
				weapon.SetActive(false);
				myCamera.setReturn();
			}
		}
	}
}

function death(){

	if(!isDead)
	{
		weapon.SetActive(false);
		isControllable = false;
		animation.Play("DeathCube");
		isDead = true;
		myCamera.setDeath();
		status.iDied();
	}
}
	

@script AddComponentMenu("Player/CubeController");