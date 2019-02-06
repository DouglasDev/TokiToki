import "phaser"
import "./NgramAndSimilarityIndex"

//language processing
function toki(){
	let tokiMi=document.getElementById("miToki").value
	document.getElementById("mi").innerText=
	tokiMi;
	document.getElementById("miToki").value='';
	analyzeToki(tokiMi);
}
function analyzeToki(toki){

}

function addSona(soma){
	for (let i=5;i>=0;i--){
		document.getElementById("kamaSoma"+(i+1)).value=
		document.getElementById("kamaSoma"+i).value
	}
	document.getElementById("kamaSoma0").value=soma
}



var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
    default: 'arcade',
    	arcade: {
        	//gravity: { y: 300 },
        	debug: false
    	}
	}
};


//phaser
var game = new Phaser.Game(config);

function preload (){
	this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );

}

var platforms;

function create (){
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
}

function update (){
}
