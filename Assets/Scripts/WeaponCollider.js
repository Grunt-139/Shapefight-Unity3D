#pragma strict

var playerStatus : PlayerStatus;
playerStatus.GetComponent(PlayerStatus);

var target : Transform;

private var enemies : GameObject[] ;


function Awake(){
	loadEnemies();
}

function OnTriggerEnter(collision : Collider) 
{
	for(var enemy : GameObject in enemies)
	{
		if(enemy == null)
		{
			continue;
		}
		var enemyController = enemy.GetComponent(EnemyAIController);
		if(enemy == collision.gameObject && !enemyController.isDead())
		{
			enemyController.death();
			playerStatus.increaseKills(1);
		}
	}
	
}

function loadEnemies(){
	enemies = GameObject.FindGameObjectsWithTag(target.tag);

}

@script AddComponentMenu("Combat/WeaponCollider");