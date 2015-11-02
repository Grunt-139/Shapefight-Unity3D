#pragma strict

var customSkin: GUISkin;
var controlsBG : Texture2D;
var sphereAttack1 : Texture2D;
var sphereAttack2 : Texture2D;
var cubeAttack : Texture2D;
var mainTitle : Texture2D;

private var isLoading: boolean;

function OnGUI(){

	if(customSkin)
	{
		GUI.skin = customSkin;
	}
		
	GUI.Box(Rect(0, 0, Screen.width, Screen.height), " ");
	GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), controlsBG);
	GUI.Label(Rect(Screen.width*0.37, Screen.height*0.01, mainTitle.width, mainTitle.height), mainTitle);
	
	//Controls and Objectives
	GUI.Label(Rect(Screen.width *0.2, Screen.height *0.2, 300,200), "Objective: \n			Defeat the enemy shapes.\n			You will play either as a Sphere or a Cube, \n			As a Cube you will fight Spheres, \n			as a Sphere you will fight Cubes.");
	GUI.Label(Rect(Screen.width *0.2, Screen.height *0.3, 300,200), "Controls: \n			W-Forward\n			S-Back\n			A-Rotate left\n			D-Rotate right\n			Space-Jump (Sphere) & Attack(Cube)");
	
	//Combat texts
	GUI.Label(Rect(Screen.width *0.55, Screen.height *0.2, 300,200), "Attacks:");
	
	GUI.Label(Rect(Screen.width *0.70, Screen.height *0.25, 500,200), "The Spheres main attack is a large Spike appearing in front of it once it gets to top speed. Use this to spear enemy Cubes.");
	GUI.Label(Rect(Screen.width *0.70, Screen.height *0.45, 500,200), "The Spheres secondary attack is that once it gets up to attack speed it can jump or leap over Enemy Cubes (or spear them in mid jump).");
	GUI.Label(Rect(Screen.width *0.70, Screen.height *0.65, 500,200), "Unlike the Sphere, the Cube´s attack is simple. When it jumps, a blade appears beneath it. Use it to slice Spheres in half.");
	//Combat Screencaps
	GUI.DrawTexture(Rect(Screen.width *0.55, Screen.height * 0.25, Screen.width *0.15, Screen.height *0.2),sphereAttack1);
	GUI.DrawTexture(Rect(Screen.width *0.55, Screen.height * 0.45, Screen.width *0.15, Screen.height *0.2),sphereAttack2);
	GUI.DrawTexture(Rect(Screen.width *0.55, Screen.height * 0.65, Screen.width *0.15, Screen.height *0.2),cubeAttack);
	
	if(GUI.Button(Rect(Screen.width*0.05,Screen.height*0.8, 320, 80), "Back"))
	{
		isLoading = true;
		Application.LoadLevel("MainMenu");
	}
	
	if(isLoading)
	{
		GUI.Label(Rect(Screen.width/2 - 50, Screen.height - 40, 100, 50), "Now Loading");
	}
}

@script ExecuteInEditMode();
@script AddComponentMenu("GUI/ControlScreenGUI");