#pragma strict

var customSkin: GUISkin;
var creditBG: Texture2D;
var mainTitle : Texture2D;

private var isLoading: boolean;

function OnGUI(){

	if(customSkin)
	{
		GUI.skin = customSkin;
	}
		
	GUI.Box(Rect(0, 0, Screen.width, Screen.height), " ");
	GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), creditBG);
	GUI.Label(Rect(Screen.width*0.37, Screen.height - Screen.height*0.9999, mainTitle.width, mainTitle.height), mainTitle);
	
	GUI.Label(Rect(Screen.width*0.25, Screen.height *0.25, Screen.width *0.5, Screen.height*0.5), "Lead Programmer: Will Stieh \nLead Designer: Will Stieh \nLead Artist: Will Stieh\nPretty much a one man show \n\nThank you for playing Shape Fight, I hope you had as much fun playing it as I did building it!");
	
	if(GUI.Button(Rect(Screen.width*0.10,Screen.height*0.80, 320, 80), "Back"))
	{
		isLoading = true;
		Application.LoadLevel("MainMenu");
	}
}

@script ExecuteInEditMode();
@script AddComponentMenu("GUI/CreditsGUI");