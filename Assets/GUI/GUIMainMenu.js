#pragma strict

var customSkin: GUISkin;
var mainMenuBG: Texture2D;
var mainTitle : Texture2D;

private var isLoading: boolean;

function OnGUI()
{
	if(customSkin)
	{
		GUI.skin = customSkin;
	}
		
	GUI.Box(Rect(0, 0, Screen.width, Screen.height), " ");
	GUI.DrawTexture(Rect(Screen.width*0.35, 0, Screen.width*0.85, Screen.height), mainMenuBG);
	GUI.Label(Rect(Screen.height, 110, mainTitle.width, mainTitle.height), mainTitle);
	
	//Start game
	if(GUI.Button(Rect(Screen.width *0.1, Screen.height * 0.25, 320, 80), "Begin Game"))
	{
		isLoading = true;
		Application.LoadLevel("SelectionScreen");
	}
	
	//Controls button
	if(GUI.Button(Rect(Screen.width *0.1, Screen.height * 0.4, 320, 80), "Controls"))
	{
		Application.LoadLevel("Controls");
	}
	
	//Credits
	if(GUI.Button(Rect(Screen.width *0.1, Screen.height * 0.55, 320, 80), "Credits"))
	{
		Application.LoadLevel("Credits");
	}
	
	//Quit
	if(GUI.Button(Rect(Screen.width *0.1, Screen.height * 0.7, 320, 80), "Quit Game"))
	{
		Application.Quit();
	}
	
	if(isLoading)
	{
		GUI.Label(Rect(Screen.width*0.5 - 50, Screen.height - 40, 100, 50), "Now Loading");
	}
}

@script ExecuteInEditMode()
@script AddComponentMenu("GUI/MainMenu")