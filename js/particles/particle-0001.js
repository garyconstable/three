
var particle = function()
{
  this.position  = new THREE.Vector3(
      Math.floor(Math.random() * 1001) - 500,
      Math.floor(Math.random() * 1001) - 500,
      Math.floor(Math.random() * 1001) - 500
  ),
  this.velocity  = new THREE.Vector3(0,0,0),
  this.force  = new THREE.Vector3(0,0,0),
  this.color  = new THREE.Color(0xffffff),
  this.basecolor  = new THREE.Color(0x000000),
  this.life  = 0.0,
  this.available  = true

  return this;
}
