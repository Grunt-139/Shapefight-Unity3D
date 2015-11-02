//Widget_Camera.js: A script to control the camera and make it smoothly follow widget.
// The object we want to follow and look at . 
var target : Transform;

//Reference to Camera Object
var myCamera : Transform;

// The distance for X and Z for the camera to stay from the target
var distance = 10.0;
// the distance in Y for the camera to stay from the target
var height = 5.0;

//The camera controls for looking at the target
var camSpeed = 10.0;

var rotateSpeed = 5.0;

var deathRotateSpeed = 5.0;

//Camera's original position
private var originalPosition : Vector3;
private var originalRotation : Quaternion;
private var moveDirection : Vector3 = new Vector3(0,0,0);
private var targetPoint : Vector3;
private var targetVector : Vector3  =  new Vector3();
private var deathPanIn: boolean = true;

//States
enum CamStates{
ATTACK,
RETURN,
DEATH,
NONE}

static var curState : CamStates;


function Awake(){
	if(myCamera)
	{
		curState = CamStates.NONE;
		originalPosition = myCamera.localPosition;
		originalRotation = myCamera.rotation;
		originalTarget = target;
	}
}

function LateUpdate () {
	
	//print(curState);
	
	FacePoint(target.position,rotateSpeed);
	
	switch(curState)
	{
		case CamStates.ATTACK:
		//Move to the target location
		attackMove();
		break;
		
		case CamStates.RETURN:
		//Return to original position
		returnMove();
		break;
		
		case CamStates.DEATH:
		//When the player dies rotate around the player
		deathMove();
		break;
		
		case CamStates.NONE:
		//Do nothing
		break;
	}
}

function setAttack(){
	//Sets the state to Attack
	curState = CamStates.ATTACK;
}

function setReturn(){
	//Sets the state to Return
	curState = CamStates.RETURN;
}

function setDeath(){
	curState = CamStates.DEATH;
}

private function attackMove(){

	
	moveDirection = transform.TransformDirection(Vector3.forward);
	moveDirection*= camSpeed;
	
	var distanceToPoint : Vector3 = target.position - myCamera.position;
	//print(distanceToPoint.magnitude);

	if(distanceToPoint.magnitude < distance-2)
	{
		curState = CamStates.NONE;
		return;
	}
	
	myCamera.position += moveDirection *Time.deltaTime; 
	
}

private function returnMove(){
	
	
	moveDirection = transform.TransformDirection(Vector3.forward*-1);
	moveDirection*= camSpeed;
	var distanceToPoint : Vector3 =  originalPosition - myCamera.localPosition;
	
	//print(distanceToPoint.magnitude);

	if(distanceToPoint.magnitude < 0.5)
	{
		curState = CamStates.NONE;
		return;
	}
	
	myCamera.position += moveDirection *Time.deltaTime; 
	
}

private function deathMove(){
	myCamera.transform.RotateAround(target.position, Vector3.up, deathRotateSpeed * Time.deltaTime);

	targetVector = target.position - myCamera.position;
	
	if(deathPanIn && targetVector.magnitude > distance)
	{
		myCamera.position += targetVector.normalized * rotateSpeed*0.001;
		
		if(targetVector.magnitude - distance < 2)
		{
			deathPanIn = false;
		}
	}
	else if(!deathPanIn)
	{
		myCamera.position += targetVector.normalized * -rotateSpeed*0.001;
		
		if(targetVector.magnitude > distance*2)
		{
			deathPanIn = true;
		}
	}
}


function FacePoint(targetLocation : Vector3, rotateSpeed : float)
{
	var wantedRotation = Quaternion.LookRotation(targetLocation - myCamera.position);
	// Rotate
	myCamera.rotation = Quaternion.Slerp(myCamera.rotation,wantedRotation,Time.deltaTime*rotateSpeed);

}

@script AddComponentMenu("Camera/GameCamera")