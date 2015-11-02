#pragma strict

var customSkin: GUISkin;
var selectionBG: Texture2D;
var mainTitle : Texture2D;

private var isLoading: boolean;

function OnGUI(){

	if(customSkin)
	{
		GUI.skin = customSkin;
	}
		
	GUI.Box(Rect(0, 0, Screen.width, Screen.height), " ");
	GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), selectionBG);
	GUI.Label(Rect(Screen.width*0.37, Screen.height*0.1, mainTitle.width, mainTitle.height), mainTitle);
	GUI.Label(Rect(Screen.width *0.45, Screen.height*0.3,320,80), "Select your shape", "TitleLabel");
	
	//Type labels
	GUI.Label(Rect(Screen.width *0.25, Screen.height*0.35,320,80), "Sphere","TitleLabel");
	GUI.Label(Rect(Screen.width *0.68, Screen.height*0.35,320,80), "Cube","TitleLabel");
	
	if(GUI.Button(Rect(Screen.width*0.22,Screen.height*0.40, Screen.width*0.10, Screen.width*0.10),"", "SphereButton"))
	{
		isLoading = true;
		Application.LoadLevel("SphereLevel");
	}
	
	if(GUI.Button(Rect(Screen.width*0.65,Screen.height*0.40, Screen.width*0.10, Screen.width*0.10),"", "CubeButton"))
	{
		isLoading = true;
		Application.LoadLevel("CubeLevel"); 
	}
	
	if(GUI.Button(Rect(Screen.width*0.40,Screen.height*0.75, 320, 80), "Back"))
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
@script AddComponentMenu("GUI/SelectionScreenGUI");