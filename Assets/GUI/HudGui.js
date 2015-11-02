#pragma strict

var customSkin: GUISkin;
var pauseImage : Texture2D;

private var time: float;
private var startTime: float = 0;
private var kills:int;
private var screen : Screen;

private var min:int;
private var sec:int;
private var endTime:int;
private var isPaused: boolean = false;

var playerStatus: PlayerStatus;
playerStatus.GetComponent(PlayerStatus);



function Awake(){
	startTime = Time.time;
}

//Display
function OnGUI(){

	if(customSkin)
	{
		GUI.skin = customSkin;
	}
	
	if(!playerStatus.isDead())
	{
		pauseDisplay();
		TimeDisplay();
		KillDisplay();
	}
	else if(playerStatus.isDead())
	{
		deathDisplay();
	}
}

function pauseDisplay(){

	if(GUI.Button(Rect(screen.width *0.9, screen.height*0.1, 80, 80), "","PauseButton"))
	{
		if(!isPaused)
		{
			isPaused = true;
			Time.timeScale =0;
		}
		else if(isPaused)
		{
			isPaused = false;
			Time.timeScale = 1;
		}
	}
	
	if(isPaused)
	{
		GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), pauseImage);	
	}
}


//Setting up the time
function TimeDisplay(){
	time = Mathf.Floor( Time.time - startTime );
	min = time/60;
	sec = time%60;
	GUI.Label( Rect(screen.width*0.5,screen.height*0.10,200,40), "Time: "+min + ":" + sec);
}

//Displaying the players kills
function KillDisplay(){
	GUI.Label(Rect(screen.width*0.05,screen.height*0.1,200,40), "Kills: " + playerStatus.getKills());
}

function deathDisplay(){

	time = playerStatus.getEndTime();
	min = time/60;
	sec = time %60;
	GUI.Label(Rect(screen.width*0.25,screen.height *0.15,200,200),"Total Kills: " +playerStatus.getKills() );
	GUI.Label(Rect(screen.width*0.25,screen.height *0.25,200,200),"Total Time: " + min + ":" + sec);
	GUI.Label(Rect(screen.width*0.5,screen.height *0.15,200,200),"GAME OVER");
	
	if(GUI.Button(Rect(screen.width *0.5, screen.height*0.25, 320, 80), "Retry?"))
	{
		Application.LoadLevel(Application.loadedLevel);
	}
	
	if(GUI.Button(Rect(screen.width *0.5, screen.height*0.45, 320, 80), "Main Menu"))
	{
		Application.LoadLevel("MainMenu");
	}
	
	if(GUI.Button(Rect(screen.width *0.5, screen.height*0.65, 320, 80), "Quit"))
	{
		Application.Quit();
	}
}

@script AddComponentMenu("GUI/HUD");