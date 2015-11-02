#pragma strict

function OnTriggerEnter(collision : Collider) 
{
	if(collision.gameObject.tag == "PlayerCube")
	{
		var cubeController : CubeController = collision.gameObject.GetComponent(CubeController);
		cubeController.death();
	}
	else if(collision.gameObject.tag == "PlayerSphere")
	{
		var sphereController : SphereController = collision.gameObject.GetComponent(SphereController);
		sphereController.death();
	}
	
}

@ script AddComponentMenu("Combat/EnemyWeaponCollider");